import DatastoreOperation from "./DatastoreOperation";
import PebblebedModel from "../PebblebedModel";
import Core from "../Core";
import { isNumber } from "../utility/BasicUtils";
import buildDataFromSchema from "../utility/buildDataFromSchema";
import extractSavedIds from "../utility/extractSavedIds";
import replaceIncompleteWithAllocatedIds from "../utility/replaceIncompleteWithAllocatedIds";
import { CreateMessage, throwError, warn } from "../Messaging";

export default class DatastoreSave extends DatastoreOperation {
  private dataObjects: any[];
  private ignoreAnc = false;
  private generate = false;
  private transAllocateIds = false;

  constructor(model: PebblebedModel, data: object | object[]) {
    super(model);

    if (Array.isArray(data)) {
      this.dataObjects = data;
    } else {
      this.dataObjects = [data];
    }
  }

  public useTransaction(
    transaction: any,
    options = {
      allocateIdsNow: false,
    }
  ) {
    super.useTransaction(transaction);
    this.transAllocateIds = options.allocateIdsNow;
    return this;
  }

  public generateUnsetIds() {
    this.generate = true;
    return this;
  }

  public ignoreDetectedAncestors() {
    this.ignoreAnc = true;
    return this;
  }

  public async run() {
    const baseKey = this.getBaseKey();

    const entities = this.dataObjects.map(data => {
      let setAncestors = baseKey;
      let id = null;
      const entityKey = data[Core.Instance.dsModule.KEY];

      if (this.hasIdProperty && data[this.idProperty] != null) {
        switch (this.idType) {
          case "string": {
            if (typeof data[this.idProperty] === "string") {
              if (data[this.idProperty].length === 0) {
                throwError(CreateMessage.OPERATION_STRING_ID_EMPTY(this.model, "SAVE"));
              }

              id = data[this.idProperty];
            }
            break;
          }
          case "int": {
            if (isNumber(data[this.idProperty])) {
              id = Core.Instance.dsModule.int(data[this.idProperty]);
            }
            break;
          }
        }

        if (id == null) {
          throwError(CreateMessage.OPERATION_DATA_ID_TYPE_ERROR(this.model, "SAVE", data[this.idProperty]));
        }
      } else {
        if (entityKey && entityKey.path && entityKey.path.length > 0 && entityKey.path.length % 2 === 0) {
          if (entityKey.hasOwnProperty("id")) {
            id = Core.Instance.dsModule.int(entityKey.id);
          } else {
            id = entityKey.name;
          }
        } else {
          if (this.hasIdProperty && (this.idType === "string" || !this.generate)) {
            throwError(CreateMessage.OPERATION_MISSING_ID_ERROR(this.model, "SAVE"));
          }
        }
      }

      if (!this.ignoreAnc && entityKey && entityKey.parent) {
        if (setAncestors.length === 0) {
          setAncestors = entityKey.parent.path;
        } else {
          const prevAncestors = entityKey.parent.path.toString();
          const nextAncestors = setAncestors.toString();

          if (prevAncestors !== nextAncestors) {
            warn(
              CreateMessage.OPERATION_CHANGED_ANCESTORS_WARNING(
                this.model,
                "SAVE",
                prevAncestors,
                nextAncestors
              )
            );
          }
        }
      }

      if (this.runValidation && this.model.entityJoiSchema !== null) {
        const validation = Core.Joi.validate(data, this.model.entityJoiSchema.__getJoiSchema());

        if (validation.error !== null) {
          throwError(`Pebblebed: Entity ( ${this.model.entityKind} ): ${validation.error}`);
        }
      }

      const key = id
        ? this.createFullKey(setAncestors.concat([this.kind, id]))
        : this.createFullKey(setAncestors.concat([this.kind]));

      const { dataObject, excludeFromIndexes } = buildDataFromSchema(data, this.schema, this.kind);

      return {
        key,
        excludeFromIndexes,
        generated: id == null,
        data: dataObject,
      };
    });

    if (this.transaction) {
      if (this.transAllocateIds) {
        const { newEntities, ids } = await replaceIncompleteWithAllocatedIds(entities, this.transaction);
        this.transaction.save(newEntities);

        return {
          generatedIds: ids,
        };
      }

      this.transaction.save(entities);

      return {
        get generatedIds() {
          warn(CreateMessage.ACCESS_TRANSACTION_GENERATED_IDS_ERROR);
          return null;
        },
      };
    }

    return Core.Instance.ds.save(entities).then(data => {
      return extractSavedIds(data)[0];
    });
  }
}
