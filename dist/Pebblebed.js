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
        this.namespace = null;
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
    setNamespace(namespace) {
        this.namespace = namespace;
    }
}
exports.Pebblebed = {
    connectDatastore: (datastore) => {
        Core.Instance.setDatastore(datastore);
    },
    transaction: () => {
        return Core.Instance.ds.transaction();
    },
    setDefaultNamespace: (namespace) => {
        if (namespace != null) {
            if (typeof namespace === "string") {
                if (namespace.length > 0) {
                    Core.Instance.setNamespace(namespace);
                }
                else {
                    Core.Instance.setNamespace(null);
                }
            }
            else {
                throw new Error(ErrorMessages_1.ErrorMessages.SET_NAMESPACE_INCORRECT);
            }
        }
        else {
            Core.Instance.setNamespace(null);
        }
    },
    key(...args) {
        const keyPath = [];
        for (let i = 0; i < args.length; i += 1) {
            if (i % 2 === 0 && typeof args[i] !== "string") {
                keyPath.push(args[i].entityKind);
            }
            else {
                keyPath.push(args[i]);
            }
        }
        return Core.Instance.ds.key(keyPath);
    },
    keysFromObjectArray(sourceArray, ...args) {
        if (args.length % 2 !== 0) {
            throw new Error(ErrorMessages_1.ErrorMessages.INCORRECT_ARGUMENTS_KEYS_FROM_ARRAY);
        }
        return sourceArray.map(source => {
            const keyPath = [];
            for (let i = 0; i < args.length; i += 2) {
                keyPath.push(args[i], source[args[i + 1]]);
            }
            return exports.Pebblebed.key(...keyPath);
        });
    },
    uniqueKeysFromObjectArray(sourceArray, ...args) {
        if (args.length % 2 !== 0) {
            throw new Error(ErrorMessages_1.ErrorMessages.INCORRECT_ARGUMENTS_KEYS_FROM_ARRAY);
        }
        const obj = {};
        const keys = [];
        for (const source of sourceArray) {
            const keyPath = [];
            const kindKeyPath = [];
            for (let i = 0; i < args.length; i += 2) {
                keyPath.push(args[i], source[args[i + 1]]);
                kindKeyPath.push(args[i].entityKind, source[args[i + 1]]);
            }
            if (get(obj, kindKeyPath, false) === false) {
                keys.push(exports.Pebblebed.key(...keyPath));
                set(obj, kindKeyPath, true);
            }
        }
        return keys;
    },
};
function checkDatastore(operation) {
    if (Core.Instance.ds == null) {
        throw new Error("Datastore has not been connected to Pebblebed");
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
    load(idsOrKeys) {
        checkDatastore("LOAD");
        return new DatastoreLoad(this, idsOrKeys);
    }
    query(namespace = null) {
        checkDatastore("QUERY");
        const model = this;
        const idProp = this.idProperty;
        const kind = this.kind;
        const hasIdProp = this.hasIdProperty;
        const type = hasIdProp ? this.schema[this.idProperty].type : null;
        const ns = namespace != null ? namespace : Core.Instance.namespace;
        const dsQuery = ns != null
            ? Core.Instance.ds.createQuery(ns, this.kind)
            : Core.Instance.ds.createQuery(this.kind);
        const runQuery = dsQuery.run.bind(dsQuery);
        return Object.assign(dsQuery, {
            withAncestors(...args) {
                const ancestors = extractAncestorPaths(model, ...args);
                if (ns != null) {
                    this.hasAncestor(Core.Instance.ds.key({
                        namespace: ns,
                        path: [].concat.apply([], ancestors),
                    }));
                }
                else {
                    this.hasAncestor(Core.Instance.ds.key([].concat.apply([], ancestors)));
                }
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
    allocateIds(amount, withAncestors = null) {
        return __awaiter(this, void 0, void 0, function* () {
            checkDatastore("ALLOCATE IDS");
            let keyPath = [this.kind];
            if (withAncestors != null) {
                keyPath = [].concat(...extractAncestorPaths(this, ...withAncestors), keyPath);
            }
            const allocateIds = yield Core.Instance.ds.allocateIds(Core.Instance.ds.key(keyPath), amount);
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
        else if (Core.Instance.namespace != null) {
            return Core.Instance.ds.key({
                namespace: Core.Instance.namespace,
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
    constructor(model, idsOrKeys) {
        super(model);
        this.loadIds = [];
        this.usingKeys = false;
        if (idsOrKeys != null) {
            if (Array.isArray(idsOrKeys)) {
                this.loadIds = idsOrKeys;
            }
            else {
                this.loadIds = [idsOrKeys];
            }
            if (typeof this.loadIds[0] === "object") {
                if (this.loadIds[0].kind === this.kind) {
                    this.usingKeys = true;
                }
                else {
                    throw new Error(ErrorMessages_1.ErrorMessages.OPERATION_KEYS_WRONG(this.model, "LOAD"));
                }
            }
            else {
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
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            let loadKeys;
            if (this.usingKeys) {
                loadKeys = this.loadIds.map(key => {
                    return this.createFullKey(key.path);
                });
            }
            else {
                const baseKey = this.getBaseKey();
                loadKeys = this.loadIds.map(id => {
                    return this.createFullKey(baseKey.concat(this.kind, id));
                });
            }
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
                        if (this.hasIdProperty && (this.idType === "string" || !this.generate)) {
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
                const { dataObject, excludeFromIndexes } = buildDataFromSchema(data, this.schema, this.kind);
                return {
                    key,
                    excludeFromIndexes,
                    generated: id == null,
                    data: dataObject,
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
function get(obj, path, defaultValue) {
    let cur = obj;
    for (let i = 0; i < path.length; i += 1) {
        if (cur == null) {
            return defaultValue;
        }
        if (typeof path[i] === "number") {
            if (Array.isArray(cur) && cur.length > path[i]) {
                cur = cur[path[i]];
            }
            else {
                return defaultValue;
            }
        }
        else if (typeof path[i] === "string") {
            if (cur.hasOwnProperty(path[i])) {
                cur = cur[path[i]];
            }
            else {
                return defaultValue;
            }
        }
        else {
            return defaultValue;
        }
    }
    return cur;
}
function set(obj, path, value) {
    if (path.length === 1) {
        obj[path[0]] = value;
        return obj;
    }
    if (obj[path[0]] == null) {
        obj[path[0]] = {};
    }
    obj[path[0]] = set(obj[path[0]], path.slice(1), value);
    return obj;
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
const schemaOptionProps = {
    __excludeFromIndexes: true,
};
function buildDataFromSchema(data, schema, entityKind) {
    let excludeFromIndexesArray = [];
    const dataObject = {};
    for (const property in schema) {
        if (schema.hasOwnProperty(property) && !schemaOptionProps[property]) {
            const schemaProp = schema[property];
            if (schemaProp.role !== "id") {
                const exclude = typeof schemaProp.excludeFromIndexes === "boolean"
                    ? schemaProp.excludeFromIndexes
                    : false;
                if (exclude && schemaProp.type !== "array") {
                    excludeFromIndexesArray.push(property);
                }
                let value = data[property];
                if (schemaProp.onSave && typeof schemaProp.onSave === "function") {
                    value = schemaProp.onSave(value);
                }
                if (!(value == null) || (data.hasOwnProperty(property) && !(data[property] == null))) {
                    dataObject[property] = convertToType(value, schemaProp.type);
                }
                else if (schemaProp.required) {
                    throw new Error(ErrorMessages_1.ErrorMessages.SCHEMA_REQUIRED_TYPE_MISSING(property, entityKind));
                }
                else if (!schemaProp.optional) {
                    dataObject[property] = schemaProp.default ? schemaProp.default : null;
                }
            }
        }
    }
    if (schema.__excludeFromIndexes != null) {
        excludeFromIndexesArray = schema.__excludeFromIndexes;
    }
    return {
        excludeFromIndexes: excludeFromIndexesArray,
        dataObject,
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGViYmxlYmVkLmpzIiwic291cmNlUm9vdCI6Ii9ob21lL2xvc3RwZWJibGUvRGV2L290aGVyX3Byb2plY3RzL2dpdGh1Yi9wZWJibGViZWQvc3JjLyIsInNvdXJjZXMiOlsiUGViYmxlYmVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxtREFBZ0Q7QUE0RGhEO0lBT0U7UUFGTyxjQUFTLEdBQVcsSUFBSSxDQUFDO1FBRzlCLElBQUksQ0FBQztZQUNILElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7UUFDckQsQ0FBQztRQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDWCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLGtCQUFrQixDQUFDLENBQUMsQ0FBQztnQkFDbEMsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBYSxDQUFDLDBCQUEwQixDQUFDLENBQUM7WUFDNUQsQ0FBQztZQUVELE1BQU0sQ0FBQyxDQUFDO1FBQ1YsQ0FBQztJQUNILENBQUM7SUFFTSxNQUFNLEtBQUssUUFBUTtRQUN4QixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFTSxZQUFZLENBQUMsU0FBUztRQUMzQixJQUFJLENBQUMsRUFBRSxHQUFHLFNBQVMsQ0FBQztJQUN0QixDQUFDO0lBRU0sWUFBWSxDQUFDLFNBQWlCO1FBQ25DLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQzdCLENBQUM7Q0FDRjtBQUVZLFFBQUEsU0FBUyxHQUFHO0lBQ3ZCLGdCQUFnQixFQUFFLENBQUMsU0FBYztRQUMvQixJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBQ0QsV0FBVyxFQUFFO1FBQ1gsTUFBTSxDQUFD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