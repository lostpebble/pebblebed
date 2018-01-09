import * as Joi from "joi";
export declare type SchemaDefinitionProperties<T> = {
    [P in keyof T]: SchemaPropertyDefinition;
};
export declare type SchemaDefinitionOptions = {
    __excludeFromIndexes?: string[];
};
export declare type SchemaDefinition<T = any> = SchemaDefinitionProperties<T> & SchemaDefinitionOptions;
export declare type TReturnOnly = "FIRST" | "LAST" | "RANDOM";
export interface IPebblebedModelOptions {
    neverCache?: boolean;
    defaultCachingSeconds?: number;
}
export interface IOJoiSchemaPropertyMetaInput {
    role?: "id";
    indexed?: boolean;
    nullValueIfUnset?: boolean;
    onSave?: (value: any) => any;
}
export interface IOJoiSchemaObjectPropertyMetaInput {
    serialize?: boolean;
}
export interface IOJoiSchemaDefaultMetaInput {
    indexed?: boolean;
    nullValueIfUnset?: boolean;
}
export interface IJoiDescribeObjectProperty {
    type: string;
    meta?: any[];
    invalids?: any[];
    flags?: {
        sparse?: boolean;
        presence?: "required";
        default?: any;
    };
}
export interface IJoiDescribeObject {
    [prop: string]: IJoiDescribeObjectProperty;
}
export interface IPebblebedJoiSchema {
    isPebbledbedJoiSchema: boolean;
    entityPropertyMetaDefaults: IOJoiSchemaDefaultMetaInput;
    entitySchema: Joi.Schema;
}
export declare type SchemaPropertyDefinition = {
    type: "string" | "int" | "double" | "boolean" | "datetime" | "array" | "object" | "geoPoint";
    required?: boolean;
    role?: "id";
    excludeFromIndexes?: boolean;
    serialize?: boolean;
    optional?: boolean;
    onSave?: (value: any) => any;
    default?: any;
};
export interface DatastoreTransaction {
    run: () => Promise<void>;
    commit: () => Promise<void>;
    createQuery: (kindOrNamespace: string, kind?: string) => any;
    allocateIds: (key: any, amount: number) => Promise<any>;
    rollback: () => Promise<void>;
    [property: string]: any;
}
export interface DatastoreEntityKey {
    name?: string;
    id?: string;
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
export declare type TDatastoreQueryResponse = DatastoreQueryResponse | object;
export declare type TFilterComparator = "=" | "<" | ">" | "<=" | ">=";
export declare type TFilterFunction = (property: string, comparator: TFilterComparator, value: string | number | boolean | Date) => DatastoreQuery;
export interface DatastoreQuery {
    filter: TFilterFunction;
    order(property: string, options?: {
        descending: boolean;
    }): DatastoreQuery;
    enableCache(on: boolean): DatastoreQuery;
    cachingSeconds(seconds: number): DatastoreQuery;
    withAncestors(...args: any[]): DatastoreQuery;
    hasAncestor(ancestorKey: DatastoreEntityKey): DatastoreQuery;
    end(cursorToken: string): DatastoreQuery;
    limit(amount: number): DatastoreQuery;
    offset(number: number): DatastoreQuery;
    groupBy(properties: string[]): DatastoreQuery;
    start(nextPageCursor: any): DatastoreQuery;
    select(property: string | string[]): DatastoreQuery;
    run(): Promise<DatastoreQueryResponse>;
}
export interface InternalDatastoreQueryFilter {
    name: string;
    op: TFilterComparator;
    val: string | number | boolean | Date | DatastoreEntityKey;
}
export interface InternalDatastoreQueryOrder {
    name: string;
    sign: "+" | "-";
}
export interface InternalDatastoreQuery extends DatastoreQuery {
    filters: InternalDatastoreQueryFilter[];
    groupByVal: string[];
    kinds: string[];
    limitVal: number;
    namespace: string;
    offsetVal: number;
    orders: InternalDatastoreQueryOrder[];
    selectVal: string[];
    startVal: string;
    endVal: string;
}
