import DatastoreOperation from "./DatastoreOperation";
import PebblebedModel from "../PebblebedModel";
import Core from "../Core";
import { isNumber } from "../utility/BasicUtils";
import { CreateMessage, throwError, warn } from "../Messaging";
import { DatastoreEntityKey } from "../types/PebblebedTypes";

export default class DatastoreDelete extends DatastoreOperation {
  private dataObjects: any[];
  private deleteIds: Array<string | number | DatastoreEntityKey> = [];
  private useIds = false;
  private ignoreAnc = false;
  private usingKeys = false;

  constructor(model: PebblebedModel, data?: object | object[]) {
    super(model);

    if (data) {
      if (Array.isArray(data)) {
        this.dataObjects = data;
      } else {
        this.dataObjects = [data];
      }
    } else {
      this.useIds = true;
    }
  }

  /*public id(id: string | number) {
    this.deleteIds = [id];
    return this;
  }

  public ids(ids: Array<string | number>) {
    this.deleteIds = ids;
    return this;
  }*/

  public idsOrKeys(idsOrKeys: string | number | DatastoreEntityKey | Array<string | number | DatastoreEntityKey>) {
    if (Array.isArray(idsOrKeys)) {
      this.deleteIds = idsOrKeys;
    } else {
      this.deleteIds = [idsOrKeys];
    }

    if (typeof this.deleteIds[0] === "object") {
      if ((this.deleteIds[0] as DatastoreEntityKey).kind === this.kind) {
        this.usingKeys = true;
      } else {
        throwError(CreateMessage.OPERATION_KEYS_WRONG(this.model, "DELETE"));
      }
    } else {
      this.deleteIds = this.deleteIds.map(id => {
        if (this.idType === "int" && isNumber(id)) {
          return Core.Instance.dsModule.int(id);
        } else if (this.idType === "string" && typeof id === "string") {
          if (id.length === 0) {
            throwError(CreateMessage.OPERATION_STRING_ID_EMPTY(this.model, "DELETE"));
          }

          return id;
        }

        throwError(CreateMessage.OPERATION_DATA_ID_TYPE_ERROR(this.model, "DELETE", id));
      });
    }

    return this;
  }

  public ignoreDetectedAncestors() {
    this.ignoreAnc = true;
    return this;
  }

  public async run() {
    const baseKey = this.getBaseKey();
    let deleteKeys = [];

    if (!this.useIds) {
      for (const data of this.dataObjects) {
        let setAncestors = baseKey;
        let id = null;
        const entityKey = data[Core.Instance.dsModule.KEY];

        if (this.hasIdProperty && data[this.idProperty] != null) {
          switch (this.idType) {
            case "int":
              if (isNumber(data[this.idProperty])) {
                id = Core.Instance.dsModule.int(data[this.idProperty]);
              }
              break;
            case "string":
              if (typeof data[this.idProperty] === "string") {
                if (data[this.idProperty].length === 0) {
                  throwError(CreateMessage.OPERATION_STRING_ID_EMPTY(this.model, "DELETE"));
                }

                id = data[this.idProperty];
              }
              break;
          }

          if (id == null) {
            throwError(
              CreateMessage.OPERATION_DATA_ID_TYPE_ERROR(this.model, "DELETE", data[this.idProperty])
            );
          }
        } else if (entityKey != null) {
          if (entityKey.hasOwnProperty("id")) {
            id = Core.Instance.dsModule.int(entityKey.id);
          } else {
            id = entityKey.name;
          }
        } else {
          throwError(CreateMessage.DELETE_NO_DATA_IDS_ERROR);
        }

        if (entityKey && entityKey.parent && !this.ignoreAnc) {
          if (setAncestors.length === 0) {
            setAncestors = entityKey.parent.path;
          } else {
            const prevAncestors = entityKey.parent.path.toString();
            const nextAncestors = setAncestors.toString();

            if (prevAncestors !== nextAncestors) {
              warn(
                CreateMessage.OPERATION_CHANGED_ANCESTORS_WARNING(
                  this.model,
                  "DELETE",
                  prevAncestors,
                  nextAncestors
                )
              );
            }
          }
        }

        deleteKeys.push(this.createFullKey(setAncestors.concat([this.kind, id]), entityKey));
      }
    } else if (this.usingKeys) {
      deleteKeys = this.deleteIds.map(this.augmentKey);
    } else {
      deleteKeys = this.deleteIds.map(id => this.createFullKey(baseKey.concat(this.kind, id)));
    }

    let deleteResponse;

    if (this.transaction) {
      deleteResponse = await this.transaction.delete(deleteKeys);
    } else {
      deleteResponse = await Core.Instance.ds.delete(deleteKeys);
    }

    if (Core.Instance.cacheStore != null) {
      Core.Instance.cacheStore.flushEntitiesByKeys(deleteKeys);
    }

    return deleteResponse;
  }
}
