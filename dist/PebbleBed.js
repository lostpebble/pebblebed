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
const ErrorMessages_1 = require("./ErrorMessages");
class Core {
    constructor() {
        try {
            this.dsModule = require("@google-cloud/datastore");
        }
        catch (e) {
            if (e.code === "MODULE_NOT_FOUND") {
                throw new Error(ErrorMessages_1.ErrorMessages.NO_GOOGLE_CLOUD_DEPENDENCY);
            }
            throw e;
        }
    }
    static get Instance() {
        return this._instance || (this._instance = new this());
    }
    setDatastore(datastore) {
        this.ds = datastore;
    }
}
exports.Pebblebed = {
    connectDatastore: (datastore) => {
        Core.Instance.setDatastore(datastore);
    },
    transaction: () => {
        return Core.Instance.ds.transaction();
    },
};
function checkDatastore(operation) {
    if (Core.Instance.ds == null) {
        throw new Error();
    }
}
class PebblebedModel {
    constructor(entityKind, entitySchema) {
        this.hasIdProperty = false;
        this.schema = entitySchema;
        this.kind = entityKind;
        this.idProperty = getIdPropertyFromSchema(entitySchema);
        if (this.idProperty != null) {
            this.hasIdProperty = true;
            this.idType = this.schema[this.idProperty].type;
            if (this.idType !== "string" && this.idType !== "int") {
                throw new Error(ErrorMessages_1.ErrorMessages.OPERATION_SCHEMA_ID_TYPE_ERROR(this, "CREATE MODEL"));
            }
        }
    }
    save(data) {
        checkDatastore("SAVE");
        return new DatastoreSave(this, data);
    }
    load(ids) {
        checkDatastore("LOAD");
        return new DatastoreLoad(this, ids);
    }
    query(namespace = null) {
        checkDatastore("QUERY");
        const model = this;
        const idProp = this.idProperty;
        const kind = this.kind;
        const hasIdProp = this.hasIdProperty;
        const type = hasIdProp ? this.schema[this.idProperty].type : null;
        const dsQuery = namespace != null
            ? Core.Instance.ds.createQuery(namespace, this.kind)
            : Core.Instance.ds.createQuery(this.kind);
        const runQuery = dsQuery.run.bind(dsQuery);
        return Object.assign(dsQuery, {
            withAncestors(...args) {
                const ancestors = extractAncestorPaths(model, ...args);
                this.hasAncestor(Core.Instance.ds.key([].concat.apply([], ancestors)));
                return this;
            },
            run() {
                return __awaiter(this, void 0, void 0, function* () {
                    const data = yield runQuery();
                    if (hasIdProp && data[0].length > 0) {
                        augmentEntitiesWithIdProperties(data[0], idProp, type, kind);
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
        checkDatastore("CREATE KEY");
        return Core.Instance.ds.key([this.kind, id]);
    }
    delete(data) {
        checkDatastore("DELETE");
        return new DatastoreDelete(this, data);
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
exports.PebblebedModel = PebblebedModel;
function extractAncestorPaths(model, ...args) {
    let ancestors = [];
    for (let i = 0; i < args.length; i += 2) {
        if (typeof args[i] === "string") {
            ancestors.push([args[i], args[i + 1]]);
        }
        else if (typeof args[i].entityKind === "string") {
            ancestors.push([args[i].entityKind, args[i + 1]]);
        }
        else {
            throw new Error(ErrorMessages_1.ErrorMessages.INCORRECT_ANCESTOR_KIND(model));
        }
    }
    return ancestors;
}
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
        this.ancestors = extractAncestorPaths(this.model, ...args);
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
            return Core.Instance.ds.key({
                namespace: this.namespace,
                path: fullPath,
            });
        }
        return Core.Instance.ds.key(fullPath);
    }
    getBaseKey() {
        const baseKey = [];
        for (const ancestor of this.ancestors) {
            baseKey.push(ancestor[0], ancestor[1]);
        }
        return baseKey;
    }
}
exports.DatastoreOperation = DatastoreOperation;
class DatastoreLoad extends DatastoreOperation {
    constructor(model, ids) {
        super(model);
        this.loadIds = [];
        if (ids != null) {
            if (Array.isArray(ids)) {
                this.loadIds = ids;
            }
            else {
                this.loadIds = [ids];
            }
            this.loadIds = this.loadIds.map(id => {
                if (this.idType === "int" && isNumber(id)) {
                    return Core.Instance.dsModule.int(id);
                }
                else if (this.idType === "string" && typeof id === "string") {
                    if (id.length === 0) {
                        throw new Error(ErrorMessages_1.ErrorMessages.OPERATION_STRING_ID_EMPTY(this.model, "LOAD"));
                    }
                    return id;
                }
                throw new Error(ErrorMessages_1.ErrorMessages.OPERATION_DATA_ID_TYPE_ERROR(this.model, "LOAD", id));
            });
        }
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const baseKey = this.getBaseKey();
            const loadKeys = this.loadIds.map(id => {
                return this.createFullKey(baseKey.concat(this.kind, id));
            });
            let resp;
            if (this.transaction) {
                resp = yield this.transaction.get(loadKeys);
            }
            else {
                resp = yield Core.Instance.ds.get(loadKeys);
            }
            if (this.hasIdProperty && resp[0].length > 0) {
                augmentEntitiesWithIdProperties(resp[0], this.idProperty, this.idType, this.kind);
            }
            return resp[0];
        });
    }
}
exports.DatastoreLoad = DatastoreLoad;
class DatastoreSave extends DatastoreOperation {
    constructor(model, data) {
        super(model);
        this.ignoreAnc = false;
        this.generate = false;
        this.transAllocateIds = false;
        if (Array.isArray(data)) {
            this.dataObjects = data;
        }
        else {
            this.dataObjects = [data];
        }
    }
    useTransaction(transaction, options = {
            allocateIdsNow: false,
        }) {
        super.useTransaction(transaction);
        this.transAllocateIds = options.allocateIdsNow;
        return this;
    }
    generateUnsetIds() {
        this.generate = true;
        return this;
    }
    ignoreDetectedAncestors() {
        this.ignoreAnc = true;
        return this;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const baseKey = this.getBaseKey();
            const entities = this.dataObjects.map(data => {
                let setAncestors = baseKey;
                let id = null;
                const entityKey = data[Core.Instance.dsModule.KEY];
                if (this.hasIdProperty && data[this.idProperty] != null) {
                    switch (this.idType) {
                        case "string": {
                            if (typeof data[this.idProperty] === "string") {
                                if (data[this.idProperty].length === 0) {
                                    throw new Error(ErrorMessages_1.ErrorMessages.OPERATION_STRING_ID_EMPTY(this.model, "SAVE"));
                                }
                                id = data[this.idProperty];
                            }
                            break;
                        }
                        case "int": {
                            if (isNumber(data[this.idProperty])) {
                                id = Core.Instance.dsModule.int(data[this.idProperty]);
                            }
                            break;
                        }
                    }
                    if (id == null) {
                        throw new Error(ErrorMessages_1.ErrorMessages.OPERATION_DATA_ID_TYPE_ERROR(this.model, "SAVE", data[this.idProperty]));
                    }
                }
                else {
                    if (entityKey &&
                        entityKey.path &&
                        entityKey.path.length > 0 &&
                        entityKey.path.length % 2 === 0) {
                        if (entityKey.hasOwnProperty("id")) {
                            id = Core.Instance.dsModule.int(entityKey.id);
                        }
                        else {
                            id = entityKey.name;
                        }
                    }
                    else {
                        if (this.hasIdProperty &&
                            (this.idType === "string" || !this.generate)) {
                            throw new Error(ErrorMessages_1.ErrorMessages.OPERATION_MISSING_ID_ERROR(this.model, "SAVE"));
                        }
                    }
                }
                if (!this.ignoreAnc && entityKey && entityKey.parent) {
                    if (setAncestors.length === 0) {
                        setAncestors = entityKey.parent.path;
                    }
                    else {
                        const prevAncestors = entityKey.parent.path.toString();
                        const nextAncestors = setAncestors.toString();
                        if (prevAncestors !== nextAncestors) {
                            console.warn(ErrorMessages_1.ErrorMessages.OPERATION_CHANGED_ANCESTORS_WARNING(this.model, "SAVE", prevAncestors, nextAncestors));
                        }
                    }
                }
                const key = id
                    ? this.createFullKey(setAncestors.concat([this.kind, id]))
                    : this.createFullKey(setAncestors.concat([this.kind]));
                return {
                    key,
                    generated: id == null,
                    data: dataArrayFromSchema(data, this.schema, this.kind),
                };
            });
            if (this.transaction) {
                if (this.transAllocateIds) {
                    const { newEntities, ids } = yield replaceIncompleteWithAllocatedIds(entities, this.transaction);
                    this.transaction.save(newEntities);
                    return {
                        generatedIds: ids,
                    };
                }
                this.transaction.save(entities);
                return {
                    get generatedIds() {
                        console.warn(ErrorMessages_1.ErrorMessages.ACCESS_TRANSACTION_GENERATED_IDS_ERROR);
                        return null;
                    },
                };
            }
            return Core.Instance.ds.save(entities).then(data => {
                return extractSavedIds(data)[0];
            });
        });
    }
}
exports.DatastoreSave = DatastoreSave;
class DatastoreDelete extends DatastoreOperation {
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
                const entityKey = data[Core.Instance.dsModule.KEY];
                if (this.hasIdProperty && data[this.idProperty] != null) {
                    switch (this.idType) {
                        case "int":
                            if (isNumber(data[this.idProperty])) {
                                id = Core.Instance.dsModule.int(data[this.idProperty]);
                            }
                            break;
                        case "string":
                            if (typeof data[this.idProperty] === "string") {
                                if (data[this.idProperty].length === 0) {
                                    throw new Error(ErrorMessages_1.ErrorMessages.OPERATION_STRING_ID_EMPTY(this.model, "DELETE"));
                                }
                                id = data[this.idProperty];
                            }
                            break;
                    }
                    if (id == null) {
                        throw new Error(ErrorMessages_1.ErrorMessages.OPERATION_DATA_ID_TYPE_ERROR(this.model, "DELETE", data[this.idProperty]));
                    }
                }
                else if (entityKey != null) {
                    if (entityKey.hasOwnProperty("id")) {
                        id = Core.Instance.dsModule.int(entityKey.id);
                    }
                    else {
                        id = entityKey.name;
                    }
                }
                else {
                    throw new Error(ErrorMessages_1.ErrorMessages.DELETE_NO_DATA_IDS_ERROR);
                }
                if (entityKey && entityKey.parent && !this.ignoreAnc) {
                    if (setAncestors.length === 0) {
                        setAncestors = entityKey.parent.path;
                    }
                    else {
                        const prevAncestors = entityKey.parent.path.toString();
                        const nextAncestors = setAncestors.toString();
                        if (prevAncestors !== nextAncestors) {
                            console.warn(ErrorMessages_1.ErrorMessages.OPERATION_CHANGED_ANCESTORS_WARNING(this.model, "DELETE", prevAncestors, nextAncestors));
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
        return Core.Instance.ds.delete(deleteKeys);
    }
}
exports.DatastoreDelete = DatastoreDelete;
function get(obj, path, def) {
    let cur = obj;
    for (let i = 0; i < path.length; i += 1) {
        if (cur == null) {
            return def;
        }
        if (typeof path[i] === "number") {
            if (Array.isArray(cur) && cur.length > path[i]) {
                cur = cur[path[i]];
            }
        }
        else if (typeof path[i] === "string") {
            if (cur.hasOwnProperty(path[i])) {
                cur = cur[path[i]];
            }
        }
        else {
            return def;
        }
    }
    return cur;
}
function isNumber(value) {
    return Number.isInteger(value) || /^\d+$/.test(value);
}
function replaceIncompleteWithAllocatedIds(entities, transaction = null) {
    return __awaiter(this, void 0, void 0, function* () {
        let allocateAmount = 0;
        let incompleteKey = null;
        for (const entity of entities) {
            if (entity.generated) {
                allocateAmount += 1;
                if (incompleteKey == null) {
                    incompleteKey = entity.key;
                }
            }
        }
        let allocatedKeys;
        if (transaction) {
            allocatedKeys = yield transaction.allocateIds(incompleteKey, allocateAmount);
        }
        else {
            allocatedKeys = yield Core.Instance.ds.allocateIds(incompleteKey, allocateAmount);
        }
        let ids = [];
        for (let i = 0; i < entities.length; i += 1) {
            if (entities[i].generated) {
                entities[i].key = allocatedKeys[0].shift();
                ids.push(entities[i].key.id);
            }
            else {
                ids.push(null);
            }
        }
        return { ids, newEntities: entities };
    });
}
function extractSavedIds(data) {
    const results = get(data, [0, "mutationResults"], null);
    const ids = [];
    if (results) {
        for (const result of results) {
            const paths = get(result, ["key", "path"], [null]);
            ids.push(get(paths, [paths.length - 1, "id"], null));
        }
    }
    data[0].generatedIds = ids;
    return data;
}
function augmentEntitiesWithIdProperties(respArray, idProperty, type, kind) {
    for (const entity of respArray) {
        if (entity[Object.getOwnPropertySymbols(entity)[0]].hasOwnProperty("id")) {
            if (type === "int") {
                entity[idProperty] = entity[Core.Instance.dsModule.KEY].id;
            }
            else {
                console.warn(ErrorMessages_1.ErrorMessages.LOAD_QUERY_DATA_ID_TYPE_ERROR(kind, "int", "string", idProperty, entity[Core.Instance.dsModule.KEY].id));
            }
        }
        if (entity[Core.Instance.dsModule.KEY].hasOwnProperty("name")) {
            if (type === "string") {
                entity[idProperty] = entity[Core.Instance.dsModule.KEY].name;
            }
            else {
                console.warn(ErrorMessages_1.ErrorMessages.LOAD_QUERY_DATA_ID_TYPE_ERROR(kind, "string", "int", idProperty, entity[Core.Instance.dsModule.KEY].name));
            }
        }
    }
}
function getIdPropertyFromSchema(schema) {
    for (const property in schema) {
        if (schema.hasOwnProperty(property)) {
            if (schema[property].role != null && schema[property].role === "id") {
                return property;
            }
        }
    }
    return null;
}
function convertToType(value, type) {
    switch (type) {
        case "string": {
            return value.toString();
        }
        case "int": {
            return Core.Instance.dsModule.int(value);
        }
        case "double": {
            return Core.Instance.dsModule.double(value);
        }
        case "datetime": {
            if (Object.prototype.toString.call(value) === "[object Date]") {
                return value;
            }
            else {
                return new Date(value);
            }
        }
        case "geoPoint": {
            if (value && value.value != null) {
                // This is the structure of the GeoPoint object
                return Core.Instance.dsModule.geoPoint(value.value);
            }
            return Core.Instance.dsModule.geoPoint(value);
        }
        case "array":
        case "boolean":
        case "object": {
            return value;
        }
        default: {
            return value;
        }
    }
}
function dataArrayFromSchema(data, schema, entityKind) {
    const dataArray = [];
    for (const property in schema) {
        if (schema.hasOwnProperty(property)) {
            const schemaProp = schema[property];
            if (schemaProp.role !== "id") {
                const exclude = typeof schemaProp.excludeFromIndexes === "boolean"
                    ? schemaProp.excludeFromIndexes
                    : false;
                let value = data[property];
                if (schemaProp.onSave && typeof schemaProp.onSave === "function") {
                    value = schemaProp.onSave(value);
                }
                if (!(value == null) ||
                    (data.hasOwnProperty(property) && !(data[property] == null))) {
                    dataArray.push({
                        name: property,
                        value: convertToType(value, schemaProp.type),
                        excludeFromIndexes: exclude,
                    });
                }
                else if (schemaProp.required) {
                    throw new Error(ErrorMessages_1.ErrorMessages.SCHEMA_REQUIRED_TYPE_MISSING(property, entityKind));
                }
                else if (!schemaProp.optional) {
                    dataArray.push({
                        name: property,
                        value: schemaProp.default ? schemaProp.default : null,
                        excludeFromIndexes: exclude,
                    });
                }
            }
        }
    }
    return dataArray;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGViYmxlQmVkLmpzIiwic291cmNlUm9vdCI6IkQ6L0Rldi9fUHJvamVjdHMvR2l0aHViL3BlYmJsZWJlZC9zcmMvIiwic291cmNlcyI6WyJQZWJibGVCZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLG1EQUFnRDtBQWtFaEQ7SUFNRTtRQUNFLElBQUksQ0FBQztZQUNILElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7UUFDckQsQ0FBQztRQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDWCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLGtCQUFrQixDQUFDLENBQUMsQ0FBQztnQkFDbEMsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBYSxDQUFDLDBCQUEwQixDQUFDLENBQUM7WUFDNUQsQ0FBQztZQUVELE1BQU0sQ0FBQyxDQUFDO1FBQ1YsQ0FBQztJQUNILENBQUM7SUFFTSxNQUFNLEtBQUssUUFBUTtRQUN4QixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFTSxZQUFZLENBQUMsU0FBUztRQUMzQixJQUFJLENBQUMsRUFBRSxHQUFHLFNBQVMsQ0FBQztJQUN0QixDQUFDO0NBQ0Y7QUFFWSxRQUFBLFNBQVMsR0FBRztJQUN2QixnQkFBZ0IsRUFBRSxDQUFDLFNBQWM7UUFDL0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUNELFdBQVcsRUFBRTtRQUNYLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUN4QyxDQUFDO0NBQ0YsQ0FBQztBQUVGLHdCQUF3QixTQUFpQjtJQUN2QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENB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