import DatastoreOperation from "./DatastoreOperation";
import PebblebedModel from "../PebblebedModel";
import Core from "../Core";
import { isNumber } from "../utility/BasicUtils";
import buildDataFromSchema from "../utility/buildDataFromSchema";
import extractSavedIds from "../utility/extractSavedIds";
import replaceIncompleteWithAllocatedIds from "../utility/replaceIncompleteWithAllocatedIds";
import { CreateMessage, throwError, warn } from "../Messaging";
import { EDebugPointId, IPebblebedSaveEntity } from "..";
import serializeJsonProperties from "../utility/serializeJsonProperties";
import { debugPoint } from "../debugging/DebugUtils";
import { convertSaveEntitiesToRegular } from "../utility/convertSaveEntitesToRegular";
import { convertDatastoreDataToRegularData } from "../utility/convertDatastoreDataToRegular";
import { Key } from "@google-cloud/datastore";

interface IOSaveRunResponse<T> {
  generatedIds: (string | null)[],
  savedEntities?: T[]
}

/*export interface IDatastoreSaveReturnEntities<T> extends DatastoreOperation<T> {
  useTransaction(
    transaction: any,
    options?: {
      allocateIdsNow?: boolean,
    }
  ): IDatastoreSaveRegular<T>;
  run(): Promise<{ generatedIds: (string|null)[], savedEntities?: T[] }>;
}

export interface IDatastoreSaveRegular<T> extends DatastoreOperation<T> {
  useTransaction(
    transaction: any,
    options?: {
      allocateIdsNow?: boolean,
    }
  ): IDatastoreSaveRegular<T>;
  returnSavedEntities(): IDatastoreSaveReturnEntities<T>;
  run(): Promise<{ generatedIds: (string|null)[] }>;
}*/

export default class DatastoreSave<T, R extends IOSaveRunResponse<T> = { generatedIds: (string | null)[] }> extends DatastoreOperation<T> {
  private dataObjects: any[];
  private ignoreAnc = false;
  private generate = false;
  private transAllocateIds = false;
  private returnSaved = false;

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

  public returnSavedEntities(): DatastoreSave<T, { generatedIds: (string | null)[], savedEntities: T[] }> {
    this.returnSaved = true;
    return this as DatastoreSave<T, { generatedIds: (string | null)[], savedEntities: T[] }>;
  }

  public async run(): Promise<R> {
    const baseKey = this.getBaseKey();

    const cachingEnabled = this.useCache && Core.Instance.cacheStore != null && Core.Instance.cacheStore.cacheOnSave;
    const cachableEntitySourceData: any[] = [];

    const entities: IPebblebedSaveEntity<T>[] = this.dataObjects.map((data): IPebblebedSaveEntity<T> => {
      let setAncestors = baseKey;
      let id: string | null = null;
      const entityKey: Key = data[Core.Instance.dsModule.KEY];

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
              id = Core.Instance.dsModule.int(data[this.idProperty!]).value;
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
            id = Core.Instance.dsModule.int(entityKey.id!).value;
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
        // const validation = Core.Joi.validate(data, this.model.entityPebbleSchema.__getJoiSchema());
        const validation = this.model.entityPebbleSchema.__getJoiSchema().validate(data);

        if (validation.error != null) {
          throwError(`On save entity of kind -> ${this.model.entityKind} : ${validation.error.message}`);
        }
      }

      const key = id
        ? this.createFullKey(setAncestors.concat([this.kind, id]), entityKey)
        : this.createFullKey(setAncestors.concat([this.kind]), entityKey);

      const generated = (id == null);

      if (entityKey) {
        delete data[Core.Instance.dsModule.KEY];
      }

      const {dataObject, excludeFromIndexes} = buildDataFromSchema(data, this.schema, this.kind);

      if (cachingEnabled) {
        cachableEntitySourceData.push({
          key,
          data: convertDatastoreDataToRegularData(dataObject, this.schema),
          generated
        })
      }

      return {
        key,
        excludeFromIndexes,
        generated,
        data: dataObject as T,
      };
    });

    debugPoint(EDebugPointId.ON_SAVE_BUILT_ENTITIES, entities);

    if (this.transaction) {
      if (this.transAllocateIds) {
        const {newEntities, ids} = await replaceIncompleteWithAllocatedIds<T>(entities, this.transaction);
        this.transaction.save(newEntities);

        return {
          generatedIds: ids,
          ...this.returnSaved && {
            savedEntities: convertSaveEntitiesToRegular(newEntities, this.idProperty, this.idType, this.schema),
          },
        } as R;
      }

      this.transaction.save(entities);

      return {
        get generatedIds() {
          warn(CreateMessage.ACCESS_TRANSACTION_GENERATED_IDS_ERROR);
          return [null];
        },
        ...this.returnSaved && {
          savedEntities: convertSaveEntitiesToRegular(entities, this.idProperty, this.idType, this.schema),
        },
      } as R;
    }

    return Core.Instance.dsModule.save(entities).then((data): R => {
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

      if (this.returnSaved) {
        return {
          generatedIds: saveResponse.generatedIds,
          savedEntities: convertSaveEntitiesToRegular(entities.map((e, i) => {
            if (e.generated) {
              e.key.path.push(saveResponse.generatedIds[i]);

              if (this.idType === "int") {
                e.key.id = saveResponse.generatedIds[i];
              } else {
                e.key.name = saveResponse.generatedIds[i];
              }
            }
            return e;
          }), this.idProperty, this.idType, this.schema),
        } as R
      }

      return saveResponse as R;
    });
  }
}
