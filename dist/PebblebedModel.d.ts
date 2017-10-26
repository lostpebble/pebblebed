import { DatastoreEntityKey, DatastoreQuery, SchemaDefinition } from "./types/PebblebedTypes";
import DatastoreSave from "./operations/DatastoreSave";
import DatastoreLoad from "./operations/DatastoreLoad";
import DatastoreDelete from "./operations/DatastoreDelete";
export default class PebblebedModel {
    private schema;
    private kind;
    private idProperty;
    private idType;
    private hasIdProperty;
    constructor(entityKind: string, entitySchema: SchemaDefinition<any>);
    save(data: object | object[]): DatastoreSave;
    load(idsOrKeys: string | number | DatastoreEntityKey | Array<string | number | DatastoreEntityKey>): DatastoreLoad;
    query(namespace?: string): DatastoreQuery;
    key(id: string | number): DatastoreEntityKey;
    delete(data?: object | object[]): DatastoreDelete;
    allocateIds(amount: number, withAncestors?: any[]): Promise<Array<DatastoreEntityKey>>;
    readonly entityKind: string;
    readonly entitySchema: any;
    readonly entityIdProperty: string;
    readonly entityIdType: string;
    readonly entityHasIdProperty: boolean;
}
