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
const augmentEntitiesWithIdProperties_1 = require("../utility/augmentEntitiesWithIdProperties");
const Messaging_1 = require("../Messaging");
const pickOutEntityFromResults_1 = require("../utility/pickOutEntityFromResults");
const deserializeJsonProperties_1 = require("../utility/deserializeJsonProperties");
class DatastoreLoad extends DatastoreOperation_1.default {
    constructor(model, idsOrKeys) {
        super(model);
        this.loadIds = [];
        this.usingKeys = false;
        this.returnOnlyEntity = null;
        this.useCache = this.useCache ? Core_1.default.Instance.cacheDefaults.onLoad : false;
        if (idsOrKeys != null) {
            if (Array.isArray(idsOrKeys)) {
                this.loadIds = idsOrKeys;
            }
            else {
                this.loadIds = [idsOrKeys];
            }
            if (typeof this.loadIds[0] === "object") {
                if (this.loadIds[0].kind === this.kind) {
                    this.usingKeys = true;
                }
                else {
                    Messaging_1.throwError(Messaging_1.CreateMessage.OPERATION_KEYS_WRONG(this.model, "LOAD"));
                }
            }
            else {
                this.loadIds = this.loadIds.map(id => {
                    if (this.idType === "int" && BasicUtils_1.isNumber(id)) {
                        return Core_1.default.Instance.dsModule.int(id);
                    }
                    else if (this.idType === "string" && typeof id === "string") {
                        if (id.length === 0) {
                            Messaging_1.throwError(Messaging_1.CreateMessage.OPERATION_STRING_ID_EMPTY(this.model, "LOAD"));
                        }
                        return id;
                    }
                    Messaging_1.throwError(Messaging_1.CreateMessage.OPERATION_DATA_ID_TYPE_ERROR(this.model, "LOAD", id));
                });
            }
        }
    }
    first() {
        this.returnOnlyEntity = "FIRST";
        return this;
    }
    last() {
        this.returnOnlyEntity = "LAST";
        return this;
    }
    randomOne() {
        this.returnOnlyEntity = "RANDOM";
        return this;
    }
    run(throwIfNotFound = false) {
        return __awaiter(this, void 0, void 0, function* () {
            let loadKeys;
            if (this.usingKeys) {
                loadKeys = this.loadIds.map(this.augmentKey);
            }
            else {
                const baseKey = this.getBaseKey();
                loadKeys = this.loadIds.map(id => this.createFullKey(baseKey.concat(this.kind, id)));
            }
            let resp;
            if (this.transaction) {
                resp = yield this.transaction.get(loadKeys);
            }
            else {
                if (this.useCache && Core_1.default.Instance.cacheStore != null && Core_1.default.Instance.cacheStore.cacheOnLoad) {
                    let cachedEntities = null;
                    try {
                        cachedEntities = yield Core_1.default.Instance.cacheStore.getEntitiesByKeys(loadKeys);
                    }
                    catch (e) {
                        Messaging_1.errorNoThrow(`Loading from cache error: ${e.message}`);
                        console.error(e);
                    }
                    if (cachedEntities != null && cachedEntities.length > 0) {
                        resp = [];
                        resp.push(cachedEntities.map((entity, index) => {
                            entity[Core_1.default.Instance.dsModule.KEY] = loadKeys[index];
                            return entity;
                        }));
                    }
                    else {
                        resp = yield Core_1.default.Instance.dsModule.get(loadKeys);
                        if (resp[0].length > 0) {
                            Core_1.default.Instance.cacheStore.setEntitiesAfterLoadOrSave(resp[0], this.cachingTimeSeconds);
                        }
                    }
                }
                else {
                    resp = yield Core_1.default.Instance.dsModule.get(loadKeys);
                }
            }
            let entities = resp[0];
            if (entities.length === 0 && throwIfNotFound) {
                console.error(`Couldn't find ${this.model.entityKind} entity(s) with specified key(s):\n${loadKeys.map((loadKey) => `(ns)${loadKey.namespace}->${loadKey.path.join(":")}`).join("\n")}`);
                Messaging_1.throwError(`Couldn't find ${this.model.entityKind} entity(s) with specified key(s), see server log for more detail`);
            }
            if (this.returnOnlyEntity != null) {
                entities = [pickOutEntityFromResults_1.default(entities, this.returnOnlyEntity)];
                if (entities[0] == null) {
                    return null;
                }
            }
            if (this.hasIdProperty && entities.length > 0) {
                augmentEntitiesWithIdProperties_1.default(entities, this.idProperty, this.idType, this.kind);
            }
            deserializeJsonProperties_1.default(entities, this.schema);
            return this.returnOnlyEntity != null ? entities[0] : entities;
        });
    }
}
exports.default = DatastoreLoad;
//# sourceMappingURL=DatastoreLoad.js.map