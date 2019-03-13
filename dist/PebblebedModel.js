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
const checkDatastore_1 = require("./utility/checkDatastore");
const getIdPropertyFromSchema_1 = require("./utility/getIdPropertyFromSchema");
const Core_1 = require("./Core");
const DatastoreSave_1 = require("./operations/DatastoreSave");
const DatastoreLoad_1 = require("./operations/DatastoreLoad");
const DatastoreDelete_1 = require("./operations/DatastoreDelete");
const extractAncestorPaths_1 = require("./utility/extractAncestorPaths");
const Messaging_1 = require("./Messaging");
const DatastoreQuery_1 = require("./operations/DatastoreQuery");
const DatastoreFlush_1 = require("./operations/DatastoreFlush");
class PebblebedModel {
    constructor(entityKind, entitySchema, { defaultCachingSeconds = null, neverCache = false, defaultNamespace = Core_1.UNSET_NAMESPACE, } = {}) {
        this.hasIdProperty = false;
        this.defaultCachingSeconds = null;
        this.neverCache = false;
        this.defaultNamespace = Core_1.UNSET_NAMESPACE;
        this.getJoiSchema = () => {
            return this.joiSchema.__getJoiSchema();
        };
        this.validate = (data) => {
            const validation = Core_1.default.Joi.validate(data, this.joiSchema.__getJoiSchema(), {
                abortEarly: false,
            });
            if (validation.error !== null) {
                return {
                    positive: false,
                    message: `[Validation] ${this.entityKind} - ${validation.error}`,
                };
            }
            return {
                positive: true,
                message: `[Validation] ${this.entityKind} - Entity data is valid`,
            };
        };
        if (entitySchema.__isPebblebedJoiSchema) {
            this.schema = entitySchema.__generateBasicSchema();
            this.joiSchema = entitySchema;
        }
        else {
            this.schema = entitySchema;
        }
        this.kind = entityKind;
        this.idProperty = getIdPropertyFromSchema_1.default(this.schema);
        this.defaultCachingSeconds = defaultCachingSeconds;
        this.defaultNamespace = defaultNamespace;
        this.neverCache = neverCache;
        if (this.idProperty != null) {
            this.hasIdProperty = true;
            this.idType = this.schema[this.idProperty].type;
            if (this.idType !== "string" && this.idType !== "int") {
                Messaging_1.throwError(Messaging_1.CreateMessage.OPERATION_SCHEMA_ID_TYPE_ERROR(this, "CREATE MODEL"));
            }
        }
    }
    save(data) {
        checkDatastore_1.default("SAVE");
        return new DatastoreSave_1.default(this, data);
    }
    load(idsOrKeys) {
        checkDatastore_1.default("LOAD");
        return new DatastoreLoad_1.default(this, idsOrKeys);
    }
    query(namespace = Core_1.UNSET_NAMESPACE) {
        checkDatastore_1.default("QUERY");
        let ns = namespace !== Core_1.UNSET_NAMESPACE ? namespace : this.defaultNamespace;
        return DatastoreQuery_1.createDatastoreQuery(this, ns);
    }
    key(id) {
        checkDatastore_1.default("CREATE KEY");
        return Core_1.default.Instance.ds.key([this.kind, id]);
    }
    delete(data) {
        checkDatastore_1.default("DELETE");
        return new DatastoreDelete_1.default(this, data);
    }
    flush(idsOrKeys) {
        checkDatastore_1.default("FLUSH IN CACHE");
        return new DatastoreFlush_1.default(this, idsOrKeys);
    }
    allocateIds({ amount, withAncestors = null, namespace = Core_1.UNSET_NAMESPACE, }) {
        return __awaiter(this, void 0, void 0, function* () {
            checkDatastore_1.default("ALLOCATE IDS");
            let ns = namespace !== Core_1.UNSET_NAMESPACE ? namespace : this.defaultNamespace;
            ns = ns !== Core_1.UNSET_NAMESPACE ? ns : (Core_1.default.Instance.namespace !== Core_1.UNSET_NAMESPACE ? Core_1.default.Instance.namespace : null);
            let keyPath = [this.kind];
            if (withAncestors != null) {
                keyPath = [].concat(...extractAncestorPaths_1.default(this, ...withAncestors), keyPath);
            }
            if (ns != null) {
                const allocateIds = yield Core_1.default.Instance.ds.allocateIds(Core_1.default.Instance.dsModule.key({
                    namespace: ns,
                    path: keyPath
                }), amount);
                return allocateIds[0];
            }
            const allocateIds = yield Core_1.default.Instance.dsModule.allocateIds(Core_1.default.Instance.dsModule.key(keyPath), amount);
            return allocateIds[0];
        });
    }
    get entityKind() {
        return this.kind;
    }
    get entitySchema() {
        return this.schema;
    }
    get entityIdProperty() {
        return this.idProperty;
    }
    get entityIdType() {
        return this.idType;
    }
    get entityHasIdProperty() {
        return this.hasIdProperty;
    }
    get entityPebbleSchema() {
        return this.joiSchema;
    }
    get entityDefaultNamespace() {
        return this.defaultNamespace;
    }
    get modelOptions() {
        return {
            defaultCachingSeconds: this.defaultCachingSeconds,
            neverCache: this.neverCache,
        };
    }
}
exports.default = PebblebedModel;
//# sourceMappingURL=PebblebedModel.js.map