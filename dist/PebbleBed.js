"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore = require("@google-cloud/datastore");
const ErrorMessages_1 = require("./ErrorMessages");
exports.PebblebedSingleton = {
    ds: null,
    useDatastore: (datastore) => {
        this.ds = datastore;
    }
};
exports.Pebblebed = exports.PebblebedSingleton;
class PebblebedModel {
    constructor(entityKind, entitySchema) {
        this.hasIdProperty = false;
        this.schema = entitySchema;
        this.kind = entityKind;
        this.idProperty = getIdPropertyFromSchema(entitySchema);
        if (this.idProperty != null) {
            this.hasIdProperty = true;
        }
    }
    save(data) {
        return new DatastoreSave(this, data);
    }
    load(ids) {
        return new DatastoreLoad(this, ids);
    }
    query() {
        const idProp = this.idProperty;
        const type = this.schema[this.idProperty].type;
        const hasIdProp = this.hasIdProperty;
        const dsQuery = exports.Pebblebed.ds.createQuery(this.kind);
        const runQuery = dsQuery.run.bind(dsQuery);
        return Object.assign(dsQuery, {
            async run() {
                const data = await runQuery();
                if (hasIdProp && data[0].length > 0) {
                    augmentEntitiesWithIdProperties(data[0], idProp, type);
                }
                return {
                    entities: data[0],
                    info: data[1],
                };
            }
        });
    }
    key(id) {
        return exports.Pebblebed.ds.key([this.kind, id]);
    }
    delete(data) {
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
    get entityHasIdProperty() {
        return this.hasIdProperty;
    }
}
exports.PebblebedModel = PebblebedModel;
class DatastoreOperation {
    constructor(model) {
        this.hasIdProperty = false;
        this.namespace = "";
        this.ancestors = [];
        this.transaction = null;
        this.kind = model.entityKind;
        this.schema = model.entitySchema;
        this.idProperty = model.entityIdProperty;
        this.hasIdProperty = model.entityHasIdProperty;
    }
    withAncestors(...args) {
        this.ancestors = [];
        for (let i = 0; i < args.length; i += 2) {
            const model = args[i];
            this.ancestors.push([model.entityKind, args[i + 1]]);
        }
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
        }
    }
    id(id) {
        this.loadIds = [id];
        return this;
    }
    ids(ids) {
        this.loadIds = ids;
        return this;
    }
    async run() {
        // TODO Namespace
        const baseKey = this.getBaseKey();
        const loadKeys = this.loadIds.map((id) => {
            return exports.Pebblebed.ds.key(baseKey.concat([this.kind, id]));
        });
        let resp;
        if (this.transaction) {
            resp = await this.transaction.get(loadKeys);
        }
        else {
            resp = await exports.Pebblebed.ds.get(loadKeys);
        }
        if (this.hasIdProperty && resp[0].length > 0) {
            augmentEntitiesWithIdProperties(resp[0], this.idProperty, this.schema[this.idProperty].type);
        }
        return resp[0];
    }
}
exports.DatastoreLoad = DatastoreLoad;
class DatastoreSave extends DatastoreOperation {
    constructor(model, data) {
        super(model);
        this.ignoreAnc = false;
        this.generate = false;
        if (Array.isArray(data)) {
            this.dataObjects = data;
        }
        else {
            this.dataObjects = [data];
        }
    }
    generateUnsetId() {
        this.generate = true;
        return this;
    }
    ignoreDetectedAncestors() {
        this.ignoreAnc = true;
        return this;
    }
    run() {
        const baseKey = this.getBaseKey();
        const entities = this.dataObjects.map((data) => {
            let setAncestors = baseKey;
            let id = null;
            const keyPart = data[datastore.KEY];
            if (this.hasIdProperty && data[this.idProperty] != null) {
                switch (this.schema[this.idProperty].type) {
                    case "string": {
                        if (typeof data[this.idProperty] !== "string") {
                            throw new Error(`PEBBLEBED: SAVE ENTITY: ID Property [${this.idProperty}] is type [string] but value passed is not string -> ${data[this.idProperty]}`);
                        }
                        id = data[this.idProperty];
                        break;
                    }
                    case "int": {
                        if (!Number.isInteger(data[this.idProperty]) && !/^\d+$/.test(data[this.idProperty])) {
                            throw new Error(`PEBBLEBED: SAVE ENTITY: ID Property [${this.idProperty}] is type [int] but value passed is not integer -> ${data[this.idProperty]}`);
                        }
                        id = datastore.int(data[this.idProperty]);
                        break;
                    }
                    default:
                        throw new Error(`PEBBLEBED: SAVE ENTITY: ID Property [${this.idProperty}] in entity [${this.kind}] must have type of: string || int`);
                }
            }
            else {
                if (keyPart && keyPart.path && keyPart.path.length > 0 && keyPart.path.length % 2 === 0) {
                    console.dir(keyPart);
                    if (keyPart.hasOwnProperty("id")) {
                        id = datastore.int(keyPart.id);
                    }
                    else {
                        id = keyPart.name;
                    }
                    console.log(`PEBBLEBED: SAVE ENTITY: Got ID from Key Part (ID property not set) : ${id}`);
                }
                else {
                    if (this.hasIdProperty) {
                        if (this.schema[this.idProperty].type === "string") {
                            throw new Error(`PEBBLEBED: SAVE ENTITY: string ID Property [${this.idProperty}] in entity [${this.kind}] must have a value in order to save.`);
                        }
                        else if (!this.generate) {
                            throw new Error(`PEBBLEBED: SAVE ENTITY: int ID Property [${this.idProperty}] in entity [${this.kind}] must have a value in order to save - or generateUnsetId() should be used.`);
                        }
                    }
                }
            }
            if (keyPart && keyPart.parent && !this.ignoreAnc) {
                if (setAncestors.length === 0) {
                    setAncestors = keyPart.parent.path;
                }
                else {
                    console.warn(`PEBBLEBED: SAVE ENTITY [${this.kind}]: Entity previously had ancestors:
                    ${keyPart.parent.path.toString()}
                    ... Saving with deliberately set ancestors (old entity will still exist under old ancestors):
                    ${setAncestors.toString()}`);
                }
            }
            const key = id ? exports.Pebblebed.ds.key(setAncestors.concat([this.kind, id])) : exports.Pebblebed.ds.key(setAncestors.concat([this.kind]));
            return {
                key,
                data: dataArrayFromSchema(data, this.schema, this.kind),
            };
        });
        if (this.transaction) {
            return this.transaction.save(entities);
        }
        return exports.Pebblebed.ds.save(entities);
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
                const keyPart = data[datastore.KEY];
                if (this.hasIdProperty && data[this.idProperty] != null) {
                    if (this.schema[this.idProperty].type === "int") {
                        if (Number.isInteger(data[this.idProperty]) || /^\d+$/.test(data[this.idProperty])) {
                            id = datastore.int(data[this.idProperty]);
                        }
                        else {
                            throw new Error(`PEBBLEBED: DELETE ENTITY: ID property [${this.idProperty}] = "${data[this.idProperty]}" -> It should be an Integer type as defined in the schema.`);
                        }
                    }
                    else {
                        if (typeof data[this.idProperty] === "string") {
                            id = data[this.idProperty];
                        }
                        else {
                            throw new Error(`PEBBLEBED: DELETE ENTITY: ID property [${this.idProperty}] = ${data[this.idProperty]} -> It should be an String type as defined in the schema.`);
                        }
                    }
                }
                else if (keyPart != null) {
                    if (keyPart.hasOwnProperty("id")) {
                        id = datastore.int(keyPart.id);
                    }
                    else {
                        id = keyPart.name;
                    }
                }
                else {
                    throw new Error(`PEBBLEBED: DELETE ENTITY: No ID set on entities passed to delete operation.`);
                }
                if (keyPart && keyPart.parent && !this.ignoreAnc) {
                    if (setAncestors.length === 0) {
                        setAncestors = keyPart.parent.path;
                    }
                    else {
                        console.warn(`PEBBLEBED: DELETE ENTITY [${this.kind}]: Entity previously had ancestors:
                        ${keyPart.parent.path.toString()}
                        ... Deleting entity with deliberately set ancestors:
                        ${setAncestors.toString()}`);
                    }
                }
                deleteKeys.push(exports.Pebblebed.ds.key(setAncestors.concat([this.kind, id])));
            }
        }
        else {
            deleteKeys = this.deleteIds.map((id) => {
                return exports.Pebblebed.ds.key(baseKey.concat([this.kind, id]));
            });
        }
        console.dir(this);
        console.dir(deleteKeys);
        if (this.transaction) {
            return this.transaction.delete(deleteKeys);
        }
        return exports.Pebblebed.ds.delete(deleteKeys);
    }
}
exports.DatastoreDelete = DatastoreDelete;
function augmentEntitiesWithIdProperties(respArray, idProperty, type) {
    for (const entity of respArray) {
        if (entity[datastore.KEY].hasOwnProperty("id")) {
            if (type === "int") {
                entity[idProperty] = entity[datastore.KEY].id;
            }
            else {
                console.warn(ErrorMessages_1.warnMessageSchemaIdType("int", "string", idProperty, entity[datastore.KEY].id));
            }
        }
        if (entity[datastore.KEY].hasOwnProperty("name")) {
            if (type === "string") {
                entity[idProperty] = entity[datastore.KEY].name;
            }
            else {
                console.warn(ErrorMessages_1.warnMessageSchemaIdType("string", "int", idProperty, entity[datastore.KEY].name));
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
            return datastore.int(value);
        }
        case "double": {
            return datastore.double(value);
        }
        case "datetime": {
            if (Object.prototype.toString.call(value) === '[object Date]') {
                return value;
            }
            else {
                return new Date(value);
            }
        }
        case "geoPoint": {
            return datastore.geoPoint(value);
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
                const exclude = (typeof schemaProp.excludeFromIndexes === "boolean") ? schemaProp.excludeFromIndexes : false;
                let value = data[property];
                if (schemaProp.onSave && typeof schemaProp.onSave === "function") {
                    value = schemaProp.onSave(value);
                }
                if (!(value == null) || (data.hasOwnProperty(property) && !(data[property] == null))) {
                    dataArray.push({
                        name: property,
                        value: convertToType(value, schemaProp.type),
                        excludeFromIndexes: exclude,
                    });
                }
                else if (schemaProp.required) {
                    throw new Error(`PEBBLEBED: SCHEMA ERROR: Property ${property} is required on datastore entity ${entityKind ? entityKind : ""}`);
                }
                else {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGViYmxlQmVkLmpzIiwic291cmNlUm9vdCI6IkQ6L0Rldi9fUHJvamVjdHMvR2l0aHViL3BlYmJsZWJlZC9zcmMvIiwic291cmNlcyI6WyJQZWJibGVCZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxREFBcUQ7QUFDckQsbURBQXdEO0FBaUQzQyxRQUFBLGtCQUFrQixHQUF3QjtJQUNuRCxFQUFFLEVBQUUsSUFBSTtJQUNSLFlBQVksRUFBRSxDQUFDLFNBQWM7UUFDekIsSUFBSSxDQUFDLEVBQUUsR0FBRyxTQUFTLENBQUM7SUFDeEIsQ0FBQztDQUNKLENBQUM7QUFFVyxRQUFBLFNBQVMsR0FBRywwQkFBa0IsQ0FBQztBQUU1QztJQU1JLFlBQVksVUFBa0IsRUFBRSxZQUE4QjtRQUZ0RCxrQkFBYSxHQUFHLEtBQUssQ0FBQztRQUcxQixJQUFJLENBQUMsTUFBTSxHQUFHLFlBQVksQ0FBQztRQUMzQixJQUFJLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQztRQUN2QixJQUFJLENBQUMsVUFBVSxHQUFHLHVCQUF1QixDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRXhELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMxQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUM5QixDQUFDO0lBQ0wsQ0FBQztJQUVNLElBQUksQ0FBQyxJQUF1QjtRQUMvQixNQUFNLENBQUMsSUFBSSxhQUFhLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFTSxJQUFJLENBQUMsR0FBZ0Q7UUFDeEQsTUFBTSxDQUFDLElBQUksYUFBYSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRU0sS0FBSztRQUNSLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDL0IsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJ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