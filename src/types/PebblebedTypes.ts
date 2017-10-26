export type SchemaDefinitionProperties<T> = { [P in keyof T]: SchemaPropertyDefinition };
export type SchemaDefinitionOptions = { __excludeFromIndexes?: string[] };

export type SchemaDefinition<T = any> = SchemaDefinitionProperties<T> & SchemaDefinitionOptions;

export type SchemaPropertyDefinition = {
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

export interface DatastoreQuery {
  filter(
    property: string,
    comparator: "=" | "<" | ">" | "<=" | ">=",
    value: string | number | boolean | Date
  ): DatastoreQuery;
  order(property: string, options?: { descending: boolean }): DatastoreQuery;
  withAncestors(...args: any[]): DatastoreQuery;
  hasAncestor(ancestorKey: DatastoreEntityKey): DatastoreQuery;
  end(cursorToken: string): DatastoreQuery;
  limit(amount: number): DatastoreQuery;
  groupBy(properties: string[]): DatastoreQuery;
  start(nextPageCursor: any): DatastoreQuery;
  select(property: string | string[]): DatastoreQuery;
  run(): Promise<DatastoreQueryResponse>;
}
