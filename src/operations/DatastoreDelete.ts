import DatastoreOperation from "./DatastoreOperation";
import PebblebedModel from "../PebblebedModel";
import Core from "../Core";
import { isNumber } from "../utility/BasicUtils";
import { CreateMessage, throwError, warn } from "../Messaging";

export default class DatastoreDelete extends DatastoreOperation {
  private dataObjects: any[];
  private deleteIds: Array<string | number> = [];
  private useIds = false;
  private ignoreAnc = false;

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

  public id(id: string | number) {
    this.deleteIds = [id];
    return this;
  }

  public ids(ids: Array<string | number>) {
    this.deleteIds = ids;
    return this;
  }

  public ignoreDetectedAncestors() {
    this.ignoreAnc = true;
    return this;
  }

  public run() {
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

        deleteKeys.push(this.createFullKey(setAncestors.concat([this.kind, id])));
      }
    } else {
      deleteKeys = this.deleteIds.map(id => {
        return this.createFullKey(baseKey.concat([this.kind, id]));
      });
    }

    if (this.transaction) {
      return this.transaction.delete(deleteKeys);
    }

    return Core.Instance.ds.delete(deleteKeys);
  }
}
