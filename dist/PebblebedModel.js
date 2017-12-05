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
const augmentEntitiesWithIdProperties_1 = require("./utility/augmentEntitiesWithIdProperties");
const Messaging_1 = require("./Messaging");
class PebblebedModel {
    constructor(entityKind, entitySchema) {
        this.joiSchema = null;
        this.hasIdProperty = false;
        if (entitySchema.__isPebblebedJoiSchema) {
            this.schema = entitySchema.__generateBasicSchema();
            this.joiSchema = entitySchema;
        }
        else {
            this.schema = entitySchema;
        }
        this.kind = entityKind;
        this.idProperty = getIdPropertyFromSchema_1.default(this.schema);
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
        const model = this;
        const idProp = this.idProperty;
        const kind = this.kind;
        const hasIdProp = this.hasIdProperty;
        const type = hasIdProp ? this.schema[this.idProperty].type : null;
        const ns = namespace != null ? namespace : Core_1.default.Instance.namespace;
        const dsQuery = ns != null ? Core_1.default.Instance.ds.createQuery(ns, this.kind) : Core_1.default.Instance.ds.createQuery(this.kind);
        const runQuery = dsQuery.run.bind(dsQuery);
        return Object.assign(dsQuery, {
            withAncestors(...args) {
                const ancestors = extractAncestorPaths_1.default(model, ...args);
                if (ns != null) {
                    this.hasAncestor(Core_1.default.Instance.ds.key({
                        namespace: ns,
                        path: [].concat.apply([], ancestors),
                    }));
                }
                else {
                    this.hasAncestor(Core_1.default.Instance.ds.key([].concat.apply([], ancestors)));
                }
                return this;
            },
            run() {
                return __awaiter(this, void 0, void 0, function* () {
                    const data = yield runQuery();
                    if (hasIdProp && data[0].length > 0) {
                        augmentEntitiesWithIdProperties_1.default(data[0], idProp, type, kind);
                    }
                    return {
                        entities: data[0],
                        info: data[1],
                    };
                });
            },
        });
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
}
exports.default = PebblebedModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGViYmxlYmVkTW9kZWwuanMiLCJzb3VyY2VSb290IjoiRDovRGV2L19Qcm9qZWN0cy9HaXRodWIvcGViYmxlYmVkL3NyYy8iLCJzb3VyY2VzIjpbIlBlYmJsZWJlZE1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFNQSw2REFBc0Q7QUFDdEQsK0VBQXdFO0FBQ3hFLGlDQUEwQjtBQUMxQiw4REFBdUQ7QUFDdkQsOERBQXVEO0FBQ3ZELGtFQUEyRDtBQUMzRCx5RUFBa0U7QUFDbEUsK0ZBQXdGO0FBQ3hGLDJDQUF3RDtBQUd4RDtJQVFFLFlBQVksVUFBa0IsRUFBRSxZQUF5RDtRQU5qRixjQUFTLEdBQTBCLElBQUksQ0FBQztRQUl4QyxrQkFBYSxHQUFHLEtBQUssQ0FBQztRQUc1QixFQUFFLENBQUMsQ0FBRSxZQUFzQyxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQztZQUNuRSxJQUFJLENBQUMsTUFBTSxHQUFJLFlBQXNDLENBQUMscUJBQXFCLEVBQUUsQ0FBQztZQUM5RSxJQUFJLENBQUMsU0FBUyxHQUFJLFlBQXNDLENBQUM7UUFDM0QsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxDQUFDLE1BQU0sR0FBSSxZQUFvQyxDQUFDO1FBQ3RELENBQUM7UUFFRCxJQUFJLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQztRQUN2QixJQUFJLENBQUMsVUFBVSxHQUFHLGlDQUF1QixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUV2RCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDNUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7WUFFMUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFFaEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FB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