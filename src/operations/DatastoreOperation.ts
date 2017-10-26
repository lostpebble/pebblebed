import { SchemaDefinition } from "../types/PebblebedTypes";
import PebblebedModel from "../PebblebedModel";
import extractAncestorPaths from "../utility/extractAncestorPaths";
import Core from "../Core";

export default class DatastoreOperation {
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
