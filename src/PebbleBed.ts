// import * as _ from "lodash";
// import * as datastore from "@google-cloud/datastore";
import {warnMessageSchemaIdType} from "./ErrorMessages";

export interface SchemaDefinition {
    [property: string]: SchemaPropertyDefinition;
}

export interface SchemaPropertyDefinition {
    type: "string"|"int"|"double"|"boolean"|"datetime"|"array"|"object"|"geoPoint";
    required?: boolean;
    role?: "id";
    excludeFromIndexes?: boolean;
    optional?: boolean;
    onSave?: (value: any) => any;
    'default'?: any;
}

export interface DatastoreEntityKey {
    name: string;
    kind: string;
    namespace?: string;
    parent?: DatastoreEntityKey;
    path: string[];
}

export interface DatastoreQueryResponse {
    entities: any[];
    info?: {
        endCursor?: string;
        moreResults?: string;
    };
}

export interface IDatastoreQuery {
    filter(property: string, comparator: "=" | "<" | ">" | "<=" | ">=", value: string | number | boolean | Date): IDatastoreQuery;
    order(property: string, options?: { descending: boolean }): IDatastoreQuery;
    hasAncestor(ancestorKey: DatastoreEntityKey): IDatastoreQuery;
    end(cursorToken: string): IDatastoreQuery;
    limit(amount: number): IDatastoreQuery;
    groupBy(properties: string[]): IDatastoreQuery;
    start(nextPageCursor: any): IDatastoreQuery;
    select(property: string | string[]): IDatastoreQuery;
    run(): Promise<DatastoreQueryResponse>;
}

class Core {
    private static _instance: Core;

    public ds: any;
    public dsModule: any;

    private constructor() {
        this.dsModule = require("@google-cloud/datastore");
        console.dir(this.dsModule);
        console.log(require.resolve("@google-cloud/datastore"));
    }

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    public setDatastore(datastore) {
        this.ds = datastore;
    }
}

export const Pebblebed = {
    useDatastore: (datastore: any) => {
        Core.Instance.setDatastore(datastore);
    },
};

/*export const PebblebedOld = {
    ds: null,
    useDatastore: (datastore: any) => {
        this.ds = datastore;
    },
};*/

function checkDatastore(operation: string) {
    if (Core.Instance.ds == null) {
        throw new Error(`PEBBLEBED: ${operation} : Can't run operation without connecting to a datastore instance first - connect using Pebblebed.useDatastore( datastore )`);
    }
}

export class PebblebedModel {
    private schema: SchemaDefinition;
    private kind: string;
    private idProperty: string;
    private hasIdProperty = false;

    constructor(entityKind: string, entitySchema: SchemaDefinition) {
        this.schema = entitySchema;
        this.kind = entityKind;
        this.idProperty = getIdPropertyFromSchema(entitySchema);

        if (this.idProperty != null) {
            this.hasIdProperty = true;
        }
    }

    public save(data: object | object[]) {
        checkDatastore("SAVE");

        return new DatastoreSave(this, data);
    }

    public load(ids?: string | number | Array<(string | number)>) {
        checkDatastore("LOAD");

        return new DatastoreLoad(this, ids);
    }

    public query(): IDatastoreQuery {
        checkDatastore("QUERY");

        const idProp = this.idProperty;
        const type = this.schema[this.idProperty].type;
        const hasIdProp = this.hasIdProperty;

        const dsQuery = Core.Instance.ds.createQuery(this.kind);

        const runQuery = dsQuery.run.bind(dsQuery);

        return Object.assign(dsQuery, {
            async run(): Promise<DatastoreQueryResponse> {
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

    public key(id: string|number): DatastoreEntityKey {
        checkDatastore("CREATE KEY");

        return Core.Instance.ds.key([this.kind, id]);
    }

    public delete(data?: object | object[]) {
        checkDatastore("DELETE");

        return new DatastoreDelete(this, data);
    }

    public get entityKind() {
        return this.kind;
    }

    public get entitySchema() {
        return this.schema;
    }

    public get entityIdProperty() {
        return this.idProperty;
    }

    public get entityHasIdProperty() {
        return this.hasIdProperty;
    }
}

export class DatastoreOperation {
    protected kind: string;
    protected schema: SchemaDefinition;
    protected idProperty: string;
    protected hasIdProperty = false;
    protected namespace = "";
    protected ancestors: Array<[string, string | number]> = [];
    protected transaction: any = null;

    constructor(model: PebblebedModel) {
        this.kind = model.entityKind;
        this.schema = model.entitySchema;
        this.idProperty = model.entityIdProperty;
        this.hasIdProperty = model.entityHasIdProperty;
    }

    public withAncestors(...args: any[]) {
        this.ancestors = [];

        for (let i = 0; i < args.length; i += 2) {
            const model: PebblebedModel = args[i];
            this.ancestors.push([model.entityKind, args[i + 1]]);
        }
        return this;
    }

    public useTransaction(transaction: any) {
        this.transaction = transaction;
        return this;
    }

    public useNamespace(namespace: string) {
        this.namespace = namespace;
        return this;
    }

    protected getBaseKey() {
        const baseKey = [];

        for (const ancestor of this.ancestors) {
            baseKey.push(ancestor[0], ancestor[1]);
        }

        return baseKey;
    }
}

export class DatastoreLoad extends DatastoreOperation {
    private loadIds: Array<(string | number)> = [];

    constructor(model: PebblebedModel, ids?: string | number | Array<(string | number)>) {
        super(model);

        if (ids != null) {
            if (Array.isArray(ids)) {
                this.loadIds = ids;
            } else {
                this.loadIds = [ids];
            }
        }
    }

    public id(id: string | number) {
        this.loadIds = [id];
        return this;
    }

    public ids(ids: Array<(string | number)>) {
        this.loadIds = ids;
        return this;
    }

    public async run() {
        // TODO Namespace
        const baseKey = this.getBaseKey();

        const loadKeys = this.loadIds.map((id) => {
            return Core.Instance.ds.key(baseKey.concat([this.kind, id]));
        });

        let resp;

        if (this.transaction) {
            resp = await this.transaction.get(loadKeys);
        } else {
            resp = await Core.Instance.ds.get(loadKeys);
        }

        if (this.hasIdProperty && resp[0].length > 0) {
            augmentEntitiesWithIdProperties(resp[0], this.idProperty, this.schema[this.idProperty].type);
        }

        return resp[0];
    }
}

export class DatastoreSave extends DatastoreOperation {
    private dataObjects: any[];
    private ignoreAnc = false;
    private generate = false;

    constructor(model: PebblebedModel, data: object | object[]) {
        super(model);

        if (Array.isArray(data)) {
            this.dataObjects = data;
        } else {
            this.dataObjects = [data];
        }
    }

    public generateUnsetId() {
        this.generate = true;
        return this;
    }

    public ignoreDetectedAncestors() {
        this.ignoreAnc = true;
        return this;
    }

    public run() {
        const baseKey = this.getBaseKey();

        const entities = this.dataObjects.map((data) => {
            let setAncestors = baseKey;
            let id = null;
            const keyPart = data[Core.Instance.dsModule.KEY];

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

                        id = Core.Instance.dsModule.int(data[this.idProperty]);
                        break;
                    }
                    default:
                        throw new Error(`PEBBLEBED: SAVE ENTITY: ID Property [${this.idProperty}] in entity [${this.kind}] must have type of: string || int`);
                }
            } else {
                if (keyPart && keyPart.path && keyPart.path.length > 0 && keyPart.path.length % 2 === 0) {
                    console.dir(keyPart);
                    if (keyPart.hasOwnProperty("id")) {
                        id = Core.Instance.dsModule.int(keyPart.id);
                    } else {
                        id = keyPart.name;
                    }
                    console.log(`PEBBLEBED: SAVE ENTITY: Got ID from Key Part (ID property not set) : ${id}`);
                } else {
                    if (this.hasIdProperty) {
                        if (this.schema[this.idProperty].type === "string") {
                            throw new Error(`PEBBLEBED: SAVE ENTITY: string ID Property [${this.idProperty}] in entity [${this.kind}] must have a value in order to save.`);
                        } else if (!this.generate) {
                            throw new Error(`PEBBLEBED: SAVE ENTITY: int ID Property [${this.idProperty}] in entity [${this.kind}] must have a value in order to save - or generateUnsetId() should be used.`);
                        }
                    }
                }
            }

            if (keyPart && keyPart.parent && !this.ignoreAnc) {
                if (setAncestors.length === 0) {
                    setAncestors = keyPart.parent.path;
                } else {
                    console.warn(`PEBBLEBED: SAVE ENTITY [${this.kind}]: Entity previously had ancestors:
                    ${keyPart.parent.path.toString()}
                    ... Saving with deliberately set ancestors (old entity will still exist under old ancestors):
                    ${setAncestors.toString()}`);
                }
            }

            const key = id ? Core.Instance.ds.key(setAncestors.concat([this.kind, id])) : Core.Instance.ds.key(setAncestors.concat([this.kind]));

            return {
                key,
                data: dataArrayFromSchema(data, this.schema, this.kind),
            };
        });

        if (this.transaction) {
            return this.transaction.save(entities);
        }

        return Core.Instance.ds.save(entities);
    }
}

export class DatastoreDelete extends DatastoreOperation {
    private dataObjects: any[];
    private deleteIds: Array<(string | number)> = [];
    private useIds = false;
    private ignoreAnc = false;

    constructor(model: PebblebedModel, data?: object | object[]) {
        super(model);

        if (data) {
            if (Array.isArray(data)) {
                this.dataObjects = data;
            } else {
                this.dataObjects = [data];
            }
        } else {
            this.useIds = true;
        }
    }

    public id(id: string | number) {
        this.deleteIds = [id];
        return this;
    }

    public ids(ids: Array<(string | number)>) {
        this.deleteIds = ids;
        return this;
    }

    public ignoreDetectedAncestors() {
        this.ignoreAnc = true;
        return this;
    }

    public run() {
        const baseKey = this.getBaseKey();
        let deleteKeys = [];

        if (!this.useIds) {
            for (const data of this.dataObjects) {
                let setAncestors = baseKey;
                let id = null;
                const keyPart = data[Core.Instance.dsModule.KEY];

                if (this.hasIdProperty && data[this.idProperty] != null) {
                    if (this.schema[this.idProperty].type === "int") {
                        if (Number.isInteger(data[this.idProperty]) || /^\d+$/.test(data[this.idProperty])) {
                            id = Core.Instance.dsModule.int(data[this.idProperty]);
                        } else {
                            throw new Error(`PEBBLEBED: DELETE ENTITY: ID property [${this.idProperty}] = "${data[this.idProperty]}" -> It should be an Integer type as defined in the schema.`);
                        }
                    } else {
                        if (typeof data[this.idProperty] === "string") {
                            id = data[this.idProperty];
                        } else {
                            throw new Error(`PEBBLEBED: DELETE ENTITY: ID property [${this.idProperty}] = ${data[this.idProperty]} -> It should be an String type as defined in the schema.`);
                        }
                    }
                } else if (keyPart != null) {
                    if (keyPart.hasOwnProperty("id")) {
                        id = Core.Instance.dsModule.int(keyPart.id);
                    } else {
                        id = keyPart.name;
                    }
                } else {
                    throw new Error(`PEBBLEBED: DELETE ENTITY: No ID set on entities passed to delete operation.`);
                }

                if (keyPart && keyPart.parent && !this.ignoreAnc) {
                    if (setAncestors.length === 0) {
                        setAncestors = keyPart.parent.path;
                    } else {
                        console.warn(`PEBBLEBED: DELETE ENTITY [${this.kind}]: Entity previously had ancestors:
                        ${keyPart.parent.path.toString()}
                        ... Deleting entity with deliberately set ancestors:
                        ${setAncestors.toString()}`);
                    }
                }

                deleteKeys.push(Core.Instance.ds.key(setAncestors.concat([this.kind, id])));
            }
        } else {
            deleteKeys = this.deleteIds.map((id) => {
                return Core.Instance.ds.key(baseKey.concat([this.kind, id]));
            });
        }

        console.dir(this);
        console.dir(deleteKeys);

        if (this.transaction) {
            return this.transaction.delete(deleteKeys);
        }

        return Core.Instance.ds.delete(deleteKeys);
    }
}

function augmentEntitiesWithIdProperties(respArray: any[], idProperty: string, type: string) {
    for (const entity of respArray) {
        if (entity[Object.getOwnPropertySymbols(entity)[0]].hasOwnProperty("id")) {
            if (type === "int") {
                entity[idProperty] = entity[Core.Instance.dsModule.KEY].id;
            } else {
                console.warn(warnMessageSchemaIdType("int", "string", idProperty, entity[Core.Instance.dsModule.KEY].id));
            }
        }

        if (entity[Core.Instance.dsModule.KEY].hasOwnProperty("name")) {
            if (type === "string") {
                entity[idProperty] = entity[Core.Instance.dsModule.KEY].name;
            } else {
                console.warn(warnMessageSchemaIdType("string", "int", idProperty, entity[Core.Instance.dsModule.KEY].name));
            }
        }
    }
}

function getIdPropertyFromSchema(schema: SchemaDefinition) {
    for (const property in schema) {
        if (schema.hasOwnProperty(property)) {
            if (schema[property].role != null && schema[property].role === "id") {
                return property;
            }
        }
    }

    return null;
}

function convertToType(value: any, type: string) {
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
            if (Object.prototype.toString.call(value) === '[object Date]') {
                return value;
            } else {
                return new Date(value);
            }
        }
        case "geoPoint": {
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

function dataArrayFromSchema(data: any, schema: SchemaDefinition, entityKind?: string) {
    const dataArray = [];

    for (const property in schema) {
        if (schema.hasOwnProperty(property)) {
            const schemaProp: SchemaPropertyDefinition = schema[property];

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
                } else if (schemaProp.required) {
                    throw new Error(`PEBBLEBED: SCHEMA ERROR: Property ${property} is required on datastore entity ${entityKind ? entityKind : ""}`);
                } else {
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
