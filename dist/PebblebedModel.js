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
        }
        else {
            this.schema = entitySchema;
        }
        this.kind = entityKind;
        this.idProperty = getIdPropertyFromSchema_1.default(entitySchema);
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
}
exports.default = PebblebedModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGViYmxlYmVkTW9kZWwuanMiLCJzb3VyY2VSb290IjoiRDovRGV2L19Qcm9qZWN0cy9HaXRodWIvcGViYmxlYmVkL3NyYy8iLCJzb3VyY2VzIjpbIlBlYmJsZWJlZE1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFNQSw2REFBc0Q7QUFDdEQsK0VBQXdFO0FBQ3hFLGlDQUEwQjtBQUMxQiw4REFBdUQ7QUFDdkQsOERBQXVEO0FBQ3ZELGtFQUEyRDtBQUMzRCx5RUFBa0U7QUFDbEUsK0ZBQXdGO0FBQ3hGLDJDQUF3RDtBQUd4RDtJQVFFLFlBQVksVUFBa0IsRUFBRSxZQUF5RDtRQU5qRixjQUFTLEdBQTBCLElBQUksQ0FBQztRQUl4QyxrQkFBYSxHQUFHLEtBQUssQ0FBQztRQUc1QixFQUFFLENBQUMsQ0FBRSxZQUFzQyxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQztZQUNuRSxJQUFJLENBQUMsTUFBTSxHQUFJLFlBQXNDLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUNoRixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixJQUFJLENBQUMsTUFBTSxHQUFJLFlBQW9DLENBQUM7UUFDdEQsQ0FBQztRQUVELElBQUksQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxVQUFVLEdBQUcsaUNBQXVCLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFeEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzVCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1lBRTFCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDO1lBRWhELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssUUFBUSxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssS0FBSyxDQUFDLENBQUMs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