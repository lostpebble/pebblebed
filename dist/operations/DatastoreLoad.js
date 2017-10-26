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
const ErrorMessages_1 = require("../ErrorMessages");
const Core_1 = require("../Core");
const BasicUtils_1 = require("../utility/BasicUtils");
const augmentEntitiesWithIdProperties_1 = require("../utility/augmentEntitiesWithIdProperties");
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
                    throw new Error(ErrorMessages_1.default.OPERATION_KEYS_WRONG(this.model, "LOAD"));
                }
            }
            else {
                this.loadIds = this.loadIds.map(id => {
                    if (this.idType === "int" && BasicUtils_1.isNumber(id)) {
                        return Core_1.default.Instance.dsModule.int(id);
                    }
                    else if (this.idType === "string" && typeof id === "string") {
                        if (id.length === 0) {
                            throw new Error(ErrorMessages_1.default.OPERATION_STRING_ID_EMPTY(this.model, "LOAD"));
                        }
                        return id;
                    }
                    throw new Error(ErrorMessages_1.default.OPERATION_DATA_ID_TYPE_ERROR(this.model, "LOAD", id));
                });
            }
        }
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            let loadKeys;
            if (this.usingKeys) {
                loadKeys = this.loadIds.map(key => {
                    return this.createFullKey(key.path);
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
                resp = yield Core_1.default.Instance.ds.get(loadKeys);
            }
            if (this.hasIdProperty && resp[0].length > 0) {
                augmentEntitiesWithIdProperties_1.default(resp[0], this.idProperty, this.idType, this.kind);
            }
            return resp[0];
        });
    }
}
exports.default = DatastoreLoad;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YXN0b3JlTG9hZC5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS9sb3N0cGViYmxlL0Rldi9vdGhlcl9wcm9qZWN0cy9naXRodWIvcGViYmxlYmVkL3NyYy8iLCJzb3VyY2VzIjpbIm9wZXJhdGlvbnMvRGF0YXN0b3JlTG9hZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQ0EsNkRBQXNEO0FBRXRELG9EQUE2QztBQUM3QyxrQ0FBMkI7QUFDM0Isc0RBQWlEO0FBQ2pELGdHQUF5RjtBQUV6RixtQkFBbUMsU0FBUSw0QkFBa0I7SUFJM0QsWUFDRSxLQUFxQixFQUNyQixTQUE2RjtRQUU3RixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFQUCxZQUFPLEdBQWdELEVBQUUsQ0FBQztRQUMxRCxjQUFTLEdBQUcsS0FBSyxDQUFDO1FBUXhCLEVBQUUsQ0FBQyxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixJQUFJLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztZQUMzQixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzdCLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDeEMsRUFBRSxDQUFDLENBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQXdCLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUMvRCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztnQkFDeEIsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixNQUFNLElBQUksS0FBSyxD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