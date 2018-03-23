import {
  DatastoreEntityKey,
  DatastoreQuery,
  DatastoreQueryResponse, InternalDatastoreQuery, IPebblebedModelOptions,
  SchemaDefinition, TFilterComparator, TFilterFunction,
} from "./types/PebblebedTypes";
import checkDatastore from "./utility/checkDatastore";
import getIdPropertyFromSchema from "./utility/getIdPropertyFromSchema";
import Core from "./Core";
import DatastoreSave from "./operations/DatastoreSave";
import DatastoreLoad from "./operations/DatastoreLoad";
import DatastoreDelete from "./operations/DatastoreDelete";
import extractAncestorPaths from "./utility/extractAncestorPaths";
import augmentEntitiesWithIdProperties from "./utility/augmentEntitiesWithIdProperties";
import { CreateMessage, throwError } from "./Messaging";
import {PebblebedJoiSchema} from "./validation/PebblebedValidation";
import convertToType from "./utility/convertToType";
import { createDatastoreQuery } from "./operations/DatastoreQuery";
import * as Joi from "joi";
import { isNumber } from "./utility/BasicUtils";

const crypto = require("crypto");

export default class PebblebedModel<T = any> {
  private schema: SchemaDefinition<T>;
  private joiSchema: PebblebedJoiSchema<T> = null;
  private kind: string;
  private idProperty: string;
  private idType: string;
  private hasIdProperty = false;

  private defaultCachingSeconds = null;
  private neverCache = false;

  constructor(entityKind: string, entitySchema: SchemaDefinition<T> | PebblebedJoiSchema<T>, {
    defaultCachingSeconds = null,
    neverCache = false,
  }: IPebblebedModelOptions = {}) {
    if ((entitySchema as PebblebedJoiSchema<T>).__isPebblebedJoiSchema) {
      this.schema = (entitySchema as PebblebedJoiSchema<T>).__generateBasicSchema();
      this.joiSchema = (entitySchema as PebblebedJoiSchema<T>);
    } else {
      this.schema = (entitySchema as SchemaDefinition<T>);
    }

    this.kind = entityKind;
    this.idProperty = getIdPropertyFromSchema(this.schema);

    this.defaultCachingSeconds = defaultCachingSeconds;
    this.neverCache = neverCache;

    if (this.idProperty != null) {
      this.hasIdProperty = true;

      this.idType = this.schema[this.idProperty].type;

      if (this.idType !== "string" && this.idType !== "int") {
        throwError(CreateMessage.OPERATION_SCHEMA_ID_TYPE_ERROR(this, "CREATE MODEL"));
      }
    }
  }

  public getJoiSchema = (): Joi.Schema => {
    return this.joiSchema.__getJoiSchema();
  };

  public validate = (data: object | object[]): {
    positive: boolean;
    message: string;
  } => {
    const validation = Core.Joi.validate(data, this.joiSchema.__getJoiSchema(), {
      abortEarly: false,
    });

    if (validation.error !== null) {
      return {
        positive: false,
        message: `[Validation] ${this.entityKind} - ${validation.error}`,
      };
    }

    return {
      positive: true,
      message: `[Validation] ${this.entityKind} - Entity data is valid`,
    };
  };

  public save(data: object | object[]) {
    checkDatastore("SAVE");

    return new DatastoreSave(this, data);
  }

  public load(idsOrKeys: string | number | DatastoreEntityKey | Array<string | number | DatastoreEntityKey>) {
    checkDatastore("LOAD");

    return new DatastoreLoad(this, idsOrKeys);
  }

  public query(namespace: string = null): DatastoreQuery {
    checkDatastore("QUERY");
    return createDatastoreQuery(this, namespace);
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

  public async flushInCache(idsOrKeys: string | number | DatastoreEntityKey | Array<string | number | DatastoreEntityKey>) {
    let flushIds;
    let usingKeys = false;

    if (idsOrKeys != null) {
      if (Array.isArray(idsOrKeys)) {
        flushIds = idsOrKeys;
      } else {
        flushIds = [idsOrKeys];
      }

      if (typeof flushIds[0] === "object") {
        if ((flushIds[0] as DatastoreEntityKey).kind === this.kind) {
          usingKeys = true;
        } else {
          throwError(CreateMessage.OPERATION_KEYS_WRONG(this, "FLUSH IN CACHE"));
        }
      } else {
        flushIds = flushIds.map(id => {
          if (this.idType === "int" && isNumber(id)) {
            return Core.Instance.dsModule.int(id);
          } else if (this.idType === "string" && typeof id === "string") {
            if (id.length === 0) {
              throwError(CreateMessage.OPERATION_STRING_ID_EMPTY(this, "FLUSH IN CACHE"));
            }

            return id;
          }

          throwError(CreateMessage.OPERATION_DATA_ID_TYPE_ERROR(this, "FLUSH IN CACHE", id));
        });
      }
    }

    let flushKeys;

    if (usingKeys) {
      flushKeys = flushIds.map((key: DatastoreEntityKey) => {
        if (this.namespace != null) {
          key.namespace = this.namespace;
        } else if (Core.Instance.namespace != null) {
          key.namespace = Core.Instance.namespace;
        }

        return key;
      });
    } else {
      const baseKey = this.getBaseKey();

      flushKeys = this.loadIds.map(id => {
        return this.createFullKey(baseKey.concat(this.kind, id));
      });
    }
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

  public get entityPebbleSchema() {
    return this.joiSchema;
  }

  public get modelOptions(): IPebblebedModelOptions {
    return {
      defaultCachingSeconds: this.defaultCachingSeconds,
      neverCache: this.neverCache,
    };
  }
}
