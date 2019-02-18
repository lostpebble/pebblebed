import DatastoreOperation from "./DatastoreOperation";
import PebblebedModel from "../PebblebedModel";
import Core from "../Core";
import { isNumber } from "../utility/BasicUtils";
import buildDataFromSchema from "../utility/buildDataFromSchema";
import extractSavedIds from "../utility/extractSavedIds";
import replaceIncompleteWithAllocatedIds from "../utility/replaceIncompleteWithAllocatedIds";
import { CreateMessage, throwError, warn } from "../Messaging";
import { DatastoreEntityKey, EDebugPointId } from "..";
import serializeJsonProperties from "../utility/serializeJsonProperties";
import { debugPoint } from "../debugging/DebugUtils";

export default class DatastoreSave<T> extends DatastoreOperation<T> {
  private dataObjects: any[];
  private ignoreAnc = false;
  private generate = false;
  private transAllocateIds = false;

  constructor(model: PebblebedModel<T>, data: T | T[]) {
    super(model);

    this.useCache = this.useCache ? Core.Instance.cacheDefaults.onSave : false;

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

  public async run(): Promise<{ generatedIds: (string|null)[] }> {
    const baseKey = this.getBaseKey();

    const cachingEnabled = this.useCache && Core.Instance.cacheStore != null && Core.Instance.cacheStore.cacheOnSave;
    const cachableEntitySourceData: any[] = [];

    const entities = this.dataObjects.map(data => {
      let setAncestors = baseKey;
      let id: string|null = null;
      const entityKey: DatastoreEntityKey = data[Core.Instance.dsModule.KEY];

      if (this.hasIdProperty && data[this.idProperty!] != null) {
        switch (this.idType) {
          case "string": {
            if (typeof data[this.idProperty!] === "string") {
              if (data[this.idProperty!].length === 0) {
                throwError(CreateMessage.OPERATION_STRING_ID_EMPTY(this.model, "SAVE"));
              }

              id = data[this.idProperty!];
            }
            break;
          }
          case "int": {
            if (isNumber(data[this.idProperty!])) {
              id = Core.Instance.dsModule.int(data[this.idProperty!]);
            }
            break;
          }
        }

        if (id == null) {
          throwError(CreateMessage.OPERATION_DATA_ID_TYPE_ERROR(this.model, "SAVE", data[this.idProperty!]));
        }
      } else {
        if (entityKey && entityKey.path && entityKey.path.length > 0 && entityKey.path.length % 2 === 0) {
          if (entityKey.hasOwnProperty("id")) {
            id = Core.Instance.dsModule.int(entityKey.id);
          } else {
            id = entityKey.name!;
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

      if (this.runValidation && this.model.entityPebbleSchema != null) {
        const validation = Core.Joi.validate(data, this.model.entityPebbleSchema.__getJoiSchema());

        if (validation.error !== null) {
          throwError(`On save entity of kind -> ${this.model.entityKind} : ${validation.error}`);
        }
      }

      const key = id
        ? this.createFullKey(setAncestors.concat([this.kind, id]), entityKey)
        : this.createFullKey(setAncestors.concat([this.kind]), entityKey);

      const generated = (id == null);

      if (entityKey) {
        delete data[Core.Instance.dsModule.KEY];
      }

      if (cachingEnabled) {
        cachableEntitySourceData.push({ key, data, generated })
      }

      const { dataObject, excludeFromIndexes } = buildDataFromSchema(data, this.schema, this.kind);

      return {
        key,
        excludeFromIndexes,
        generated,
        data: dataObject,
      };
    });

    debugPoint(EDebugPointId.ON_SAVE_BUILT_ENTITIES, entities);

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
          return [null];
        },
      };
    }

    return Core.Instance.ds.save(entities).then(data => {
      const saveResponse = extractSavedIds(data)[0];

      if (cachingEnabled && cachableEntitySourceData.length > 0) {
        const cacheEntities: any[] = [];

        for (let i = 0; i < cachableEntitySourceData.length; i += 1) {
          cacheEntities.push({
            [Core.Instance.dsModule.KEY]: cachableEntitySourceData[i].key,
            ...cachableEntitySourceData[i].data,
          });

          // Get the generated IDs from the save response (it returns the generated IDs on save)
          if (cachableEntitySourceData[i].generated) {
            cacheEntities[i][Core.Instance.dsModule.KEY].path.push(saveResponse.generatedIds[i]);

            if (this.idType === "int") {
              cacheEntities[i][Core.Instance.dsModule.KEY].id = saveResponse.generatedIds[i];
            } else {
              cacheEntities[i][Core.Instance.dsModule.KEY].name = saveResponse.generatedIds[i];
            }
          }
        }

        if (cacheEntities.length > 0) {
          serializeJsonProperties(cacheEntities, this.schema);
          Core.Instance.cacheStore!.setEntitiesAfterLoadOrSave(cacheEntities, this.cachingTimeSeconds);
        }
      }

      return saveResponse;
    });
  }
}
