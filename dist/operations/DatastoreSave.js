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
                const key = id
                    ? this.createFullKey(setAncestors.concat([this.kind, id]))
                    : this.createFullKey(setAncestors.concat([this.kind]));
                const { dataObject, excludeFromIndexes } = buildDataFromSchema_1.default(data, this.schema, this.kind);
                if (this.runValidation) {
                    const validation = Core_1.default.Joi.validate(dataObject, this.model.entityJoiSchema);
                }
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
                        Messaging_1.warn(Messaging_1.CreateMessage.ACCESS_TRANSACTION_GENERATED_IDS_ERROR);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YXN0b3JlU2F2ZS5qcyIsInNvdXJjZVJvb3QiOiJEOi9EZXYvX1Byb2plY3RzL0dpdGh1Yi9wZWJibGViZWQvc3JjLyIsInNvdXJjZXMiOlsib3BlcmF0aW9ucy9EYXRhc3RvcmVTYXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSw2REFBc0Q7QUFFdEQsa0NBQTJCO0FBQzNCLHNEQUFpRDtBQUNqRCx3RUFBaUU7QUFDakUsZ0VBQXlEO0FBQ3pELG9HQUE2RjtBQUM3Riw0Q0FBK0Q7QUFFL0QsbUJBQW1DLFNBQVEsNEJBQWtCO0lBTTNELFlBQVksS0FBcUIsRUFBRSxJQUF1QjtRQUN4RCxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFMUCxjQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ2xCLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFDakIscUJBQWdCLEdBQUcsS0FBSyxDQUFDO1FBSy9CLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1FBQzFCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QixDQUFDO0lBQ0gsQ0FBQztJQUVNLGNBQWMsQ0FDbkIsV0FBZ0IsRUFDaEIsT0FBTyxHQUFHO1lBQ1IsY0FBYyxFQUFFLEtBQUs7U0FDdEI7UUFFRCxLQUFLLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDO1FBQy9DLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU0sZ0JBQWdCO1FBQ3JCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU0sdUJB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