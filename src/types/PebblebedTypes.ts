import * as Joi from "joi";

export type SchemaDefinitionProperties<T> = { [P in keyof T]: SchemaPropertyDefinition };
export type SchemaDefinitionOptions = { __excludeFromIndexes?: string[] };

export type SchemaDefinition<T = any> = SchemaDefinitionProperties<T> & SchemaDefinitionOptions;

export type TReturnOnly = "FIRST" | "LAST" | "RANDOM";

export interface IPebblebedModelOptions {
  neverCache?: boolean;
  defaultCachingSeconds?: number;
  defaultNamespace?: string;
}

export interface IOJoiSchemaPropertyMetaInput<T> {
  role?: "id";
  indexed?: boolean;
  required?: boolean;
  nullValueIfUnset?: boolean;
  onSave?: (value: any) => T;
}

export interface IOJoiSchemaObjectPropertyMetaInput {
  serialize?: boolean;
}

export interface IOJoiSchemaSerializedJsonPropertyMetaInput {
  reviver?: (key: any, value: any) => any;
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

export type SchemaPropertyDefinition = {
  type: "string" | "int" | "double" | "boolean" | "datetime" | "array" | "object" | "geoPoint" | "serializedJson";
  required?: boolean;
  role?: "id";
  excludeFromIndexes?: boolean;
  serialize?: boolean;
  reviver?: (key: any, value: any) => any;
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

export interface DatastoreQueryResponse<T> {
  entities: T[];
  info?: {
    endCursor?: string;
    moreResults?: string;
  };
}

// export type TDatastoreQueryResponse<T> = DatastoreQueryResponse<T> | object;

export type TFilterComparator = "=" | "<" | ">" | "<=" | ">=";

export type TFilterFunction<T, R> = (
  property: keyof T,
  comparator: TFilterComparator,
  value: string | number | boolean | Date
) => R;
// ) => DatastoreQuery<T>;

export type DatastoreQuery<T> = DatastoreQueryRegular<T>|DatastoreQuerySingleReturn<T>;

/*export interface DatastoreQuery<T> {
  filter: TFilterFunction<T>;
  order(property: string, options?: { descending: boolean }): DatastoreQuery<T>;
  enableCache(on: boolean): DatastoreQuery<T>;
  cachingSeconds(seconds: number): DatastoreQuery<T>;
  withAncestors(...args: any[]): DatastoreQuery<T>;
  hasAncestor(ancestorKey: DatastoreEntityKey): DatastoreQuery<T>;
  end(cursorToken: string): DatastoreQuery<T>;
  limit(amount: number): DatastoreQuery<T>;
  offset(number: number): DatastoreQuery<T>;
  groupBy(properties: string[]): DatastoreQuery<T>;
  start(nextPageCursor: any): DatastoreQuery<T>;
  select(property: string | string[]): DatastoreQuery<T>;
  first(): DatastoreQuery<T>;
  last(): DatastoreQuery<T>;
  randomOne(): DatastoreQuery<T>;
  flushQueryInCache(): Promise<any>;
}*/

export interface DatastoreQueryRegular<T> {
  filter: TFilterFunction<T, DatastoreQueryRegular<T>>;
  order(property: string, options?: { descending: boolean }): DatastoreQueryRegular<T>;
  enableCache(on: boolean): DatastoreQueryRegular<T>;
  cachingSeconds(seconds: number): DatastoreQueryRegular<T>;
  withAncestors(...args: any[]): DatastoreQueryRegular<T>;
  hasAncestor(ancestorKey: DatastoreEntityKey): DatastoreQueryRegular<T>;
  end(cursorToken: string): DatastoreQueryRegular<T>;
  limit(amount: number): DatastoreQueryRegular<T>;
  offset(number: number): DatastoreQueryRegular<T>;
  groupBy(properties: string[]): DatastoreQueryRegular<T>;
  start(nextPageCursor: any): DatastoreQueryRegular<T>;
  select(property: string | string[]): DatastoreQueryRegular<T>;
  first(): DatastoreQuerySingleReturn<T>;
  last(): DatastoreQuerySingleReturn<T>;
  randomOne(): DatastoreQuerySingleReturn<T>;
  flushQueryInCache(): Promise<any>;
  run(): Promise<DatastoreQueryResponse<T>>;
}

export interface DatastoreQuerySingleReturn<T> {
  filter: TFilterFunction<T, DatastoreQuerySingleReturn<T>>;
  order(property: string, options?: { descending: boolean }): DatastoreQuerySingleReturn<T>;
  enableCache(on: boolean): DatastoreQuerySingleReturn<T>;
  cachingSeconds(seconds: number): DatastoreQuerySingleReturn<T>;
  withAncestors(...args: any[]): DatastoreQuerySingleReturn<T>;
  hasAncestor(ancestorKey: DatastoreEntityKey): DatastoreQuerySingleReturn<T>;
  end(cursorToken: string): DatastoreQuerySingleReturn<T>;
  limit(amount: number): DatastoreQuerySingleReturn<T>;
  offset(number: number): DatastoreQuerySingleReturn<T>;
  groupBy(properties: string[]): DatastoreQuerySingleReturn<T>;
  start(nextPageCursor: any): DatastoreQuerySingleReturn<T>;
  select(property: string | string[]): DatastoreQuerySingleReturn<T>;
  first(): DatastoreQuerySingleReturn<T>;
  last(): DatastoreQuerySingleReturn<T>;
  randomOne(): DatastoreQuerySingleReturn<T>;
  flushQueryInCache(): Promise<any>;
  run(): Promise<T>;
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

export interface InternalDatastoreQuery extends DatastoreQueryRegular<any> {
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