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
            if (i % 2 === 0) {
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
    }
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
                        path: [].concat.apply([], ancestors)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGViYmxlYmVkLmpzIiwic291cmNlUm9vdCI6IkQ6L0Rldi9fUHJvamVjdHMvR2l0aHViL3BlYmJsZWJlZC9zcmMvIiwic291cmNlcyI6WyJQZWJibGViZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLG1EQUFnRDtBQWtFaEQ7SUFPRTtRQUZPLGNBQVMsR0FBVyxJQUFJLENBQUM7UUFHOUIsSUFBSSxDQUFDO1lBQ0gsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztRQUNyRCxDQUFDO1FBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNYLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssa0JBQWtCLENBQUMsQ0FBQyxDQUFDO2dCQUNsQyxNQUFNLElBQUksS0FBSyxDQUFDLDZCQUFhLENBQUMsMEJBQTBCLENBQUMsQ0FBQztZQUM1RCxDQUFDO1lBRUQsTUFBTSxDQUFDLENBQUM7UUFDVixDQUFDO0lBQ0gsQ0FBQztJQUVNLE1BQU0sS0FBSyxRQUFRO1FBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVNLFlBQVksQ0FBQyxTQUFTO1FBQzNCLElBQUksQ0FBQyxFQUFFLEdBQUcsU0FBUyxDQUFDO0lBQ3RCLENBQUM7SUFFTSxZQUFZLENBQUMsU0FBaUI7UUFDbkMsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDN0IsQ0FBQztDQUNGO0FBRVksUUFBQSxTQUFTLEdBQUc7SUFDdkIsZ0JBQWdCLEVBQUUsQ0FBQyxTQUFjO1FBQy9CLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFDRCxXQUFXLEVBQUU7UUFDWCxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FB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