export interface SchemaDefinition {
    [property: string]: SchemaPropertyDefinition;
}
export interface SchemaPropertyDefinition {
    type: "string" | "int" | "double" | "boolean" | "datetime" | "array" | "object" | "geoPoint";
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
    order(property: string, options?: {
        descending: boolean;
    }): IDatastoreQuery;
    hasAncestor(ancestorKey: DatastoreEntityKey): IDatastoreQuery;
    end(cursorToken: string): IDatastoreQuery;
    limit(amount: number): IDatastoreQuery;
    groupBy(properties: string[]): IDatastoreQuery;
    start(nextPageCursor: any): IDatastoreQuery;
    select(property: string | string[]): IDatastoreQuery;
    run(): Promise<DatastoreQueryResponse>;
}
export declare const Pebblebed: {
    useDatastore: (datastore: any) => void;
};
export declare class PebblebedModel {
    private schema;
    private kind;
    private idProperty;
    private hasIdProperty;
    constructor(entityKind: string, entitySchema: SchemaDefinition);
    save(data: object | object[]): DatastoreSave;
    load(ids?: string | number | Array<(string | number)>): DatastoreLoad;
    query(): IDatastoreQuery;
    key(id: string | number): DatastoreEntityKey;
    delete(data?: object | object[]): DatastoreDelete;
    readonly entityKind: string;
    readonly entitySchema: SchemaDefinition;
    readonly entityIdProperty: string;
    readonly entityHasIdProperty: boolean;
}
export declare class DatastoreOperation {
    protected kind: string;
    protected schema: SchemaDefinition;
    protected idProperty: string;
    protected hasIdProperty: boolean;
    protected namespace: string;
    protected ancestors: Array<[string, string | number]>;
    protected transaction: any;
    constructor(model: PebblebedModel);
    withAncestors(...args: any[]): this;
    useTransaction(transaction: any): this;
    useNamespace(namespace: string): this;
    protected getBaseKey(): any[];
}
export declare class DatastoreLoad extends DatastoreOperation {
    private loadIds;
    constructor(model: PebblebedModel, ids?: string | number | Array<(string | number)>);
    id(id: string | number): this;
    ids(ids: Array<(string | number)>): this;
    run(): Promise<any>;
}
export declare class DatastoreSave extends DatastoreOperation {
    private dataObjects;
    private ignoreAnc;
    private generate;
    constructor(model: PebblebedModel, data: object | object[]);
    generateUnsetId(): this;
    ignoreDetectedAncestors(): this;
    run(): any;
}
export declare class DatastoreDelete extends DatastoreOperation {
    private dataObjects;
    private deleteIds;
    private useIds;
    private ignoreAnc;
    constructor(model: PebblebedModel, data?: object | object[]);
    id(id: string | number): this;
    ids(ids: Array<(string | number)>): this;
    ignoreDetectedAncestors(): this;
    run(): any;
}
