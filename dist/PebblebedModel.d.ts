import { DatastoreQueryRegular, IPebblebedModelOptions, SchemaDefinition } from "./types/PebblebedTypes";
import DatastoreSave from "./operations/DatastoreSave";
import { IDatastoreLoadRegular } from "./operations/DatastoreLoad";
import DatastoreDelete from "./operations/DatastoreDelete";
import { PebblebedJoiSchema } from "./validation/PebblebedValidation";
import * as Joi from "@hapi/joi";
import DatastoreFlush from "./operations/DatastoreFlush";
import { Key } from "@google-cloud/datastore";
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
    load(idsOrKeys: string | number | Key | Array<string | number | Key>): IDatastoreLoadRegular<T>;
    query(namespace?: string | null): DatastoreQueryRegular<T>;
    key(id: string | number): Key;
    delete(data?: T | T[]): DatastoreDelete<T>;
    flush(idsOrKeys: string | number | Key | Array<string | number | Key>): DatastoreFlush<T>;
    allocateIds({ amount, withAncestors, namespace, }: {
        amount: number;
        withAncestors?: any[] | null;
        namespace?: string | null;
    }): Promise<Array<Key>>;
    get entityKind(): string;
    get entitySchema(): SchemaDefinition<T>;
    get entityIdProperty(): string | null;
    get entityIdType(): "string" | "int";
    get entityHasIdProperty(): boolean;
    get entityPebbleSchema(): PebblebedJoiSchema<T>;
    get entityDefaultNamespace(): string;
    get modelOptions(): IPebblebedModelOptions;
}
