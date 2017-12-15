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
const crypto = require("crypto");
class PebblebedModel {
    constructor(entityKind, entitySchema, { defaultCachingSeconds = null, neverCache = false, } = {}) {
        this.joiSchema = null;
        this.hasIdProperty = false;
        this.defaultCachingSeconds = null;
        this.neverCache = false;
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
    query(namespace = null) {
        checkDatastore_1.default("QUERY");
        return DatastoreQuery_1.createDatastoreQuery(this, namespace);
    }
    key(id) {
        checkDatastore_1.default("CREATE KEY");
        return Core_1.default.Instance.ds.key([this.kind, id]);
    }
    delete(data) {
        checkDatastore_1.default("DELETE");
        return new DatastoreDelete_1.default(this, data);
    }
    allocateIds(amount, withAncestors = null) {
        return __awaiter(this, void 0, void 0, function* () {
            checkDatastore_1.default("ALLOCATE IDS");
            let keyPath = [this.kind];
            if (withAncestors != null) {
                keyPath = [].concat(...extractAncestorPaths_1.default(this, ...withAncestors), keyPath);
            }
            const allocateIds = yield Core_1.default.Instance.ds.allocateIds(Core_1.default.Instance.ds.key(keyPath), amount);
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
    get entityJoiSchema() {
        return this.joiSchema;
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