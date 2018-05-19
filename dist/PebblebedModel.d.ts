import { DatastoreEntityKey, DatastoreQuery, IPebblebedModelOptions, SchemaDefinition } from "./types/PebblebedTypes";
import DatastoreSave from "./operations/DatastoreSave";
import DatastoreLoad from "./operations/DatastoreLoad";
import DatastoreDelete from "./operations/DatastoreDelete";
import { PebblebedJoiSchema } from "./validation/PebblebedValidation";
import * as Joi from "joi";
import DatastoreFlush from "./operations/DatastoreFlush";
export default class PebblebedModel<T = any> {
    private schema;
    private joiSchema;
    private kind;
    private idProperty;
    private idType;
    private hasIdProperty;
    private defaultCachingSeconds;
    private neverCache;
    private defaultNamespace;
    constructor(entityKind: string, entitySchema: SchemaDefinition<T> | PebblebedJoiSchema<T>, {defaultCachingSeconds, neverCache, defaultNamespace}?: IPebblebedModelOptions);
    getJoiSchema: () => Joi.Schema;
    validate: (data: object | object[]) => {
        positive: boolean;
        message: string;
    };
    save(data: object | object[]): DatastoreSave;
    load(idsOrKeys: string | number | DatastoreEntityKey | Array<string | number | DatastoreEntityKey>): DatastoreLoad;
    query(namespace?: string): DatastoreQuery;
    key(id: string | number): DatastoreEntityKey;
    delete(data?: object | object[]): DatastoreDelete;
    flush(idsOrKeys: string | number | DatastoreEntityKey | Array<string | number | DatastoreEntityKey>): DatastoreFlush;
    allocateIds(amount: number, withAncestors?: any[]): Promise<Array<DatastoreEntityKey>>;
    readonly entityKind: string;
    readonly entitySchema: SchemaDefinition<T>;
    readonly entityIdProperty: string;
    readonly entityIdType: string;
    readonly entityHasIdProperty: boolean;
    readonly entityPebbleSchema: PebblebedJoiSchema<T>;
    readonly entityDefaultNamespace: any;
    readonly modelOptions: IPebblebedModelOptions;
}
