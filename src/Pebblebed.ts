import {
  DatastoreEntityKey,
  DatastoreTransaction,
  IPebblebedModelOptions,
  SchemaDefinition,
} from "./types/PebblebedTypes";
import PebblebedModel from "./PebblebedModel";
import { get, set } from "./utility/BasicUtils";
import Core, { ICacheDefaults, UNSET_NAMESPACE } from "./Core";
import { CreateMessage, throwError, warn } from "./Messaging";
import { PebblebedJoiSchema } from "./validation/PebblebedValidation";
import { PebblebedCacheStore } from "./caching/PebblebedCacheStore";
import { TPebblebedJoiSchemaObject } from "./utility/JoiUtils";

export const Pebblebed = {
  connectDatastore: (datastore: any) => {
    Core.Instance.setDatastore(datastore);

    console.log("Connecting Pebbledbed to Datastore");
  },

  get ds() {
    return Core.Instance.dsModule;
  },

  /*get dsLibrary() {
    return Core.Instance.dsModule;
  },*/

  async flushCacheKeys(keys: DatastoreEntityKey[]) {
    if (Core.Instance.cacheStore) {
      await Core.Instance.cacheStore.flushEntitiesByKeys(keys);
    } else {
      warn(`Tried to flush keys in cache but there is no cache store connected.`);
    }
  },

  transaction: (): DatastoreTransaction => {
    return Core.Instance.dsModule.transaction();
  },

  combineSchemas: <T = any>(...schemas: PebblebedJoiSchema<Partial<T>>[]) => {
    const combinedSchemas = schemas.reduce(
      (accum, current: PebblebedJoiSchema<Partial<T>>) => Object.assign(accum, current.__getBasicSchemaObject()),
      {} as TPebblebedJoiSchemaObject<Partial<T>>
    ) as TPebblebedJoiSchemaObject<T>;

    return new PebblebedJoiSchema<T>(combinedSchemas);
  },

  createSchema: <T = any>(schema: TPebblebedJoiSchemaObject<T>): PebblebedJoiSchema<T> => {
    return new PebblebedJoiSchema<T>(schema);
  },

  createModel: <T = any>(
    entityKind: string,
    entitySchema: PebblebedJoiSchema<T>,
    options: IPebblebedModelOptions = {}
  ) => {
    return new PebblebedModel<T>(entityKind, entitySchema, options);
  },

  setCacheStore: (cacheStore: PebblebedCacheStore) => {
    Core.Instance.setCacheStore(cacheStore);
  },

  clearDefaultNamespace: () => {
    Core.Instance.setNamespace(UNSET_NAMESPACE);
  },

  setDefaultNamespace: (namespace: string | null) => {
    Core.Instance.setNamespace(namespace);
    /*if (namespace != null) {
      if (typeof namespace === "string") {
        if (namespace.length > 0) {
          Core.Instance.setNamespace(namespace);
        } else {
          Core.Instance.setNamespace(null);
        }
      } else {
        throwError(CreateMessage.SET_NAMESPACE_INCORRECT);
      }
    } else {
      Core.Instance.setNamespace(null);
    }*/
  },

  enableValidations(on: boolean = true) {
    Core.Instance.enableValidations(on);
  },

  enableCaching(on: boolean = true) {
    Core.Instance.enableCaching(on);
  },

  setDefaultCachingSeconds: (seconds: number) => {
    Core.Instance.defaultCachingSeconds = seconds;
  },

  setCacheEnabledOnSaveDefault(on: boolean) {
    Core.Instance.cacheDefaults.onSave = on;
  },

  setCacheEnabledOnLoadDefault(on: boolean) {
    Core.Instance.cacheDefaults.onLoad = on;
  },

  setCacheEnabledOnQueryDefault(on: boolean) {
    Core.Instance.cacheDefaults.onQuery = on;
  },

  setCacheEnabledDefaults(newDefaults: Partial<ICacheDefaults>) {
    Core.Instance.setCacheDefaults(newDefaults);
  },

  key(...args: any[]) {
    const keyPath: string[] = [];

    let currentIdType = "unknown";

    for (let i = 0; i < args.length; i += 1) {
      if (i % 2 === 0) {
        if (typeof args[i] !== "string") {
          keyPath.push((args[i] as PebblebedModel).entityKind);
          currentIdType = (args[i] as PebblebedModel).entityIdType;
        } else {
          keyPath.push(args[i]);
        }
      } else {
        if (currentIdType === "int") {
          keyPath.push(Core.Instance.dsModule.int(args[i]));
        } else {
          keyPath.push(args[i]);
        }

        currentIdType = "unknown";
      }
    }

    if (Core.Instance.namespace != null) {
      return Core.Instance.dsModule.key({
        path: keyPath,
        namespace: Core.Instance.namespace,
      });
    }

    return Core.Instance.dsModule.key(keyPath);
  },

  keysFromObjectArray<T>(sourceArray: T[], ...args: Array<PebblebedModel | keyof T>): DatastoreEntityKey[] {
    if (args.length % 2 !== 0) {
      throwError(CreateMessage.INCORRECT_ARGUMENTS_KEYS_FROM_ARRAY);
    }

    return sourceArray.map(source => {
      const keyPath: any[] = [];

      for (let i = 0; i < args.length; i += 2) {
        keyPath.push(args[i], source[args[i + 1] as keyof T]);
      }

      return Pebblebed.key(...keyPath);
    });
  },

  uniqueKeysFromObjectArray<T>(
    sourceArray: T[],
    ...args: Array<PebblebedModel | keyof T>
  ): DatastoreEntityKey[] {
    if (args.length % 2 !== 0) {
      throwError(CreateMessage.INCORRECT_ARGUMENTS_KEYS_FROM_ARRAY);
    }

    const obj = {};
    const keys: DatastoreEntityKey[] = [];

    for (const source of sourceArray) {
      const keyPath: any[] = [];
      const kindKeyPath: any[] = [];

      for (let i = 0; i < args.length; i += 2) {
        keyPath.push(args[i], source[args[i + 1] as keyof T]);
        kindKeyPath.push((args[i] as PebblebedModel).entityKind, source[args[i + 1] as keyof T]);
      }

      if (get(obj, kindKeyPath, false) === false) {
        keys.push(Pebblebed.key(...keyPath));
        set(obj, kindKeyPath, true);
      }
    }

    return keys;
  },
};
