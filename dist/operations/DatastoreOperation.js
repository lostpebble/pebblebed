"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extractAncestorPaths_1 = require("../utility/extractAncestorPaths");
const Core_1 = require("../Core");
class DatastoreOperation {
    constructor(model) {
        this.hasIdProperty = false;
        this.namespace = null;
        this.ancestors = [];
        this.transaction = null;
        this.model = model;
        this.kind = model.entityKind;
        this.schema = model.entitySchema;
        this.idProperty = model.entityIdProperty;
        this.idType = model.entityIdType;
        this.hasIdProperty = model.entityHasIdProperty;
    }
    withAncestors(...args) {
        this.ancestors = extractAncestorPaths_1.default(this.model, ...args);
        return this;
    }
    useTransaction(transaction) {
        this.transaction = transaction;
        return this;
    }
    useNamespace(namespace) {
        this.namespace = namespace;
        return this;
    }
    createFullKey(fullPath) {
        if (this.namespace != null) {
            return Core_1.default.Instance.ds.key({
                namespace: this.namespace,
                path: fullPath,
            });
        }
        else if (Core_1.default.Instance.namespace != null) {
            return Core_1.default.Instance.ds.key({
                namespace: Core_1.default.Instance.namespace,
                path: fullPath,
            });
        }
        return Core_1.default.Instance.ds.key(fullPath);
    }
    getBaseKey() {
        const baseKey = [];
        for (const ancestor of this.ancestors) {
            baseKey.push(ancestor[0], ancestor[1]);
        }
        return baseKey;
    }
}
exports.default = DatastoreOperation;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YXN0b3JlT3BlcmF0aW9uLmpzIiwic291cmNlUm9vdCI6Ii9ob21lL2xvc3RwZWJibGUvRGV2L290aGVyX3Byb2plY3RzL2dpdGh1Yi9wZWJibGViZWQvc3JjLyIsInNvdXJjZXMiOlsib3BlcmF0aW9ucy9EYXRhc3RvcmVPcGVyYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwwRUFBbUU7QUFDbkUsa0NBQTJCO0FBRTNCO0lBV0UsWUFBWSxLQUFxQjtRQUx2QixrQkFBYSxHQUFHLEtBQUssQ0FBQztRQUN0QixjQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLGNBQVMsR0FBcUMsRUFBRSxDQUFDO1FBQ2pELGdCQUFXLEdBQVEsSUFBSSxDQUFDO1FBR2hDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUM3QixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUM7UUFDakMsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUM7UUFDekMsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDLG1CQUFtQixDQUFDO0lBQ2pELENBQUM7SUFFTSxhQUFhLENBQUMsR0FBRyxJQUFXO1FBQ2pDLElBQUksQ0FBQyxTQUFTLEdBQUcsOEJBQW9CLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQzNELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU0sY0FBYyxDQUFDLFdBQWdCO1FBQ3BDLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQy9CLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU0sWUFBWSxDQUFDLFNBQWlCO1FBQ25DLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRVMsYUFBYSxDQUFDLFFBQVE7UUFDOUIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzNCLE1BQU0sQ0FBQyxjQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUM7Z0JBQzFCLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztnQkFDekIsSUFBSSxFQUFFLFFBQVE7YUFDZixDQUFDLENBQUM7UUFDTCxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGNBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDM0MsTUFBTSxDQUFDLGNBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQztnQkFDMUIsU0FBUyxFQUFFLGNBQUksQ0FBQyxRQUFRLENBQUMsU0FBUztnQkFDbEMsSUFBSSxFQUFFLFFBQVE7YUFDZixDQUFDLENBQUM7UUFDTCxDQUFDO1FBQ0QsTUFBTSxDQUFDLGNBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRVMsVUFBVTtRQUNsQixNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFFbkIsR0FBRyxDQUFDLENBQUMsTUFBTSxRQUFRLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDdEMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekMsQ0FBQztRQUVELE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFDakIsQ0FBQztDQUNGO0FBM0RELHFDQTJEQyJ9