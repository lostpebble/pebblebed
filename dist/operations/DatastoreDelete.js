"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DatastoreOperation_1 = require("./DatastoreOperation");
const Core_1 = require("../Core");
const BasicUtils_1 = require("../utility/BasicUtils");
const ErrorMessages_1 = require("../ErrorMessages");
class DatastoreDelete extends DatastoreOperation_1.default {
    constructor(model, data) {
        super(model);
        this.deleteIds = [];
        this.useIds = false;
        this.ignoreAnc = false;
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
    id(id) {
        this.deleteIds = [id];
        return this;
    }
    ids(ids) {
        this.deleteIds = ids;
        return this;
    }
    ignoreDetectedAncestors() {
        this.ignoreAnc = true;
        return this;
    }
    run() {
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
                            if (BasicUtils_1.isNumber(data[this.idProperty])) {
                                id = Core_1.default.Instance.dsModule.int(data[this.idProperty]);
                            }
                            break;
                        case "string":
                            if (typeof data[this.idProperty] === "string") {
                                if (data[this.idProperty].length === 0) {
                                    throw new Error(ErrorMessages_1.default.OPERATION_STRING_ID_EMPTY(this.model, "DELETE"));
                                }
                                id = data[this.idProperty];
                            }
                            break;
                    }
                    if (id == null) {
                        throw new Error(ErrorMessages_1.default.OPERATION_DATA_ID_TYPE_ERROR(this.model, "DELETE", data[this.idProperty]));
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
                    throw new Error(ErrorMessages_1.default.DELETE_NO_DATA_IDS_ERROR);
                }
                if (entityKey && entityKey.parent && !this.ignoreAnc) {
                    if (setAncestors.length === 0) {
                        setAncestors = entityKey.parent.path;
                    }
                    else {
                        const prevAncestors = entityKey.parent.path.toString();
                        const nextAncestors = setAncestors.toString();
                        if (prevAncestors !== nextAncestors) {
                            console.warn(ErrorMessages_1.default.OPERATION_CHANGED_ANCESTORS_WARNING(this.model, "DELETE", prevAncestors, nextAncestors));
                        }
                    }
                }
                deleteKeys.push(this.createFullKey(setAncestors.concat([this.kind, id])));
            }
        }
        else {
            deleteKeys = this.deleteIds.map(id => {
                return this.createFullKey(baseKey.concat([this.kind, id]));
            });
        }
        if (this.transaction) {
            return this.transaction.delete(deleteKeys);
        }
        return Core_1.default.Instance.ds.delete(deleteKeys);
    }
}
exports.default = DatastoreDelete;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YXN0b3JlRGVsZXRlLmpzIiwic291cmNlUm9vdCI6Ii9ob21lL2xvc3RwZWJibGUvRGV2L290aGVyX3Byb2plY3RzL2dpdGh1Yi9wZWJibGViZWQvc3JjLyIsInNvdXJjZXMiOlsib3BlcmF0aW9ucy9EYXRhc3RvcmVEZWxldGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2REFBc0Q7QUFFdEQsa0NBQTJCO0FBQzNCLHNEQUFpRDtBQUNqRCxvREFBNkM7QUFFN0MscUJBQXFDLFNBQVEsNEJBQWtCO0lBTTdELFlBQVksS0FBcUIsRUFBRSxJQUF3QjtRQUN6RCxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFMUCxjQUFTLEdBQTJCLEVBQUUsQ0FBQztRQUN2QyxXQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ2YsY0FBUyxHQUFHLEtBQUssQ0FBQztRQUt4QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ1QsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1lBQzFCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDNUIsQ0FBQztRQUNILENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLENBQUM7SUFDSCxDQUFDO0lBRU0sRUFBRSxDQUFDLEVBQW1CO1FBQzNCLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN0QixNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVNLEdBQUcsQ0FBQyxHQUEyQjtRQUNwQyxJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQztRQUNyQixNQUFNLENBQUMsSUFBSSxDQUFDO0lB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