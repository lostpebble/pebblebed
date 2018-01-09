import { DatastoreEntityKey } from "../types/PebblebedTypes";
import DatastoreOperation from "./DatastoreOperation";
import PebblebedModel from "../PebblebedModel";
import Core from "../Core";
import { isNumber } from "../utility/BasicUtils";
import augmentEntitiesWithIdProperties from "../utility/augmentEntitiesWithIdProperties";
import { CreateMessage, throwError } from "../Messaging";
import { TReturnOnly } from "../";
import pickOutEntityFromResults from "../utility/pickOutEntityFromResults";

export default class DatastoreLoad extends DatastoreOperation {
  private loadIds: Array<string | number | DatastoreEntityKey> = [];
  private usingKeys = false;
  private returnOnlyEntity: TReturnOnly = null;

  constructor(
    model: PebblebedModel,
    idsOrKeys: string | number | DatastoreEntityKey | Array<string | number | DatastoreEntityKey>
  ) {
    super(model);

    this.useCache = this.useCache ? Core.Instance.cacheEnabledOnLoadDefault : false;

    if (idsOrKeys != null) {
      if (Array.isArray(idsOrKeys)) {
        this.loadIds = idsOrKeys;
      } else {
        this.loadIds = [idsOrKeys];
      }

      if (typeof this.loadIds[0] === "object") {
        if ((this.loadIds[0] as DatastoreEntityKey).kind === this.kind) {
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

  public async run() {
    let loadKeys;

    if (this.usingKeys) {
      loadKeys = this.loadIds.map((key: DatastoreEntityKey) => {
        if (this.namespace != null) {
          key.namespace = this.namespace;
        } else if (Core.Instance.namespace != null) {
          key.namespace = Core.Instance.namespace;
        }

        return key;
      });
    } else {
      const baseKey = this.getBaseKey();

      loadKeys = this.loadIds.map(id => {
        return this.createFullKey(baseKey.concat(this.kind, id));
      });
    }

    let resp;

    console.log(loadKeys);

    if (this.transaction) {
      resp = await this.transaction.get(loadKeys);
    } else {
      if (this.useCache && Core.Instance.cacheStore != null && Core.Instance.cacheStore.cacheOnLoad) {
        let cachedEntities = await Core.Instance.cacheStore.getEntitiesByKeys(loadKeys);

        if (cachedEntities != null && cachedEntities.length > 0) {
          resp = [];
          resp.push(cachedEntities.map((entity, index) => {
            entity[Core.Instance.dsModule.KEY] = loadKeys[index];
            return entity;
          }));

          /*
          if (this.hasIdProperty) {
            augmentEntitiesWithIdProperties(cachedEntities, this.idProperty, this.idType, this.kind);
          }
          */

          // resp = cachedEntities;
        } else {
          resp = await Core.Instance.ds.get(loadKeys);

          if (resp[0].length > 0) {
            Core.Instance.cacheStore.setEntitiesAfterLoadOrSave(resp[0], this.cachingTimeSeconds);
          }
        }
      } else {
        resp = await Core.Instance.ds.get(loadKeys);
      }
    }

    // console.log(JSON.stringify(resp));

    if (this.hasIdProperty && resp[0].length > 0) {
      augmentEntitiesWithIdProperties(resp[0], this.idProperty, this.idType, this.kind);
    }

    if (this.returnOnlyEntity != null) {
      return pickOutEntityFromResults(resp[0], this.returnOnlyEntity);
      /*if (resp[0].length > 0) {
        if (this.returnOnlyEntity === "FIRST") {
          return resp[0][0];
        } else if (this.returnOnlyEntity === "LAST") {
          return resp[0][resp[0].length - 1];
        } else {
          const randomIndex = Math.floor(Math.random() * resp[0].length);
          return resp[0][randomIndex];
        }
      } else {
        return null;
      }*/
    }

    return resp[0];
  }
}
