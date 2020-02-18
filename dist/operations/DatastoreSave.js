"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const DatastoreOperation_1 = require("./DatastoreOperation");
const Core_1 = require("../Core");
const BasicUtils_1 = require("../utility/BasicUtils");
const buildDataFromSchema_1 = require("../utility/buildDataFromSchema");
const extractSavedIds_1 = require("../utility/extractSavedIds");
const replaceIncompleteWithAllocatedIds_1 = require("../utility/replaceIncompleteWithAllocatedIds");
const Messaging_1 = require("../Messaging");
const __1 = require("..");
const serializeJsonProperties_1 = require("../utility/serializeJsonProperties");
const DebugUtils_1 = require("../debugging/DebugUtils");
const convertSaveEntitesToRegular_1 = require("../utility/convertSaveEntitesToRegular");
const convertDatastoreDataToRegular_1 = require("../utility/convertDatastoreDataToRegular");
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
class DatastoreSave extends DatastoreOperation_1.default {
    constructor(model, data) {
        super(model);
        this.ignoreAnc = false;
        this.generate = false;
        this.transAllocateIds = false;
        this.returnSaved = false;
        this.useCache = this.useCache ? Core_1.default.Instance.cacheDefaults.onSave : false;
        if (Array.isArray(data)) {
            this.dataObjects = data;
        }
        else {
            this.dataObjects = [data];
        }
    }
    useTransaction(transaction, options = {
        allocateIdsNow: false,
    }) {
        super.useTransaction(transaction);
        this.transAllocateIds = options.allocateIdsNow;
        return this;
    }
    generateUnsetIds() {
        this.generate = true;
        return this;
    }
    ignoreDetectedAncestors() {
        this.ignoreAnc = true;
        return this;
    }
    returnSavedEntities() {
        this.returnSaved = true;
        return this;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const baseKey = this.getBaseKey();
            const cachingEnabled = this.useCache && Core_1.default.Instance.cacheStore != null && Core_1.default.Instance.cacheStore.cacheOnSave;
            const cachableEntitySourceData = [];
            const entities = this.dataObjects.map(data => {
                let setAncestors = baseKey;
                let id = null;
                const entityKey = data[Core_1.default.Instance.dsModule.KEY];
                if (this.hasIdProperty && data[this.idProperty] != null) {
                    switch (this.idType) {
                        case "string": {
                            if (typeof data[this.idProperty] === "string") {
                                if (data[this.idProperty].length === 0) {
                                    Messaging_1.throwError(Messaging_1.CreateMessage.OPERATION_STRING_ID_EMPTY(this.model, "SAVE"));
                                }
                                id = data[this.idProperty];
                            }
                            break;
                        }
                        case "int": {
                            if (BasicUtils_1.isNumber(data[this.idProperty])) {
                                id = Core_1.default.Instance.dsModule.int(data[this.idProperty]);
                            }
                            break;
                        }
                    }
                    if (id == null) {
                        Messaging_1.throwError(Messaging_1.CreateMessage.OPERATION_DATA_ID_TYPE_ERROR(this.model, "SAVE", data[this.idProperty]));
                    }
                }
                else {
                    if (entityKey && entityKey.path && entityKey.path.length > 0 && entityKey.path.length % 2 === 0) {
                        if (entityKey.hasOwnProperty("id")) {
                            id = Core_1.default.Instance.dsModule.int(entityKey.id);
                        }
                        else {
                            id = entityKey.name;
                        }
                    }
                    else {
                        if (this.hasIdProperty && (this.idType === "string" || !this.generate)) {
                            Messaging_1.throwError(Messaging_1.CreateMessage.OPERATION_MISSING_ID_ERROR(this.model, "SAVE"));
                        }
                    }
                }
                if (!this.ignoreAnc && entityKey && entityKey.parent) {
                    if (setAncestors.length === 0) {
                        setAncestors = entityKey.parent.path;
                    }
                    else {
                        const prevAncestors = entityKey.parent.path.toString();
                        const nextAncestors = setAncestors.toString();
                        if (prevAncestors !== nextAncestors) {
                            Messaging_1.warn(Messaging_1.CreateMessage.OPERATION_CHANGED_ANCESTORS_WARNING(this.model, "SAVE", prevAncestors, nextAncestors));
                        }
                    }
                }
                if (this.runValidation && this.model.entityPebbleSchema != null) {
                    // const validation = Core.Joi.validate(data, this.model.entityPebbleSchema.__getJoiSchema());
                    const validation = this.model.entityPebbleSchema.__getJoiSchema().validate(data);
                    if (validation.error != null) {
                        Messaging_1.throwError(`On save entity of kind -> ${this.model.entityKind} : ${validation.error.message}`);
                    }
                }
                const key = id
                    ? this.createFullKey(setAncestors.concat([this.kind, id]), entityKey)
                    : this.createFullKey(setAncestors.concat([this.kind]), entityKey);
                const generated = (id == null);
                if (entityKey) {
                    delete data[Core_1.default.Instance.dsModule.KEY];
                }
                const { dataObject, excludeFromIndexes } = buildDataFromSchema_1.default(data, this.schema, this.kind);
                if (cachingEnabled) {
                    cachableEntitySourceData.push({ key, data: convertDatastoreDataToRegular_1.convertDatastoreDataToRegularData(dataObject, this.schema), generated });
                }
                return {
                    key,
                    excludeFromIndexes,
                    generated,
                    data: dataObject,
                };
            });
            DebugUtils_1.debugPoint(__1.EDebugPointId.ON_SAVE_BUILT_ENTITIES, entities);
            if (this.transaction) {
                if (this.transAllocateIds) {
                    const { newEntities, ids } = yield replaceIncompleteWithAllocatedIds_1.default(entities, this.transaction);
                    this.transaction.save(newEntities);
                    return Object.assign({ generatedIds: ids }, this.returnSaved && {
                        savedEntities: convertSaveEntitesToRegular_1.convertSaveEntitiesToRegular(newEntities, this.idProperty, this.idType, this.schema),
                    });
                }
                this.transaction.save(entities);
                return Object.assign({ get generatedIds() {
                        Messaging_1.warn(Messaging_1.CreateMessage.ACCESS_TRANSACTION_GENERATED_IDS_ERROR);
                        return [null];
                    } }, this.returnSaved && {
                    savedEntities: convertSaveEntitesToRegular_1.convertSaveEntitiesToRegular(entities, this.idProperty, this.idType, this.schema),
                });
            }
            return Core_1.default.Instance.dsModule.save(entities).then((data) => {
                const saveResponse = extractSavedIds_1.default(data)[0];
                if (cachingEnabled && cachableEntitySourceData.length > 0) {
                    const cacheEntities = [];
                    for (let i = 0; i < cachableEntitySourceData.length; i += 1) {
                        cacheEntities.push(Object.assign({ [Core_1.default.Instance.dsModule.KEY]: cachableEntitySourceData[i].key }, cachableEntitySourceData[i].data));
                        // Get the generated IDs from the save response (it returns the generated IDs on save)
                        if (cachableEntitySourceData[i].generated) {
                            cacheEntities[i][Core_1.default.Instance.dsModule.KEY].path.push(saveResponse.generatedIds[i]);
                            if (this.idType === "int") {
                                cacheEntities[i][Core_1.default.Instance.dsModule.KEY].id = saveResponse.generatedIds[i];
                            }
                            else {
                                cacheEntities[i][Core_1.default.Instance.dsModule.KEY].name = saveResponse.generatedIds[i];
                            }
                        }
                    }
                    if (cacheEntities.length > 0) {
                        serializeJsonProperties_1.default(cacheEntities, this.schema);
                        Core_1.default.Instance.cacheStore.setEntitiesAfterLoadOrSave(cacheEntities, this.cachingTimeSeconds);
                    }
                }
                if (this.returnSaved) {
                    return {
                        generatedIds: saveResponse.generatedIds,
                        savedEntities: convertSaveEntitesToRegular_1.convertSaveEntitiesToRegular(entities.map((e, i) => {
                            if (e.generated) {
                                e.key.path.push(saveResponse.generatedIds[i]);
                                if (this.idType === "int") {
                                    e.key.id = saveResponse.generatedIds[i];
                                }
                                else {
                                    e.key.name = saveResponse.generatedIds[i];
                                }
                            }
                            return e;
                        }), this.idProperty, this.idType, this.schema),
                    };
                }
                return saveResponse;
            });
        });
    }
}
exports.default = DatastoreSave;
//# sourceMappingURL=DatastoreSave.js.map