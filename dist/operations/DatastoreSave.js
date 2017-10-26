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
const buildDataFromSchema_1 = require("../utility/buildDataFromSchema");
const extractSavedIds_1 = require("../utility/extractSavedIds");
const replaceIncompleteWithAllocatedIds_1 = require("../utility/replaceIncompleteWithAllocatedIds");
class DatastoreSave extends DatastoreOperation_1.default {
    constructor(model, data) {
        super(model);
        this.ignoreAnc = false;
        this.generate = false;
        this.transAllocateIds = false;
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
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const baseKey = this.getBaseKey();
            const entities = this.dataObjects.map(data => {
                let setAncestors = baseKey;
                let id = null;
                const entityKey = data[Core_1.default.Instance.dsModule.KEY];
                if (this.hasIdProperty && data[this.idProperty] != null) {
                    switch (this.idType) {
                        case "string": {
                            if (typeof data[this.idProperty] === "string") {
                                if (data[this.idProperty].length === 0) {
                                    throw new Error(ErrorMessages_1.default.OPERATION_STRING_ID_EMPTY(this.model, "SAVE"));
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
                        throw new Error(ErrorMessages_1.default.OPERATION_DATA_ID_TYPE_ERROR(this.model, "SAVE", data[this.idProperty]));
                    }
                }
                else {
                    if (entityKey &&
                        entityKey.path &&
                        entityKey.path.length > 0 &&
                        entityKey.path.length % 2 === 0) {
                        if (entityKey.hasOwnProperty("id")) {
                            id = Core_1.default.Instance.dsModule.int(entityKey.id);
                        }
                        else {
                            id = entityKey.name;
                        }
                    }
                    else {
                        if (this.hasIdProperty && (this.idType === "string" || !this.generate)) {
                            throw new Error(ErrorMessages_1.default.OPERATION_MISSING_ID_ERROR(this.model, "SAVE"));
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
                            console.warn(ErrorMessages_1.default.OPERATION_CHANGED_ANCESTORS_WARNING(this.model, "SAVE", prevAncestors, nextAncestors));
                        }
                    }
                }
                const key = id
                    ? this.createFullKey(setAncestors.concat([this.kind, id]))
                    : this.createFullKey(setAncestors.concat([this.kind]));
                const { dataObject, excludeFromIndexes } = buildDataFromSchema_1.default(data, this.schema, this.kind);
                return {
                    key,
                    excludeFromIndexes,
                    generated: id == null,
                    data: dataObject,
                };
            });
            if (this.transaction) {
                if (this.transAllocateIds) {
                    const { newEntities, ids } = yield replaceIncompleteWithAllocatedIds_1.default(entities, this.transaction);
                    this.transaction.save(newEntities);
                    return {
                        generatedIds: ids,
                    };
                }
                this.transaction.save(entities);
                return {
                    get generatedIds() {
                        console.warn(ErrorMessages_1.default.ACCESS_TRANSACTION_GENERATED_IDS_ERROR);
                        return null;
                    },
                };
            }
            return Core_1.default.Instance.ds.save(entities).then(data => {
                return extractSavedIds_1.default(data)[0];
            });
        });
    }
}
exports.default = DatastoreSave;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YXN0b3JlU2F2ZS5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS9sb3N0cGViYmxlL0Rldi9vdGhlcl9wcm9qZWN0cy9naXRodWIvcGViYmxlYmVkL3NyYy8iLCJzb3VyY2VzIjpbIm9wZXJhdGlvbnMvRGF0YXN0b3JlU2F2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsNkRBQXNEO0FBRXRELG9EQUE2QztBQUM3QyxrQ0FBMkI7QUFDM0Isc0RBQWlEO0FBQ2pELHdFQUFpRTtBQUNqRSxnRUFBeUQ7QUFDekQsb0dBQTZGO0FBRTdGLG1CQUFtQyxTQUFRLDRCQUFrQjtJQU0zRCxZQUFZLEtBQXFCLEVBQUUsSUFBdUI7UUFDeEQsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBTFAsY0FBUyxHQUFHLEtBQUssQ0FBQztRQUNsQixhQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLHFCQUFnQixHQUFHLEtBQUssQ0FBQztRQUsvQixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztRQUMxQixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUIsQ0FBQztJQUNILENBQUM7SUFFTSxjQUFjLENBQ25CLFdBQWdCLEVBQ2hCLE9BQU8sR0FBRztZQUNSLGNBQWMsRUFBRSxLQUFLO1NBQ3RCO1FBRUQsS0FBSyxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQztRQUMvQyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVNLGdCQUFnQjtRQUNyQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUNyQixNQUFNLENBQUMsSUFBSSxDQUFD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