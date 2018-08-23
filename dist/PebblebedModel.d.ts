import { DatastoreEntityKey, DatastoreQueryRegular, IPebblebedModelOptions, SchemaDefinition } from "./types/PebblebedTypes";
import DatastoreSave from "./operations/DatastoreSave";
import { IDatastoreLoadRegular } from "./operations/DatastoreLoad";
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
    constructor(entityKind: string, entitySchema: SchemaDefinition<T> | PebblebedJoiSchema<T>, { defaultCachingSeconds, neverCache, defaultNamespace, }?: IPebblebedModelOptions);
    getJoiSchema: () => Joi.Schema;
    validate: (data: object | object[]) => {
        positive: boolean;
        message: string;
    };
    save(data: T | T[]): DatastoreSave<T>;
    load(idsOrKeys: string | number | DatastoreEntityKey | Array<string | number | DatastoreEntityKey>): IDatastoreLoadRegular<T>;
    query(namespace?: string): DatastoreQueryRegular<T>;
    key(id: string | number): DatastoreEntityKey;
    delete(data?: T | T[]): DatastoreDelete<T>;
    flush(idsOrKeys: string | number | DatastoreEntityKey | Array<string | number | DatastoreEntityKey>): DatastoreFlush<T>;
    allocateIds(amount: number, withAncestors?: any[] | null): Promise<Array<DatastoreEntityKey>>;
    readonly entityKind: string;
    readonly entitySchema: SchemaDefinition<T>;
    readonly entityIdProperty: string | null;
    readonly entityIdType: string;
    readonly entityHasIdProperty: boolean;
    readonly entityPebbleSchema: PebblebedJoiSchema<T>;
    readonly entityDefaultNamespace: string | undefined;
    readonly modelOptions: IPebblebedModelOptions;
}
