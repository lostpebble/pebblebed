import { DatastoreEntityKey, DatastoreQuery, DatastoreQueryResponse, SchemaDefinition } from "./types/PebblebedTypes";
import checkDatastore from "./utility/checkDatastore";
import getIdPropertyFromSchema from "./utility/getIdPropertyFromSchema";
import Core from "./Core";
import ErrorMessages from "./ErrorMessages";
import DatastoreSave from "./operations/DatastoreSave";
import DatastoreLoad from "./operations/DatastoreLoad";
import DatastoreDelete from "./operations/DatastoreDelete";
import extractAncestorPaths from "./utility/extractAncestorPaths";
import augmentEntitiesWithIdProperties from "./utility/augmentEntitiesWithIdProperties";

export default class PebblebedModel {
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
