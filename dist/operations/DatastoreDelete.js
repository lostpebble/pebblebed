"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const DatastoreOperation_1 = require("./DatastoreOperation");
const Core_1 = require("../Core");
const BasicUtils_1 = require("../utility/BasicUtils");
const Messaging_1 = require("../Messaging");
class DatastoreDelete extends DatastoreOperation_1.default {
    constructor(model, data) {
        super(model);
        this.deleteIds = [];
        this.useIds = false;
        this.ignoreAnc = false;
        this.usingKeys = false;
        if (data) {
            if (Array.isArray(data)) {
                this.dataObjects = data;
            }
            else {
                this.dataObjects = [data];
            }
        }
        else {
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
    idsOrKeys(idsOrKeys) {
        if (Array.isArray(idsOrKeys)) {
            this.deleteIds = idsOrKeys;
        }
        else {
            this.deleteIds = [idsOrKeys];
        }
        if (typeof this.deleteIds[0] === "object") {
            if (this.deleteIds[0].kind === this.kind) {
                this.usingKeys = true;
            }
            else {
                (0, Messaging_1.throwError)(Messaging_1.CreateMessage.OPERATION_KEYS_WRONG(this.model, "DELETE"));
            }
        }
        else {
            this.deleteIds = this.deleteIds.map(id => {
                if (this.idType === "int" && (0, BasicUtils_1.isNumber)(id)) {
                    return Core_1.default.Instance.dsModule.int(id);
                }
                else if (this.idType === "string" && typeof id === "string") {
                    if (id.length === 0) {
                        (0, Messaging_1.throwError)(Messaging_1.CreateMessage.OPERATION_STRING_ID_EMPTY(this.model, "DELETE"));
                    }
                    return id;
                }
                (0, Messaging_1.throwError)(Messaging_1.CreateMessage.OPERATION_DATA_ID_TYPE_ERROR(this.model, "DELETE", id));
                return "";
            });
        }
        return this;
    }
    ignoreDetectedAncestors() {
        this.ignoreAnc = true;
        return this;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const baseKey = this.getBaseKey();
            let deleteKeys = [];
            if (!this.useIds) {
                for (const data of this.dataObjects) {
                    let setAncestors = baseKey;
                    let id = null;
                    const entityKey = data[Core_1.default.Instance.dsModule.KEY];
                    if (this.hasIdProperty && data[this.idProperty] != null) {
                        switch (this.idType) {
                            case "int":
                                if ((0, BasicUtils_1.isNumber)(data[this.idProperty])) {
                                    id = Core_1.default.Instance.dsModule.int(data[this.idProperty]);
                                }
                                break;
                            case "string":
                                if (typeof data[this.idProperty] === "string") {
                                    if (data[this.idProperty].length === 0) {
                                        (0, Messaging_1.throwError)(Messaging_1.CreateMessage.OPERATION_STRING_ID_EMPTY(this.model, "DELETE"));
                                    }
                                    id = data[this.idProperty];
                                }
                                break;
                        }
                        if (id == null) {
                            (0, Messaging_1.throwError)(Messaging_1.CreateMessage.OPERATION_DATA_ID_TYPE_ERROR(this.model, "DELETE", data[this.idProperty]));
                        }
                    }
                    else if (entityKey != null) {
                        if (entityKey.hasOwnProperty("id")) {
                            id = Core_1.default.Instance.dsModule.int(entityKey.id);
                        }
                        else {
                            id = entityKey.name;
                        }
                    }
                    else {
                        (0, Messaging_1.throwError)(Messaging_1.CreateMessage.DELETE_NO_DATA_IDS_ERROR);
                    }
                    if (entityKey && entityKey.parent && !this.ignoreAnc) {
                        if (setAncestors.length === 0) {
                            setAncestors = entityKey.parent.path;
                        }
                        else {
                            const prevAncestors = entityKey.parent.path.toString();
                            const nextAncestors = setAncestors.toString();
                            if (prevAncestors !== nextAncestors) {
                                (0, Messaging_1.warn)(Messaging_1.CreateMessage.OPERATION_CHANGED_ANCESTORS_WARNING(this.model, "DELETE", prevAncestors, nextAncestors));
                            }
                        }
                    }
                    deleteKeys.push(this.createFullKey(setAncestors.concat([this.kind, id]), entityKey));
                }
            }
            else if (this.usingKeys) {
                deleteKeys = this.deleteIds.map(this.augmentKey);
            }
            else {
                deleteKeys = this.deleteIds.map(id => this.createFullKey(baseKey.concat(this.kind, id)));
            }
            let deleteResponse;
            if (this.transaction) {
                deleteResponse = yield this.transaction.delete(deleteKeys);
            }
            else {
                deleteResponse = yield Core_1.default.Instance.dsModule.delete(deleteKeys);
            }
            if (Core_1.default.Instance.cacheStore != null) {
                Core_1.default.Instance.cacheStore.flushEntitiesByKeys(deleteKeys);
            }
            return deleteResponse;
        });
    }
}
exports.default = DatastoreDelete;
//# sourceMappingURL=DatastoreDelete.js.map