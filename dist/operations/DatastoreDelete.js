"use strict";
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
                                    Messaging_1.throwError(Messaging_1.CreateMessage.OPERATION_STRING_ID_EMPTY(this.model, "DELETE"));
                                }
                                id = data[this.idProperty];
                            }
                            break;
                    }
                    if (id == null) {
                        Messaging_1.throwError(Messaging_1.CreateMessage.OPERATION_DATA_ID_TYPE_ERROR(this.model, "DELETE", data[this.idProperty]));
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
                    Messaging_1.throwError(Messaging_1.CreateMessage.DELETE_NO_DATA_IDS_ERROR);
                }
                if (entityKey && entityKey.parent && !this.ignoreAnc) {
                    if (setAncestors.length === 0) {
                        setAncestors = entityKey.parent.path;
                    }
                    else {
                        const prevAncestors = entityKey.parent.path.toString();
                        const nextAncestors = setAncestors.toString();
                        if (prevAncestors !== nextAncestors) {
                            Messaging_1.warn(Messaging_1.CreateMessage.OPERATION_CHANGED_ANCESTORS_WARNING(this.model, "DELETE", prevAncestors, nextAncestors));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YXN0b3JlRGVsZXRlLmpzIiwic291cmNlUm9vdCI6IkQ6L0Rldi9fUHJvamVjdHMvR2l0aHViL3BlYmJsZWJlZC9zcmMvIiwic291cmNlcyI6WyJvcGVyYXRpb25zL0RhdGFzdG9yZURlbGV0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZEQUFzRDtBQUV0RCxrQ0FBMkI7QUFDM0Isc0RBQWlEO0FBQ2pELDRDQUErRDtBQUUvRCxxQkFBcUMsU0FBUSw0QkFBa0I7SUFNN0QsWUFBWSxLQUFxQixFQUFFLElBQXdCO1FBQ3pELEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUxQLGNBQVMsR0FBMkIsRUFBRSxDQUFDO1FBQ3ZDLFdBQU0sR0FBRyxLQUFLLENBQUM7UUFDZixjQUFTLEdBQUcsS0FBSyxDQUFDO1FBS3hCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDVCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFDMUIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM1QixDQUFDO1FBQ0gsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDckIsQ0FBQztJQUNILENBQUM7SUFFTSxFQUFFLENBQUMsRUFBbUI7UUFDM0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU0sR0FBRyxDQUFDLEdBQTJCO1FBQ3BDLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO1FBQ3JCLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU0sdUJBQXVC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