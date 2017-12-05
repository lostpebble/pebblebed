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
        this.runValidation = true;
        this.useCache = true;
        this.cachingTimeSeconds = 60 * 5;
        this.model = model;
        this.kind = model.entityKind;
        this.schema = model.entitySchema;
        this.idProperty = model.entityIdProperty;
        this.idType = model.entityIdType;
        this.hasIdProperty = model.entityHasIdProperty;
        this.runValidation = Core_1.default.Instance.validations;
        this.useCache = Core_1.default.Instance.caching;
        this.cachingTimeSeconds = Core_1.default.Instance.defaultCachingSeconds;
    }
    withAncestors(...args) {
        this.ancestors = extractAncestorPaths_1.default(this.model, ...args);
        return this;
    }
    enableValidations(on) {
        this.runValidation = on;
    }
    enableCaching(on) {
        this.useCache = on;
    }
    cachingSeconds(seconds) {
        this.cachingTimeSeconds = seconds;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YXN0b3JlT3BlcmF0aW9uLmpzIiwic291cmNlUm9vdCI6IkQ6L0Rldi9fUHJvamVjdHMvR2l0aHViL3BlYmJsZWJlZC9zcmMvIiwic291cmNlcyI6WyJvcGVyYXRpb25zL0RhdGFzdG9yZU9wZXJhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLDBFQUFtRTtBQUNuRSxrQ0FBMkI7QUFFM0I7SUFjRSxZQUFZLEtBQXFCO1FBUnZCLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLGNBQVMsR0FBRyxJQUFJLENBQUM7UUFDakIsY0FBUyxHQUFxQyxFQUFFLENBQUM7UUFDakQsZ0JBQVcsR0FBUSxJQUFJLENBQUM7UUFDeEIsa0JBQWEsR0FBWSxJQUFJLENBQUM7UUFDOUIsYUFBUSxHQUFZLElBQUksQ0FBQztRQUN6Qix1QkFBa0IsR0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRzVDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUM3QixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUM7UUFDakMsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUM7UUFDekMsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDLG1CQUFtQixDQUFDO1FBQy9DLElBQUksQ0FBQyxhQUFhLEdBQUcsY0FBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUM7UUFDL0MsSUFBSSxDQUFDLFFBQVEsR0FBRyxjQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztRQUN0QyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsY0FBSSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQztJQUNoRSxDQUFDO0lBRU0sYUFBYSxDQUFDLEdBQUcsSUFBVztRQUNqQyxJQUFJLENBQUMsU0FBUyxHQUFHLDhCQUFvQixDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUMzRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVNLGlCQUFpQixDQUFDLEVBQVc7UUFDbEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVNLGFBQWEsQ0FBQyxFQUFXO1FBQzlCLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFTSxjQUFjLENBQUMsT0FBZTtRQUNuQyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsT0FBTyxDQUFDO0lBQ3BDLENBQUM7SUFFTSxjQUFjLENBQUMsV0FBZ0I7UUFDcEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTSxZQUFZLENBQUMsU0FBaUI7UUFDbkMsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFUyxhQUFhLENBQUMsUUFBUTtRQUM5QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDM0IsTUFBTSxDQUFDLGNBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQztnQkFDMUIsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO2dCQUN6QixJQUFJLEVBQUUsUUFBUTthQUNmLENBQUMsQ0FBQztRQUNMLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsY0FBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMzQyxNQUFNLENBQUMsY0FBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDO2dCQUMxQixTQUFTLEVBQUUsY0FBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTO2dCQUNsQyxJQUFJLEVBQUUsUUFBUTthQUNmLENBQUMsQ0FBQztRQUNMLENBQUM7UUFDRCxNQUFNLENBQUMsY0FBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFUyxVQUFVO1FBQ2xCLE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUVuQixHQUFHLENBQUMsQ0FBQyxNQUFNLFFBQVEsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUN0QyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QyxDQUFDO1FBRUQsTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUNqQixDQUFDO0NBQ0Y7QUE3RUQscUNBNkVDIn0=