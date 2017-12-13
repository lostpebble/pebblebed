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
                if (this.useCache && Core_1.default.Instance.cacheStore != null) {
                    let cachedEntities = yield Core_1.default.Instance.cacheStore.getEntitiesByKeys(loadKeys);
                    if (cachedEntities != null && cachedEntities.length > 0) {
                        cachedEntities = cachedEntities.map((entity, index) => {
                            entity[Core_1.default.Instance.dsModule.KEY] = loadKeys[index];
                            return entity;
                        });
                        return augmentEntitiesWithIdProperties_1.default(cachedEntities, this.idProperty, this.idType, this.kind);
                    }
                    resp = yield Core_1.default.Instance.ds.get(loadKeys);
                    if (resp[0].length > 0) {
                        Core_1.default.Instance.cacheStore.setEntitiesAfterLoadOrSave(resp[0], this.cachingTimeSeconds);
                    }
                }
                else {
                    resp = yield Core_1.default.Instance.ds.get(loadKeys);
                }
            }
            if (this.hasIdProperty && resp[0].length > 0) {
                augmentEntitiesWithIdProperties_1.default(resp[0], this.idProperty, this.idType, this.kind);
            }
            return resp[0];
        });
    }
}
exports.default = DatastoreLoad;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YXN0b3JlTG9hZC5qcyIsInNvdXJjZVJvb3QiOiJEOi9EZXYvX1Byb2plY3RzL0dpdGh1Yi9wZWJibGViZWQvc3JjLyIsInNvdXJjZXMiOlsib3BlcmF0aW9ucy9EYXRhc3RvcmVMb2FkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFDQSw2REFBc0Q7QUFFdEQsa0NBQTJCO0FBQzNCLHNEQUFpRDtBQUNqRCxnR0FBeUY7QUFDekYsNENBQXlEO0FBRXpELG1CQUFtQyxTQUFRLDRCQUFrQjtJQUkzRCxZQUNFLEtBQXFCLEVBQ3JCLFNBQTZGO1FBRTdGLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQVBQLFlBQU8sR0FBZ0QsRUFBRSxDQUFDO1FBQzFELGNBQVMsR0FBRyxLQUFLLENBQUM7UUFReEIsRUFBRSxDQUFDLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDdEIsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdCLElBQUksQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDO1lBQzNCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDN0IsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUN4QyxFQUFFLENBQUMsQ0FBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBd0IsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQy9ELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO2dCQUN4QixDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLHNCQUFVLENBQUMseUJBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxJ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