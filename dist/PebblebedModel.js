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
        this.hasIdProperty = false;
        this.schema = entitySchema;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGViYmxlYmVkTW9kZWwuanMiLCJzb3VyY2VSb290IjoiRDovRGV2L19Qcm9qZWN0cy9HaXRodWIvcGViYmxlYmVkL3NyYy8iLCJzb3VyY2VzIjpbIlBlYmJsZWJlZE1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFNQSw2REFBc0Q7QUFDdEQsK0VBQXdFO0FBQ3hFLGlDQUEwQjtBQUMxQiw4REFBdUQ7QUFDdkQsOERBQXVEO0FBQ3ZELGtFQUEyRDtBQUMzRCx5RUFBa0U7QUFDbEUsK0ZBQXdGO0FBQ3hGLDJDQUF3RDtBQUV4RDtJQU9FLFlBQVksVUFBa0IsRUFBRSxZQUFtQztRQUYzRCxrQkFBYSxHQUFHLEtBQUssQ0FBQztRQUc1QixJQUFJLENBQUMsTUFBTSxHQUFHLFlBQVksQ0FBQztRQUMzQixJQUFJLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQztRQUN2QixJQUFJLENBQUMsVUFBVSxHQUFHLGlDQUF1QixDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRXhELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUM1QixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztZQUUxQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUVoRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLFFBQVEsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ3RELHNCQUFVLENBQUMseUJBQWEsQ0FBQyw4QkFBOEIsQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQztZQUNqRixDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFFTSxJQUFJLENBQUMsSUFBdUI7UUFDakMsd0JBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUV2QixNQUFNLENBQUMs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