"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extractAncestorPaths_1 = require("../utility/extractAncestorPaths");
const Core_1 = require("../Core");
class DatastoreBaseOperation {
    constructor(model) {
        this.hasIdProperty = false;
        this.defaultNamespace = Core_1.UNSET_NAMESPACE;
        this.deliberateNamespace = Core_1.UNSET_NAMESPACE;
        this.ancestors = [];
        this.augmentKey = (key) => {
            key.namespace = this.getFinalNamespace(key.namespace);
            return key;
        };
        this.model = model;
        this.modelOptions = model.modelOptions;
        this.kind = model.entityKind;
        this.schema = model.entitySchema;
        this.idProperty = model.entityIdProperty;
        this.idType = model.entityIdType;
        this.hasIdProperty = model.entityHasIdProperty;
        this.defaultNamespace = model.entityDefaultNamespace;
    }
    withAncestors(...args) {
        this.ancestors = extractAncestorPaths_1.default(this.model, ...args);
        return this;
    }
    useNamespace(namespace) {
        this.deliberateNamespace = namespace;
        return this;
    }
    getFinalNamespace(keyOriginalNamespace = undefined) {
        if (this.deliberateNamespace !== Core_1.UNSET_NAMESPACE) {
            return this.deliberateNamespace || undefined;
        }
        if (this.defaultNamespace !== Core_1.UNSET_NAMESPACE) {
            return this.defaultNamespace || undefined;
        }
        if (Core_1.default.Instance.namespace !== Core_1.UNSET_NAMESPACE) {
            return Core_1.default.Instance.namespace || undefined;
        }
        return keyOriginalNamespace;
    }
    createFullKey(fullPath, entityKey) {
        let originalKeyNamespace = entityKey ? entityKey.namespace : undefined;
        const newNamespace = this.getFinalNamespace(originalKeyNamespace);
        if (newNamespace !== undefined) {
            return Core_1.default.Instance.dsModule.key({
                namespace: newNamespace,
                path: fullPath,
            });
        }
        return Core_1.default.Instance.dsModule.key(fullPath);
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