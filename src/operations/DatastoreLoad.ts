import { DatastoreEntityKey } from "../types/PebblebedTypes";
import DatastoreOperation from "./DatastoreOperation";
import PebblebedModel from "../PebblebedModel";
import Core from "../Core";
import { isNumber } from "../utility/BasicUtils";
import augmentEntitiesWithIdProperties from "../utility/augmentEntitiesWithIdProperties";
import { CreateMessage, throwError } from "../Messaging";

export default class DatastoreLoad extends DatastoreOperation {
  private loadIds: Array<string | number | DatastoreEntityKey> = [];
  private usingKeys = false;

  constructor(
    model: PebblebedModel,
    idsOrKeys: string | number | DatastoreEntityKey | Array<string | number | DatastoreEntityKey>
  ) {
    super(model);

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

  public async run() {
    let loadKeys;

    if (this.usingKeys) {
      loadKeys = this.loadIds.map(key => {
        return this.createFullKey((key as DatastoreEntityKey).path);
      });
    } else {
      const baseKey = this.getBaseKey();

      loadKeys = this.loadIds.map(id => {
        return this.createFullKey(baseKey.concat(this.kind, id));
      });
    }

    let resp;

    if (this.transaction) {
      resp = await this.transaction.get(loadKeys);
    } else {
      resp = await Core.Instance.ds.get(loadKeys);
    }

    if (this.hasIdProperty && resp[0].length > 0) {
      augmentEntitiesWithIdProperties(resp[0], this.idProperty, this.idType, this.kind);
    }

    return resp[0];
  }
}
