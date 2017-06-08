import { ErrorMessages } from "./ErrorMessages";

export interface SchemaDefinition {
  [property: string]: SchemaPropertyDefinition;
}

export interface SchemaPropertyDefinition {
  type:
    | "string"
    | "int"
    | "double"
    | "boolean"
    | "datetime"
    | "array"
    | "object"
    | "geoPoint";
  required?: boolean;
  role?: "id";
  excludeFromIndexes?: boolean;
  optional?: boolean;
  onSave?: (value: any) => any;
  default?: any;
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
  filter(
    property: string,
    comparator: "=" | "<" | ">" | "<=" | ">=",
    value: string | number | boolean | Date
  ): DatastoreQuery;
  order(property: string, options?: { descending: boolean }): DatastoreQuery;
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
}

export const Pebblebed = {
  connectDatastore: (datastore: any) => {
    Core.Instance.setDatastore(datastore);
  },
};

function checkDatastore(operation: string) {
  if (Core.Instance.ds == null) {
    throw new Error();
  }
}

export class PebblebedModel {
  private schema: SchemaDefinition;
  private kind: string;
  private idProperty: string;
  private idType: string;
  private hasIdProperty = false;

  constructor(entityKind: string, entitySchema: SchemaDefinition) {
    this.schema = entitySchema;
    this.kind = entityKind;
    this.idProperty = getIdPropertyFromSchema(entitySchema);

    if (this.idProperty != null) {
      this.hasIdProperty = true;

      this.idType = this.schema[this.idProperty].type;

      if (this.idType !== "string" && this.idType !== "int") {
        throw new Error(
            ErrorMessages.OPERATION_SCHEMA_ID_TYPE_ERROR(this, "CREATE MODEL")
        );
      }
    }
  }

  public save(data: object | object[]) {
    checkDatastore("SAVE");

    return new DatastoreSave(this, data);
  }

  public load(ids: string | number | Array<(string | number)>) {
    checkDatastore("LOAD");

    return new DatastoreLoad(this, ids);
  }

  public query(namespace: string = null): DatastoreQuery {
    checkDatastore("QUERY");

    const idProp = this.idProperty;
    const kind = this.kind;
    const hasIdProp = this.hasIdProperty;
    const type = hasIdProp ? this.schema[this.idProperty].type : null;

    const dsQuery = namespace != null ?
        Core.Instance.ds.createQuery(namespace, this.kind) :
        Core.Instance.ds.createQuery(this.kind);

    const runQuery = dsQuery.run.bind(dsQuery);

    return Object.assign(dsQuery, {
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

export class DatastoreOperation {
  protected model: PebblebedModel;
  protected kind: string;
  protected schema: SchemaDefinition;
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
    this.ancestors = [];

    for (let i = 0; i < args.length; i += 2) {
      if (typeof args[i] === "string") {
        this.ancestors.push([args[i], args[i + 1]]);
      } else if (typeof args[i].entityKind === "string") {
        this.ancestors.push([args[i].entityKind, args[i + 1]]);
      } else {
        throw new Error(ErrorMessages.INCORRECT_ANCESTOR_KIND(this.model))
      }
    }
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
  private loadIds: Array<(string | number)> = [];

  constructor(
    model: PebblebedModel,
    ids: string | number | Array<(string | number)>
  ) {
    super(model);

    if (ids != null) {
      if (Array.isArray(ids)) {
        this.loadIds = ids;
      } else {
        this.loadIds = [ids];
      }
    }
  }

  public async run() {
    const baseKey = this.getBaseKey();

    const loadKeys = this.loadIds.map(id => {
      return this.createFullKey(baseKey.concat(this.kind, id));
    });

    let resp;

    if (this.transaction) {
      resp = await this.transaction.get(loadKeys);
    } else {
      resp = await Core.Instance.ds.get(loadKeys);
    }

    if (this.hasIdProperty && resp[0].length > 0) {
      augmentEntitiesWithIdProperties(
        resp[0],
        this.idProperty,
        this.idType,
        this.kind
      );
    }

    return resp[0];
  }
}

export class DatastoreSave extends DatastoreOperation {
  private dataObjects: any[];
  private ignoreAnc = false;
  private generate = false;

  constructor(model: PebblebedModel, data: object | object[]) {
    super(model);

    if (Array.isArray(data)) {
      this.dataObjects = data;
    } else {
      this.dataObjects = [data];
    }
  }

  public generateUnsetId() {
    this.generate = true;
    return this;
  }

  public ignoreDetectedAncestors() {
    this.ignoreAnc = true;
    return this;
  }

  public run() {
    const baseKey = this.getBaseKey();

    const entities = this.dataObjects.map(data => {
      let setAncestors = baseKey;
      let id = null;
      const entityKey = data[Core.Instance.dsModule.KEY];

      if (this.hasIdProperty && data[this.idProperty] != null) {
        switch (this.idType) {
          case "string": {
            if (typeof data[this.idProperty] === "string") {
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
            ErrorMessages.OPERATION_DATA_ID_TYPE_ERROR(
              this.model,
              "SAVE",
              data[this.idProperty]
            )
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
          if (
            this.hasIdProperty &&
            (this.idType === "string" || !this.generate)
          ) {
            throw new Error(
              ErrorMessages.OPERATION_MISSING_ID_ERROR(this.model, "SAVE")
            );
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

      return {
        key,
        data: dataArrayFromSchema(data, this.schema, this.kind),
      };
    });

    if (this.transaction) {
      return this.transaction.save(entities);
    }

    return Core.Instance.ds.save(entities);
  }
}

export class DatastoreDelete extends DatastoreOperation {
  private dataObjects: any[];
  private deleteIds: Array<(string | number)> = [];
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

  public ids(ids: Array<(string | number)>) {
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

        deleteKeys.push(
          this.createFullKey(setAncestors.concat([this.kind, id]))
        );
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

function isNumber(value) {
  return Number.isInteger(value) || /^\d+$/.test(value);
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

function getIdPropertyFromSchema(schema: SchemaDefinition) {
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

function dataArrayFromSchema(
  data: any,
  schema: SchemaDefinition,
  entityKind?: string
) {
  const dataArray = [];

  for (const property in schema) {
    if (schema.hasOwnProperty(property)) {
      const schemaProp: SchemaPropertyDefinition = schema[property];

      if (schemaProp.role !== "id") {
        const exclude = typeof schemaProp.excludeFromIndexes === "boolean"
          ? schemaProp.excludeFromIndexes
          : false;

        let value = data[property];

        if (schemaProp.onSave && typeof schemaProp.onSave === "function") {
          value = schemaProp.onSave(value);
        }

        if (
          !(value == null) ||
          (data.hasOwnProperty(property) && !(data[property] == null))
        ) {
          dataArray.push({
            name: property,
            value: convertToType(value, schemaProp.type),
            excludeFromIndexes: exclude,
          });
        } else if (schemaProp.required) {
          throw new Error(
            ErrorMessages.SCHEMA_REQUIRED_TYPE_MISSING(property, entityKind)
          );

          /*
          * `PEBBLEBED: SCHEMA ERROR: Property ${property} is required on datastore entity ${entityKind
           ? entityKind
           : ""}`
          * */
        } else {
          dataArray.push({
            name: property,
            value: schemaProp.default ? schemaProp.default : null,
            excludeFromIndexes: exclude,
          });
        }
      }
    }
  }

  return dataArray;
}
