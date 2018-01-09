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
class DatastoreLoad extends DatastoreOperation_1.default {
    constructor(model, idsOrKeys) {
        super(model);
        this.loadIds = [];
        this.usingKeys = false;
        this.returnOnlyEntity = null;
        this.useCache = this.useCache ? Core_1.default.Instance.cacheEnabledOnLoadDefault : false;
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
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            let loadKeys;
            if (this.usingKeys) {
                loadKeys = this.loadIds.map((key) => {
                    if (this.namespace != null) {
                        key.namespace = this.namespace;
                    }
                    else if (Core_1.default.Instance.namespace != null) {
                        key.namespace = Core_1.default.Instance.namespace;
                    }
                    return key;
                });
            }
            else {
                const baseKey = this.getBaseKey();
                loadKeys = this.loadIds.map(id => {
                    return this.createFullKey(baseKey.concat(this.kind, id));
                });
            }
            let resp;
            if (this.transaction) {
                resp = yield this.transaction.get(loadKeys);
            }
            else {
                if (this.useCache && Core_1.default.Instance.cacheStore != null && Core_1.default.Instance.cacheStore.cacheOnLoad) {
                    let cachedEntities = yield Core_1.default.Instance.cacheStore.getEntitiesByKeys(loadKeys);
                    if (cachedEntities != null && cachedEntities.length > 0) {
                        resp = [];
                        resp.push(cachedEntities.map((entity, index) => {
                            entity[Core_1.default.Instance.dsModule.KEY] = loadKeys[index];
                            return entity;
                        }));
                        /*
                        if (this.hasIdProperty) {
                          augmentEntitiesWithIdProperties(cachedEntities, this.idProperty, this.idType, this.kind);
                        }
                        */
                        // resp = cachedEntities;
                    }
                    else {
                        resp = yield Core_1.default.Instance.ds.get(loadKeys);
                        if (resp[0].length > 0) {
                            Core_1.default.Instance.cacheStore.setEntitiesAfterLoadOrSave(resp[0], this.cachingTimeSeconds);
                        }
                    }
                }
                else {
                    resp = yield Core_1.default.Instance.ds.get(loadKeys);
                }
            }
            if (this.hasIdProperty && resp[0].length > 0) {
                augmentEntitiesWithIdProperties_1.default(resp[0], this.idProperty, this.idType, this.kind);
            }
            if (this.returnOnlyEntity != null) {
                if (resp[0].length > 0) {
                    if (this.returnOnlyEntity === "FIRST") {
                        return resp[0][0];
                    }
                    else if (this.returnOnlyEntity === "LAST") {
                        return resp[0][resp[0].length - 1];
                    }
                    else {
                        const randomIndex = Math.floor(Math.random() * resp[0].length);
                        return resp[0][randomIndex];
                    }
                }
                else {
                    return null;
                }
            }
            return resp[0];
        });
    }
}
exports.default = DatastoreLoad;
//# sourceMappingURL=DatastoreLoad.js.map