"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extractAncestorPaths_1 = require("../utility/extractAncestorPaths");
const Core_1 = require("../Core");
class DatastoreBaseOperation {
    constructor(model) {
        this.hasIdProperty = false;
        this.namespace = null;
        this.deliberateNamespace = false;
        this.ancestors = [];
        this.augmentKey = (key) => {
            if (!this.deliberateNamespace) {
                this.namespace = key.namespace || null;
            }
            if (this.namespace != null) {
                key.namespace = this.namespace;
            }
            else if (Core_1.default.Instance.namespace != null) {
                key.namespace = Core_1.default.Instance.namespace;
            }
            return key;
        };
        this.model = model;
        this.modelOptions = model.modelOptions;
        this.kind = model.entityKind;
        this.schema = model.entitySchema;
        this.idProperty = model.entityIdProperty;
        this.idType = model.entityIdType;
        this.hasIdProperty = model.entityHasIdProperty;
        this.namespace = model.entityDefaultNamespace;
    }
    withAncestors(...args) {
        this.ancestors = extractAncestorPaths_1.default(this.model, ...args);
        return this;
    }
    useNamespace(namespace) {
        this.namespace = namespace;
        this.deliberateNamespace = true;
        return this;
    }
    createFullKey(fullPath, entityKey) {
        if (entityKey && !this.deliberateNamespace) {
            this.namespace = entityKey.namespace || null;
        }
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
exports.DatastoreBaseOperation = DatastoreBaseOperation;
class DatastoreOperation extends DatastoreBaseOperation {
    constructor(model) {
        super(model);
        this.transaction = null;
        this.runValidation = true;
        this.useCache = true;
        this.cachingTimeSeconds = 60 * 5;
        this.runValidation = Core_1.default.Instance.validations;
        this.useCache =
            this.modelOptions.neverCache
                ? false
                : Core_1.default.Instance.caching;
        this.cachingTimeSeconds =
            this.modelOptions.defaultCachingSeconds != null
                ? this.modelOptions.defaultCachingSeconds
                : Core_1.default.Instance.defaultCachingSeconds;
    }
    enableValidations(on) {
        this.runValidation = on;
        return this;
    }
    enableCaching(on) {
        this.useCache = on;
        return this;
    }
    cachingSeconds(seconds) {
        this.cachingTimeSeconds = seconds;
        return this;
    }
    useTransaction(transaction) {
        this.transaction = transaction;
        return this;
    }
}
exports.default = DatastoreOperation;
//# sourceMappingURL=DatastoreOperation.js.map