import DatastoreOperation from "./DatastoreOperation";
import PebblebedModel from "../PebblebedModel";
import Core from "../Core";
import { isNumber } from "../utility/BasicUtils";
import augmentEntitiesWithIdProperties from "../utility/augmentEntitiesWithIdProperties";
import { CreateMessage, errorNoThrow, throwError, warn } from "../Messaging";
import { TReturnOnly } from "../";
import pickOutEntityFromResults from "../utility/pickOutEntityFromResults";
import deserializeJsonProperties from "../utility/deserializeJsonProperties";
import { Key, PathType } from "@google-cloud/datastore";

export interface IDatastoreLoadSingleReturn<T> extends DatastoreOperation<T> {
  // first(): IDatastoreLoadSingleReturn<T>;
  // last(): IDatastoreLoadSingleReturn<T>;
  // randomOne(): IDatastoreLoadSingleReturn<T>;
  run(): Promise<T | null>;

  run(throwIfNotFound: true): Promise<T>;
}

export interface IDatastoreLoadRegular<T> extends DatastoreOperation<T> {
  first(): IDatastoreLoadSingleReturn<T>;

  last(): IDatastoreLoadSingleReturn<T>;

  randomOne(): IDatastoreLoadSingleReturn<T>;

  run(): Promise<Array<T>>;

  run(throwIfNotFound: true): Promise<Array<T>>;
}

export default class DatastoreLoad<T> extends DatastoreOperation<T> implements IDatastoreLoadRegular<T> {
  private loadIds: (PathType | Key)[] = [];
  private usingKeys = false;
  private returnOnlyEntity: TReturnOnly | null = null;

  constructor(
    model: PebblebedModel<T>,
    idsOrKeys: string | number | Key | (Key | string | number)[]
  ) {
    super(model);

    this.useCache = this.useCache ? Core.Instance.cacheDefaults.onLoad : false;

    if (idsOrKeys != null) {
      if (Array.isArray(idsOrKeys)) {
        this.loadIds = idsOrKeys;
      } else {
        this.loadIds = [idsOrKeys];
      }

      if (typeof this.loadIds[0] === "object") {
        if ((this.loadIds[0] as Key).kind === this.kind) {
          this.usingKeys = true;
        } else {
          throwError(CreateMessage.OPERATION_KEYS_WRONG(this.model, "LOAD"));
        }
      } else {
        this.loadIds = this.loadIds.map(id => {
          if (this.idType === "int" && isNumber(id)) {
            return Core.Instance.dsModule.int(id);
          } else if (this.idType === "string" && typeof id === "string") {
            if (id.length === 0) {
              throwError(CreateMessage.OPERATION_STRING_ID_EMPTY(this.model, "LOAD"));
            }

            return id;
          }

          throwError(CreateMessage.OPERATION_DATA_ID_TYPE_ERROR(this.model, "LOAD", id));
          return "";
        });
      }
    }
  }

  public first() {
    this.returnOnlyEntity = "FIRST";
    return this;
  }

  public last() {
    this.returnOnlyEntity = "LAST";
    return this;
  }

  public randomOne() {
    this.returnOnlyEntity = "RANDOM";
    return this;
  }

  public async run(throwIfNotFound: boolean = false) {
    let loadKeys: Key[];

    if (this.usingKeys) {
      loadKeys = this.loadIds.map(this.augmentKey);
    } else {
      const baseKey = this.getBaseKey();
      loadKeys = (this.loadIds as PathType[]).map(id => this.createFullKey(baseKey.concat(this.kind, id)));
    }

    let resp;

    if (this.transaction) {
      resp = await this.transaction.get(loadKeys);
    } else {
      if (this.useCache && Core.Instance.cacheStore != null && Core.Instance.cacheStore.cacheOnLoad) {
        let cachedEntities: any[] | null = null;

        try {
          cachedEntities = await Core.Instance.cacheStore.getEntitiesByKeys(loadKeys);
        } catch (e) {
          errorNoThrow(`Loading from cache error: ${e.message}`);
          console.error(e);
        }

        if (cachedEntities != null && cachedEntities.length > 0) {
          resp = [];
          resp.push(cachedEntities.map((entity, index) => {
            entity[Core.Instance.dsModule.KEY] = loadKeys[index];
            return entity;
          }));
        } else {
          resp = await Core.Instance.dsModule.get(loadKeys);

          if (resp[0].length > 0) {
            Core.Instance.cacheStore.setEntitiesAfterLoadOrSave(resp[0], this.cachingTimeSeconds);
          }
        }
      } else {
        resp = await Core.Instance.dsModule.get(loadKeys);
      }
    }

    let entities = resp[0];

    if (entities.length === 0 && throwIfNotFound) {
      console.error(`Couldn't find ${this.model.entityKind} entity(s) with specified key(s):\n${loadKeys.map((loadKey) => `(ns)${loadKey.namespace}->${loadKey.path.join(":")}`).join("\n")}`);
      throwError(`Couldn't find ${this.model.entityKind} entity(s) with specified key(s), see server log for more detail`);
    }

    if (this.returnOnlyEntity != null) {
      entities = [pickOutEntityFromResults(entities, this.returnOnlyEntity)];

      if (entities[0] == null) {
        return null;
      }
    }

    if (this.hasIdProperty && entities.length > 0) {
      augmentEntitiesWithIdProperties(entities, this.idProperty!, this.idType, this.kind);
    }

    deserializeJsonProperties(entities, this.schema);

    return this.returnOnlyEntity != null ? entities[0] : entities;
  }
}
