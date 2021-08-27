import {
  DatastoreQueryRegular,
  IPebblebedModelOptions,
  SchemaDefinition,
} from "./types/PebblebedTypes";
import checkDatastore from "./utility/checkDatastore";
import getIdPropertyFromSchema from "./utility/getIdPropertyFromSchema";
import Core, { UNSET_NAMESPACE } from "./Core";
import DatastoreSave from "./operations/DatastoreSave";
import DatastoreLoad, { IDatastoreLoadRegular } from "./operations/DatastoreLoad";
import DatastoreDelete from "./operations/DatastoreDelete";
import extractAncestorPaths from "./utility/extractAncestorPaths";
import { CreateMessage, throwError } from "./Messaging";
import { PebblebedJoiSchema } from "./validation/PebblebedValidation";
import { createDatastoreQuery } from "./operations/DatastoreQuery";
import * as Joi from "@hapi/joi";
import DatastoreFlush from "./operations/DatastoreFlush";
import { Key } from "@google-cloud/datastore";

export default class PebblebedModel<T = any> {
  private schema: SchemaDefinition<T>;
  private joiSchema: PebblebedJoiSchema<T>;
  private kind: string;
  private idProperty: string | null;
  private idType: "string" | "int";
  private hasIdProperty = false;

  private defaultCachingSeconds: number | null = null;
  private neverCache = false;
  private defaultNamespace: string = UNSET_NAMESPACE;

  constructor(
    entityKind: string,
    entitySchema: SchemaDefinition<T> | PebblebedJoiSchema<T>,
    {
      defaultCachingSeconds = null,
      neverCache = false,
      defaultNamespace = UNSET_NAMESPACE,
    }: IPebblebedModelOptions = {}
  ) {
    if ((entitySchema as PebblebedJoiSchema<T>).__isPebblebedJoiSchema) {
      this.schema = (entitySchema as PebblebedJoiSchema<T>).__generateBasicSchema();
      this.joiSchema = entitySchema as PebblebedJoiSchema<T>;
    } else {
      this.schema = entitySchema as SchemaDefinition<T>;
    }

    this.kind = entityKind;
    this.idProperty = getIdPropertyFromSchema(this.schema);

    this.defaultCachingSeconds = defaultCachingSeconds;
    this.defaultNamespace = defaultNamespace;
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

  public validate = (
    data: object | object[]
  ): {
    positive: boolean;
    message: string;
  } => {
    /*const validation = Core.Joi.validate(data, this.joiSchema.__getJoiSchema(), {
      abortEarly: false,
    });*/
    const validation = this.joiSchema.__getJoiSchema().validate(data, {abortEarly: false});

    if (validation.error != null) {
      return {
        positive: false,
        message: `[Validation] ${this.entityKind} - ${validation.error.message}`,
      };
    }

    return {
      positive: true,
      message: `[Validation] ${this.entityKind} - Entity data is valid`,
    };
  };

  public save(data: T | T[]): DatastoreSave<T> {
    checkDatastore("SAVE");
    return new DatastoreSave<T>(this, data);
  }

  public load(
    idsOrKeys: string | number | Key | Array<string | number | Key>
  ): IDatastoreLoadRegular<T> {
    checkDatastore("LOAD");
    return new DatastoreLoad<T>(this, idsOrKeys);
  }

  public query(namespace: string | null = UNSET_NAMESPACE): DatastoreQueryRegular<T> {
    checkDatastore("QUERY");
    let ns = namespace !== UNSET_NAMESPACE ? namespace : this.defaultNamespace;

    return createDatastoreQuery(this, ns);
  }

  public key(id: string | number): Key {
    checkDatastore("CREATE KEY");
    return Core.Instance.dsModule.key([this.kind, id]);
  }

  public delete(data?: T | T[]): DatastoreDelete<T> {
    checkDatastore("DELETE");
    return new DatastoreDelete(this, data);
  }

  public flush(
    idsOrKeys: string | number | Key | Array<string | number | Key>
  ): DatastoreFlush<T> {
    checkDatastore("FLUSH IN CACHE");
    return new DatastoreFlush(this, idsOrKeys);
  }

  public async allocateIds({
                             amount,
                             withAncestors = null,
                             namespace = UNSET_NAMESPACE,
                           }: {
    amount: number;
    withAncestors?: any[] | null;
    namespace?: string | null;
  }): Promise<Array<Key>> {
    checkDatastore("ALLOCATE IDS");

    let ns: string | null = namespace !== UNSET_NAMESPACE ? namespace : this.defaultNamespace;
    ns = ns !== UNSET_NAMESPACE ? ns : (Core.Instance.namespace !== UNSET_NAMESPACE ? Core.Instance.namespace : null);

    let keyPath: any[] = [this.kind];

    if (withAncestors != null) {
      keyPath = ([] as any[]).concat(...extractAncestorPaths(this, ...withAncestors), keyPath);
    }

    if (ns != null) {
      const allocateIds = await Core.Instance.dsModule.allocateIds(Core.Instance.dsModule.key({
        namespace: ns,
        path: keyPath
      }), amount);

      return allocateIds[0];
    }

    const allocateIds = await Core.Instance.dsModule.allocateIds(Core.Instance.dsModule.key(keyPath), amount);
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

  public get entityPebbleSchema() {
    return this.joiSchema;
  }

  public get entityDefaultNamespace() {
    return this.defaultNamespace;
  }

  public get modelOptions(): IPebblebedModelOptions {
    return {
      defaultCachingSeconds: this.defaultCachingSeconds,
      neverCache: this.neverCache,
    };
  }
}
