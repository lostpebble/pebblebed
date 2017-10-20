import { ErrorMessages } from "./ErrorMessages";

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

class Core {
  private static _instance: Core;

  public ds: any;
  public dsModule: any;
  public namespace: string = null;

  private constructor() {
    try {
      this.dsModule = require("@google-cloud/datastore");
    } catch (e) {
      if (e.code === "MODULE_NOT_FOUND") {
        throw new Error(ErrorMessages.NO_GOOGLE_CLOUD_DEPENDENCY);
      }

      throw e;
    }
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public setDatastore(datastore) {
    this.ds = datastore;
  }

  public setNamespace(namespace: string) {
    this.namespace = namespace;
  }
}

export const Pebblebed = {
  connectDatastore: (datastore: any) => {
    Core.Instance.setDatastore(datastore);
  },
  transaction: (): DatastoreTransaction => {
    return Core.Instance.ds.transaction();
  },
  setDefaultNamespace: (namespace: string) => {
    if (namespace != null) {
      if (typeof namespace === "string") {
        if (namespace.length > 0) {
          Core.Instance.setNamespace(namespace);
        } else {
          Core.Instance.setNamespace(null);
        }
      } else {
        throw new Error(ErrorMessages.SET_NAMESPACE_INCORRECT);
      }
    } else {
      Core.Instance.setNamespace(null);
    }
  },
  key(...args: any[]) {
    const keyPath = [];

    for (let i = 0; i < args.length; i += 1) {
      if (i % 2 === 0 && typeof args[i] !== "string") {
        keyPath.push((args[i] as PebblebedModel).entityKind);
      } else {
        keyPath.push(args[i]);
      }
    }

    return Core.Instance.ds.key(keyPath);
  },
  keysFromObjectArray<T>(
    sourceArray: T[],
    ...args: Array<PebblebedModel | keyof T>
  ): DatastoreEntityKey[] {
    if (args.length % 2 !== 0) {
      throw new Error(ErrorMessages.INCORRECT_ARGUMENTS_KEYS_FROM_ARRAY);
    }

    return sourceArray.map(source => {
      const keyPath = [];

      for (let i = 0; i < args.length; i += 2) {
        keyPath.push(args[i], source[args[i + 1] as keyof T]);
      }

      return Pebblebed.key(...keyPath);
    });
  },
  uniqueKeysFromObjectArray<T>(
    sourceArray: T[],
    ...args: Array<PebblebedModel | keyof T>
  ): DatastoreEntityKey[] {
    if (args.length % 2 !== 0) {
      throw new Error(ErrorMessages.INCORRECT_ARGUMENTS_KEYS_FROM_ARRAY);
    }

    const obj = {};
    const keys: DatastoreEntityKey[] = [];

    for (const source of sourceArray) {
      const keyPath = [];
      const kindKeyPath = [];

      for (let i = 0; i < args.length; i += 2) {
        keyPath.push(args[i], source[args[i + 1] as keyof T]);
        kindKeyPath.push((args[i] as PebblebedModel).entityKind, source[args[i + 1] as keyof T]);
      }

      if (get(obj, kindKeyPath, false) === false) {
        keys.push(Pebblebed.key(...keyPath));
        set(obj, kindKeyPath, true);
      }
    }

    return keys;
  },
};

function checkDatastore(operation: string) {
  if (Core.Instance.ds == null) {
    throw new Error("Datastore has not been connected to Pebblebed");
  }
}

export class PebblebedModel {
  private schema: SchemaDefinition<any>;
  private kind: string;
  private idProperty: string;
  private idType: string;
  private hasIdProperty = false;

  constructor(entityKind: string, entitySchema: SchemaDefinition<any>) {
    this.schema = entitySchema;
    this.kind = entityKind;
    this.idProperty = getIdPropertyFromSchema(entitySchema);

    if (this.idProperty != null) {
      this.hasIdProperty = true;

      this.idType = this.schema[this.idProperty].type;

      if (this.idType !== "string" && this.idType !== "int") {
        throw new Error(ErrorMessages.OPERATION_SCHEMA_ID_TYPE_ERROR(this, "CREATE MODEL"));
      }
    }
  }

  public save(data: object | object[]) {
    checkDatastore("SAVE");

    return new DatastoreSave(this, data);
  }

  public load(
    idsOrKeys: string | number | DatastoreEntityKey | Array<string | number | DatastoreEntityKey>
  ) {
    checkDatastore("LOAD");

    return new DatastoreLoad(this, idsOrKeys);
  }

  public query(namespace: string = null): DatastoreQuery {
    checkDatastore("QUERY");

    const model = this;
    const idProp = this.idProperty;
    const kind = this.kind;
    const hasIdProp = this.hasIdProperty;
    const type = hasIdProp ? this.schema[this.idProperty].type : null;

    const ns = namespace != null ? namespace : Core.Instance.namespace;

    const dsQuery =
      ns != null
        ? Core.Instance.ds.createQuery(ns, this.kind)
        : Core.Instance.ds.createQuery(this.kind);

    const runQuery = dsQuery.run.bind(dsQuery);

    return Object.assign(dsQuery, {
      withAncestors(...args: any[]): DatastoreQuery {
        const ancestors = extractAncestorPaths(model, ...args);

        if (ns != null) {
          this.hasAncestor(
            Core.Instance.ds.key({
              namespace: ns,
              path: [].concat.apply([], ancestors),
            })
          );
        } else {
          this.hasAncestor(Core.Instance.ds.key([].concat.apply([], ancestors)));
        }

        return this;
      },
      async run(): Promise<DatastoreQueryResponse> {
        const data = await runQuery();

        if (hasIdProp && data[0].length > 0) {
          augmentEntitiesWithIdProperties(data[0], idProp, type, kind);
        }

        return {
          entities: data[0],
          info: data[1],
        };
      },
    });
  }

  public key(id: string | number): DatastoreEntityKey {
    checkDatastore("CREATE KEY");

    return Core.Instance.ds.key([this.kind, id]);
  }

  public delete(data?: object | object[]) {
    checkDatastore("DELETE");

    return new DatastoreDelete(this, data);
  }

  public async allocateIds(amount: number, withAncestors: any[] = null): Promise<Array<DatastoreEntityKey>> {
    checkDatastore("ALLOCATE IDS");

    let keyPath = [this.kind];

    if (withAncestors != null) {
      keyPath = [].concat(...extractAncestorPaths(this, ...withAncestors), keyPath);
    }

    const allocateIds = await Core.Instance.ds.allocateIds(Core.Instance.ds.key(keyPath), amount);

    return allocateIds[0];
  }

  public get entityKind() {
    return this.kind;
  }

  public get entitySchema() {
    return this.schema;
  }

  public get entityIdProperty() {
    return this.idProperty;
  }

  public get entityIdType() {
    return this.idType;
  }

  public get entityHasIdProperty() {
    return this.hasIdProperty;
  }
}

function extractAncestorPaths(model, ...args: any[]) {
  let ancestors = [];

  for (let i = 0; i < args.length; i += 2) {
    if (typeof args[i] === "string") {
      ancestors.push([args[i], args[i + 1]]);
    } else if (typeof args[i].entityKind === "string") {
      ancestors.push([args[i].entityKind, args[i + 1]]);
    } else {
      throw new Error(ErrorMessages.INCORRECT_ANCESTOR_KIND(model));
    }
  }

  return ancestors;
}

export class DatastoreOperation {
  protected model: PebblebedModel;
  protected kind: string;
  protected schema: SchemaDefinition<any>;
  protected idProperty: string;
  protected idType: string;
  protected hasIdProperty = false;
  protected namespace = null;
  protected ancestors: Array<[string, string | number]> = [];
  protected transaction: any = null;

  constructor(model: PebblebedModel) {
    this.model = model;
    this.kind = model.entityKind;
    this.schema = model.entitySchema;
    this.idProperty = model.entityIdProperty;
    this.idType = model.entityIdType;
    this.hasIdProperty = model.entityHasIdProperty;
  }

  public withAncestors(...args: any[]) {
    this.ancestors = extractAncestorPaths(this.model, ...args);
    return this;
  }

  public useTransaction(transaction: any) {
    this.transaction = transaction;
    return this;
  }

  public useNamespace(namespace: string) {
    this.namespace = namespace;
    return this;
  }

  protected createFullKey(fullPath) {
    if (this.namespace != null) {
      return Core.Instance.ds.key({
        namespace: this.namespace,
        path: fullPath,
      });
    } else if (Core.Instance.namespace != null) {
      return Core.Instance.ds.key({
        namespace: Core.Instance.namespace,
        path: fullPath,
      });
    }
    return Core.Instance.ds.key(fullPath);
  }

  protected getBaseKey() {
    const baseKey = [];

    for (const ancestor of this.ancestors) {
      baseKey.push(ancestor[0], ancestor[1]);
    }

    return baseKey;
  }
}

export class DatastoreLoad extends DatastoreOperation {
  private loadIds: Array<string | number | DatastoreEntityKey> = [];
  private usingKeys = false;

  constructor(
    model: PebblebedModel,
    idsOrKeys: string | number | DatastoreEntityKey | Array<string | number | DatastoreEntityKey>
  ) {
    super(model);

    if (idsOrKeys != null) {
      if (Array.isArray(idsOrKeys)) {
        this.loadIds = idsOrKeys;
      } else {
        this.loadIds = [idsOrKeys];
      }

      if (typeof this.loadIds[0] === "object") {
        if ((this.loadIds[0] as DatastoreEntityKey).kind === this.kind) {
          this.usingKeys = true;
        } else {
          throw new Error(ErrorMessages.OPERATION_KEYS_WRONG(this.model, "LOAD"));
        }
      } else {
        this.loadIds = this.loadIds.map(id => {
          if (this.idType === "int" && isNumber(id)) {
            return Core.Instance.dsModule.int(id);
          } else if (this.idType === "string" && typeof id === "string") {
            if (id.length === 0) {
              throw new Error(ErrorMessages.OPERATION_STRING_ID_EMPTY(this.model, "LOAD"));
            }

            return id;
          }

          throw new Error(ErrorMessages.OPERATION_DATA_ID_TYPE_ERROR(this.model, "LOAD", id));
        });
      }
    }
  }

  public async run() {
    let loadKeys;

    if (this.usingKeys) {
      loadKeys = this.loadIds.map(key => {
        return this.createFullKey((key as DatastoreEntityKey).path);
      });
    } else {
      const baseKey = this.getBaseKey();

      loadKeys = this.loadIds.map(id => {
        return this.createFullKey(baseKey.concat(this.kind, id));
      });
    }

    let resp;

    if (this.transaction) {
      resp = await this.transaction.get(loadKeys);
    } else {
      resp = await Core.Instance.ds.get(loadKeys);
    }

    if (this.hasIdProperty && resp[0].length > 0) {
      augmentEntitiesWithIdProperties(resp[0], this.idProperty, this.idType, this.kind);
    }

    return resp[0];
  }
}

export class DatastoreSave extends DatastoreOperation {
  private dataObjects: any[];
  private ignoreAnc = false;
  private generate = false;
  private transAllocateIds = false;

  constructor(model: PebblebedModel, data: object | object[]) {
    super(model);

    if (Array.isArray(data)) {
      this.dataObjects = data;
    } else {
      this.dataObjects = [data];
    }
  }

  public useTransaction(
    transaction: any,
    options = {
      allocateIdsNow: false,
    }
  ) {
    super.useTransaction(transaction);
    this.transAllocateIds = options.allocateIdsNow;
    return this;
  }

  public generateUnsetIds() {
    this.generate = true;
    return this;
  }

  public ignoreDetectedAncestors() {
    this.ignoreAnc = true;
    return this;
  }

  public async run() {
    const baseKey = this.getBaseKey();

    const entities = this.dataObjects.map(data => {
      let setAncestors = baseKey;
      let id = null;
      const entityKey = data[Core.Instance.dsModule.KEY];

      if (this.hasIdProperty && data[this.idProperty] != null) {
        switch (this.idType) {
          case "string": {
            if (typeof data[this.idProperty] === "string") {
              if (data[this.idProperty].length === 0) {
                throw new Error(ErrorMessages.OPERATION_STRING_ID_EMPTY(this.model, "SAVE"));
              }

              id = data[this.idProperty];
            }
            break;
          }
          case "int": {
            if (isNumber(data[this.idProperty])) {
              id = Core.Instance.dsModule.int(data[this.idProperty]);
            }
            break;
          }
        }

        if (id == null) {
          throw new Error(
            ErrorMessages.OPERATION_DATA_ID_TYPE_ERROR(this.model, "SAVE", data[this.idProperty])
          );
        }
      } else {
        if (
          entityKey &&
          entityKey.path &&
          entityKey.path.length > 0 &&
          entityKey.path.length % 2 === 0
        ) {
          if (entityKey.hasOwnProperty("id")) {
            id = Core.Instance.dsModule.int(entityKey.id);
          } else {
            id = entityKey.name;
          }
        } else {
          if (this.hasIdProperty && (this.idType === "string" || !this.generate)) {
            throw new Error(ErrorMessages.OPERATION_MISSING_ID_ERROR(this.model, "SAVE"));
          }
        }
      }

      if (!this.ignoreAnc && entityKey && entityKey.parent) {
        if (setAncestors.length === 0) {
          setAncestors = entityKey.parent.path;
        } else {
          const prevAncestors = entityKey.parent.path.toString();
          const nextAncestors = setAncestors.toString();

          if (prevAncestors !== nextAncestors) {
            console.warn(
              ErrorMessages.OPERATION_CHANGED_ANCESTORS_WARNING(
                this.model,
                "SAVE",
                prevAncestors,
                nextAncestors
              )
            );
          }
        }
      }

      const key = id
        ? this.createFullKey(setAncestors.concat([this.kind, id]))
        : this.createFullKey(setAncestors.concat([this.kind]));

      const { dataObject, excludeFromIndexes } = buildDataFromSchema(data, this.schema, this.kind);

      return {
        key,
        excludeFromIndexes,
        generated: id == null,
        data: dataObject,
      };
    });

    if (this.transaction) {
      if (this.transAllocateIds) {
        const { newEntities, ids } = await replaceIncompleteWithAllocatedIds(
          entities,
          this.transaction
        );
        this.transaction.save(newEntities);

        return {
          generatedIds: ids,
        };
      }

      this.transaction.save(entities);

      return {
        get generatedIds() {
          console.warn(ErrorMessages.ACCESS_TRANSACTION_GENERATED_IDS_ERROR);
          return null;
        },
      };
    }

    return Core.Instance.ds.save(entities).then(data => {
      return extractSavedIds(data)[0];
    });
  }
}

export class DatastoreDelete extends DatastoreOperation {
  private dataObjects: any[];
  private deleteIds: Array<string | number> = [];
  private useIds = false;
  private ignoreAnc = false;

  constructor(model: PebblebedModel, data?: object | object[]) {
    super(model);

    if (data) {
      if (Array.isArray(data)) {
        this.dataObjects = data;
      } else {
        this.dataObjects = [data];
      }
    } else {
      this.useIds = true;
    }
  }

  public id(id: string | number) {
    this.deleteIds = [id];
    return this;
  }

  public ids(ids: Array<string | number>) {
    this.deleteIds = ids;
    return this;
  }

  public ignoreDetectedAncestors() {
    this.ignoreAnc = true;
    return this;
  }

  public run() {
    const baseKey = this.getBaseKey();
    let deleteKeys = [];

    if (!this.useIds) {
      for (const data of this.dataObjects) {
        let setAncestors = baseKey;
        let id = null;
        const entityKey = data[Core.Instance.dsModule.KEY];

        if (this.hasIdProperty && data[this.idProperty] != null) {
          switch (this.idType) {
            case "int":
              if (isNumber(data[this.idProperty])) {
                id = Core.Instance.dsModule.int(data[this.idProperty]);
              }
              break;
            case "string":
              if (typeof data[this.idProperty] === "string") {
                if (data[this.idProperty].length === 0) {
                  throw new Error(ErrorMessages.OPERATION_STRING_ID_EMPTY(this.model, "DELETE"));
                }

                id = data[this.idProperty];
              }
              break;
          }

          if (id == null) {
            throw new Error(
              ErrorMessages.OPERATION_DATA_ID_TYPE_ERROR(
                this.model,
                "DELETE",
                data[this.idProperty]
              )
            );
          }
        } else if (entityKey != null) {
          if (entityKey.hasOwnProperty("id")) {
            id = Core.Instance.dsModule.int(entityKey.id);
          } else {
            id = entityKey.name;
          }
        } else {
          throw new Error(ErrorMessages.DELETE_NO_DATA_IDS_ERROR);
        }

        if (entityKey && entityKey.parent && !this.ignoreAnc) {
          if (setAncestors.length === 0) {
            setAncestors = entityKey.parent.path;
          } else {
            const prevAncestors = entityKey.parent.path.toString();
            const nextAncestors = setAncestors.toString();

            if (prevAncestors !== nextAncestors) {
              console.warn(
                ErrorMessages.OPERATION_CHANGED_ANCESTORS_WARNING(
                  this.model,
                  "DELETE",
                  prevAncestors,
                  nextAncestors
                )
              );
            }
          }
        }

        deleteKeys.push(this.createFullKey(setAncestors.concat([this.kind, id])));
      }
    } else {
      deleteKeys = this.deleteIds.map(id => {
        return this.createFullKey(baseKey.concat([this.kind, id]));
      });
    }

    if (this.transaction) {
      return this.transaction.delete(deleteKeys);
    }

    return Core.Instance.ds.delete(deleteKeys);
  }
}

function get(obj, path, defaultValue) {
  let cur = obj;

  for (let i = 0; i < path.length; i += 1) {
    if (cur == null) {
      return defaultValue;
    }

    if (typeof path[i] === "number") {
      if (Array.isArray(cur) && cur.length > path[i]) {
        cur = cur[path[i]];
      } else {
        return defaultValue;
      }
    } else if (typeof path[i] === "string") {
      if (cur.hasOwnProperty(path[i])) {
        cur = cur[path[i]];
      } else {
        return defaultValue;
      }
    } else {
      return defaultValue;
    }
  }

  return cur;
}

function set(obj, path, value) {
  if (path.length === 1) {
    obj[path[0]] = value;
    return obj;
  }

  if (obj[path[0]] == null) {
    obj[path[0]] = {};
  }

  obj[path[0]] = set(obj[path[0]], path.slice(1), value);
  return obj;
}

function isNumber(value) {
  return Number.isInteger(value) || /^\d+$/.test(value);
}

async function replaceIncompleteWithAllocatedIds(entities, transaction = null) {
  let allocateAmount = 0;
  let incompleteKey = null;

  for (const entity of entities) {
    if (entity.generated) {
      allocateAmount += 1;

      if (incompleteKey == null) {
        incompleteKey = entity.key;
      }
    }
  }

  let allocatedKeys;

  if (transaction) {
    allocatedKeys = await transaction.allocateIds(incompleteKey, allocateAmount);
  } else {
    allocatedKeys = await Core.Instance.ds.allocateIds(incompleteKey, allocateAmount);
  }

  let ids = [];

  for (let i = 0; i < entities.length; i += 1) {
    if (entities[i].generated) {
      entities[i].key = allocatedKeys[0].shift();
      ids.push(entities[i].key.id);
    } else {
      ids.push(null);
    }
  }

  return { ids, newEntities: entities };
}

function extractSavedIds(data) {
  const results = get(data, [0, "mutationResults"], null);

  const ids = [];

  if (results) {
    for (const result of results) {
      const paths = get(result, ["key", "path"], [null]);
      ids.push(get(paths, [paths.length - 1, "id"], null));
    }
  }

  data[0].generatedIds = ids;

  return data;
}

function augmentEntitiesWithIdProperties(
  respArray: any[],
  idProperty: string,
  type: string,
  kind: string
) {
  for (const entity of respArray) {
    if (entity[Object.getOwnPropertySymbols(entity)[0]].hasOwnProperty("id")) {
      if (type === "int") {
        entity[idProperty] = entity[Core.Instance.dsModule.KEY].id;
      } else {
        console.warn(
          ErrorMessages.LOAD_QUERY_DATA_ID_TYPE_ERROR(
            kind,
            "int",
            "string",
            idProperty,
            entity[Core.Instance.dsModule.KEY].id
          )
        );
      }
    }

    if (entity[Core.Instance.dsModule.KEY].hasOwnProperty("name")) {
      if (type === "string") {
        entity[idProperty] = entity[Core.Instance.dsModule.KEY].name;
      } else {
        console.warn(
          ErrorMessages.LOAD_QUERY_DATA_ID_TYPE_ERROR(
            kind,
            "string",
            "int",
            idProperty,
            entity[Core.Instance.dsModule.KEY].name
          )
        );
      }
    }
  }
}

function getIdPropertyFromSchema(schema: SchemaDefinition<any>) {
  for (const property in schema) {
    if (schema.hasOwnProperty(property)) {
      if (schema[property].role != null && schema[property].role === "id") {
        return property;
      }
    }
  }

  return null;
}

function convertToType(value: any, type: string) {
  switch (type) {
    case "string": {
      return value.toString();
    }
    case "int": {
      return Core.Instance.dsModule.int(value);
    }
    case "double": {
      return Core.Instance.dsModule.double(value);
    }
    case "datetime": {
      if (Object.prototype.toString.call(value) === "[object Date]") {
        return value;
      } else {
        return new Date(value);
      }
    }
    case "geoPoint": {
      if (value && value.value != null) {
        // This is the structure of the GeoPoint object
        return Core.Instance.dsModule.geoPoint(value.value);
      }

      return Core.Instance.dsModule.geoPoint(value);
    }
    case "array":
    case "boolean":
    case "object": {
      return value;
    }
    default: {
      return value;
    }
  }
}

const schemaOptionProps = {
  __excludeFromIndexes: true,
};

function buildDataFromSchema(
  data: any,
  schema: SchemaDefinition<any>,
  entityKind?: string
): { excludeFromIndexes: string[]; dataObject: object } {
  let excludeFromIndexesArray: string[] = [];
  const dataObject = {};

  for (const property in schema) {
    if (schema.hasOwnProperty(property) && !schemaOptionProps[property]) {
      const schemaProp: SchemaPropertyDefinition = schema[property];

      if (schemaProp.role !== "id") {
        const exclude =
          typeof schemaProp.excludeFromIndexes === "boolean"
            ? schemaProp.excludeFromIndexes
            : false;

        if (exclude && schemaProp.type !== "array") {
          excludeFromIndexesArray.push(property);
        }

        let value = data[property];

        if (schemaProp.onSave && typeof schemaProp.onSave === "function") {
          value = schemaProp.onSave(value);
        }

        if (!(value == null) || (data.hasOwnProperty(property) && !(data[property] == null))) {
          dataObject[property] = convertToType(value, schemaProp.type);
        } else if (schemaProp.required) {
          throw new Error(ErrorMessages.SCHEMA_REQUIRED_TYPE_MISSING(property, entityKind));
        } else if (!schemaProp.optional) {
          dataObject[property] = schemaProp.default ? schemaProp.default : null;
        }
      }
    }
  }

  if (schema.__excludeFromIndexes != null) {
    excludeFromIndexesArray = schema.__excludeFromIndexes;
  }

  return {
    excludeFromIndexes: excludeFromIndexesArray,
    dataObject,
  };
}
