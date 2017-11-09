import { DatastoreEntityKey, DatastoreTransaction } from "./types/PebblebedTypes";
import PebblebedModel from "./PebblebedModel";
import { get, set } from "./utility/BasicUtils";
import Core from "./Core";
import { CreateMessage, throwError } from "./Messaging";

export const Pebblebed = {
  connectDatastore: (datastore: any) => {
    Core.Instance.setDatastore(datastore);

    console.log("Connecting Pebbledbed to Datastore");
  },
  transaction: (): DatastoreTransaction => {
    return Core.Instance.ds.transaction();
  },
  setDefaultNamespace: (namespace: string) => {
    if (namespace != null) {
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
    }
  },
  key(...args: any[]) {
    const keyPath = [];

    for (let i = 0; i < args.length; i += 1) {
      if (i % 2 === 0 && typeof args[i] !== "string") {
        keyPath.push((args[i] as PebblebedModel).entityKind);
      } else {
        keyPath.push(args[i]);
      }
    }

    return Core.Instance.ds.key(keyPath);
  },
  keysFromObjectArray<T>(sourceArray: T[], ...args: Array<PebblebedModel | keyof T>): DatastoreEntityKey[] {
    if (args.length % 2 !== 0) {
      throwError(CreateMessage.INCORRECT_ARGUMENTS_KEYS_FROM_ARRAY);
    }

    return sourceArray.map(source => {
      const keyPath = [];

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
      const keyPath = [];
      const kindKeyPath = [];

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
