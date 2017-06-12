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
    default?: any;
}
export interface DatastoreTransaction {
    run: () => Promise<void>;
    commit: () => Promise<void>;
    createQuery: (kindOrNamespace: string, kind?: string) => any;
    allocateIds: (key: any, amount: number) => Promise<any>;
    rollback: () => Promise<void>;
    [property: string]: any;
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
export interface DatastoreQuery {
    filter(property: string, comparator: "=" | "<" | ">" | "<=" | ">=", value: string | number | boolean | Date): DatastoreQuery;
    order(property: string, options?: {
        descending: boolean;
    }): DatastoreQuery;
    withAncestors(...args: any[]): DatastoreQuery;
    hasAncestor(ancestorKey: DatastoreEntityKey): DatastoreQuery;
    end(cursorToken: string): DatastoreQuery;
    limit(amount: number): DatastoreQuery;
    groupBy(properties: string[]): DatastoreQuery;
    start(nextPageCursor: any): DatastoreQuery;
    select(property: string | string[]): DatastoreQuery;
    run(): Promise<DatastoreQueryResponse>;
}
export declare const Pebblebed: {
    connectDatastore: (datastore: any) => void;
    transaction: () => DatastoreTransaction;
};
export declare class PebblebedModel {
    private schema;
    private kind;
    private idProperty;
    private idType;
    private hasIdProperty;
    constructor(entityKind: string, entitySchema: SchemaDefinition);
    save(data: object | object[]): DatastoreSave;
    load(ids: string | number | Array<(string | number)>): DatastoreLoad;
    query(namespace?: string): DatastoreQuery;
    key(id: string | number): DatastoreEntityKey;
    delete(data?: object | object[]): DatastoreDelete;
    readonly entityKind: string;
    readonly entitySchema: SchemaDefinition;
    readonly entityIdProperty: string;
    readonly entityIdType: string;
    readonly entityHasIdProperty: boolean;
}
export declare class DatastoreOperation {
    protected model: PebblebedModel;
    protected kind: string;
    protected schema: SchemaDefinition;
    protected idProperty: string;
    protected idType: string;
    protected hasIdProperty: boolean;
    protected namespace: any;
    protected ancestors: Array<[string, string | number]>;
    protected transaction: any;
    constructor(model: PebblebedModel);
    withAncestors(...args: any[]): this;
    useTransaction(transaction: any): this;
    useNamespace(namespace: string): this;
    protected createFullKey(fullPath: any): any;
    protected getBaseKey(): any[];
}
export declare class DatastoreLoad extends DatastoreOperation {
    private loadIds;
    constructor(model: PebblebedModel, ids: string | number | Array<(string | number)>);
    run(): Promise<any>;
}
export declare class DatastoreSave extends DatastoreOperation {
    private dataObjects;
    private ignoreAnc;
    private generate;
    private transAllocateIds;
    constructor(model: PebblebedModel, data: object | object[]);
    useTransaction(transaction: any, options?: {
        allocateIdsNow: boolean;
    }): this;
    generateUnsetIds(): this;
    ignoreDetectedAncestors(): this;
    run(): Promise<any>;
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
