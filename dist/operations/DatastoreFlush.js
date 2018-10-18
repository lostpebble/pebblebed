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
const Messaging_1 = require("../Messaging");
class DatastoreFlush extends DatastoreOperation_1.DatastoreBaseOperation {
    constructor(model, idsOrKeys) {
        super(model);
        this.flushIds = [];
        this.usingKeys = false;
        if (idsOrKeys != null) {
            if (Array.isArray(idsOrKeys)) {
                this.flushIds = idsOrKeys;
            }
            else {
                this.flushIds = [idsOrKeys];
            }
            if (typeof this.flushIds[0] === "object") {
                if (this.flushIds[0].kind === this.kind) {
                    this.usingKeys = true;
                }
                else {
                    Messaging_1.throwError(Messaging_1.CreateMessage.OPERATION_KEYS_WRONG(this.model, "FLUSH IN CACHE"));
                }
            }
            else {
                this.flushIds = this.flushIds.map(id => {
                    if (this.idType === "int" && BasicUtils_1.isNumber(id)) {
                        return Core_1.default.Instance.dsModule.int(id);
                    }
                    else if (this.idType === "string" && typeof id === "string") {
                        if (id.length === 0) {
                            Messaging_1.throwError(Messaging_1.CreateMessage.OPERATION_STRING_ID_EMPTY(this.model, "FLUSH IN CACHE"));
                        }
                        return id;
                    }
                    Messaging_1.throwError(Messaging_1.CreateMessage.OPERATION_DATA_ID_TYPE_ERROR(this.model, "FLUSH IN CACHE", id));
                });
            }
        }
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            let flushKeys;
            if (this.usingKeys) {
                flushKeys = this.flushIds.map(this.augmentKey);
            }
            else {
                const baseKey = this.getBaseKey();
                flushKeys = this.flushIds.map(id => {
                    return this.createFullKey(baseKey.concat(this.kind, id));
                });
            }
            if (Core_1.default.Instance.cacheStore != null) {
                yield Core_1.default.Instance.cacheStore.flushEntitiesByKeys(flushKeys);
            }
            else {
                Messaging_1.warn(`Trying to flush some ids / keys of [${this.kind}] - but no Cache Store has been set on Pebblebed instance!`);
            }
        });
    }
}
exports.default = DatastoreFlush;
//# sourceMappingURL=DatastoreFlush.js.map