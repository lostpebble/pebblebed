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

export interface DatastoreQueryResponse<T = any> {
  entities: T[];
  info?: {
    endCursor?: string;
    moreResults?: string;
  };
}

export type TDatastoreQueryResponse = DatastoreQueryResponse | object;

export type TFilterComparator = "=" | "<" | ">" | "<=" | ">=";

export type TFilterFunction = (
  property: string,
  comparator: TFilterComparator,
  value: string | number | boolean | Date
) => DatastoreQuery;

export interface DatastoreQuery {
  filter: TFilterFunction;
  order(property: string, options?: { descending: boolean }): DatastoreQuery;
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
  first(): DatastoreQuery;
  last(): DatastoreQuery;
  randomOne(): DatastoreQuery;
  flushQueryInCache(): Promise<any>;
  run(): Promise<any>;
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