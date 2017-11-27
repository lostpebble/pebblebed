import { DatastoreEntityKey, DatastoreQuery, SchemaDefinition } from "./types/PebblebedTypes";
import DatastoreSave from "./operations/DatastoreSave";
import DatastoreLoad from "./operations/DatastoreLoad";
import DatastoreDelete from "./operations/DatastoreDelete";
import { PebblebedJoiSchema } from "./validation/PebblebedValidation";
export default class PebblebedModel<T = any> {
    private schema;
    private joiSchema;
    private kind;
    private idProperty;
    private idType;
    private hasIdProperty;
    constructor(entityKind: string, entitySchema: SchemaDefinition<T> | PebblebedJoiSchema<T>);
    save(data: object | object[]): DatastoreSave;
    load(idsOrKeys: string | number | DatastoreEntityKey | Array<string | number | DatastoreEntityKey>): DatastoreLoad;
    query(namespace?: string): DatastoreQuery;
    key(id: string | number): DatastoreEntityKey;
    delete(data?: object | object[]): DatastoreDelete;
    allocateIds(amount: number, withAncestors?: any[]): Promise<Array<DatastoreEntityKey>>;
    readonly entityKind: string;
    readonly entitySchema: SchemaDefinition<T>;
    readonly entityIdProperty: string;
    readonly entityIdType: string;
    readonly entityHasIdProperty: boolean;
}
