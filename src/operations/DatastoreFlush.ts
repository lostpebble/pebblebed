import { DatastoreBaseOperation } from "./DatastoreOperation";
import PebblebedModel from "../PebblebedModel";
import Core from "../Core";
import { isNumber } from "../utility/BasicUtils";
import { CreateMessage, throwError, warn } from "../Messaging";
import { Key, PathType } from "@google-cloud/datastore";

export default class DatastoreFlush<T> extends DatastoreBaseOperation<T> {
  private flushIds: Array<PathType | Key> = [];
  private usingKeys = false;

  constructor(
    model: PebblebedModel<T>,
    idsOrKeys: string | number | Key | Array<string | number | Key>
  ) {
    super(model);

    if (idsOrKeys != null) {
      if (Array.isArray(idsOrKeys)) {
        this.flushIds = idsOrKeys;
      } else {
        this.flushIds = [idsOrKeys];
      }

      if (typeof this.flushIds[0] === "object") {
        if ((this.flushIds[0] as Key).kind === this.kind) {
          this.usingKeys = true;
        } else {
          throwError(CreateMessage.OPERATION_KEYS_WRONG(this.model, "FLUSH IN CACHE"));
        }
      } else {
        this.flushIds = this.flushIds.map(id => {
          if (this.idType === "int" && isNumber(id)) {
            return Core.Instance.dsModule.int(id);
          } else if (this.idType === "string" && typeof id === "string") {
            if (id.length === 0) {
              throwError(CreateMessage.OPERATION_STRING_ID_EMPTY(this.model, "FLUSH IN CACHE"));
            }

            return id;
          }

          throwError(CreateMessage.OPERATION_DATA_ID_TYPE_ERROR(this.model, "FLUSH IN CACHE", id));
          return "";
        });
      }
    }
  }

  public async run() {
    let flushKeys: Key[];

    if (this.usingKeys) {
      flushKeys = this.flushIds.map(this.augmentKey);
    } else {
      const baseKey = this.getBaseKey();

      flushKeys = (this.flushIds as PathType[]).map(id => {
        return this.createFullKey(baseKey.concat(this.kind, id));
      });
    }

    if (Core.Instance.cacheStore != null) {
      await Core.Instance.cacheStore.flushEntitiesByKeys(flushKeys);
    } else {
      warn(`Trying to flush some ids / keys of [${this.kind}] - but no Cache Store has been set on Pebblebed instance!`);
    }
  }
}
