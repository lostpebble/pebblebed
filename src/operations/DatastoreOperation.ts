import PebblebedModel from "../PebblebedModel";
import extractAncestorPaths from "../utility/extractAncestorPaths";
import Core from "../Core";
import { IPebblebedModelOptions, SchemaDefinition } from "../";

export class DatastoreBaseOperation {
  protected model: PebblebedModel;
  protected modelOptions: IPebblebedModelOptions;
  protected kind: string;
  protected schema: SchemaDefinition<any>;
  protected idProperty: string;
  protected idType: string;
  protected hasIdProperty = false;
  protected namespace = null;
  protected ancestors: Array<[string, string | number]> = [];

  constructor(model: PebblebedModel) {
    this.model = model;
    this.modelOptions = model.modelOptions;
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

export default class DatastoreOperation extends DatastoreBaseOperation {
  protected transaction: any = null;
  protected runValidation: boolean = true;
  protected useCache: boolean = true;
  protected cachingTimeSeconds: number = 60 * 5;

  constructor(model: PebblebedModel) {
    super(model);

    this.runValidation = Core.Instance.validations;

    this.useCache =
      this.modelOptions.neverCache
        ? false
        : Core.Instance.caching;

    this.cachingTimeSeconds =
      this.modelOptions.defaultCachingSeconds != null
        ? this.modelOptions.defaultCachingSeconds
        : Core.Instance.defaultCachingSeconds;
  }

  public enableValidations(on: boolean) {
    this.runValidation = on;
    return this;
  }

  public enableCaching(on: boolean) {
    this.useCache = on;
    return this;
  }

  public cachingSeconds(seconds: number) {
    this.cachingTimeSeconds = seconds;
    return this;
  }

  public useTransaction(transaction: any) {
    this.transaction = transaction;
    return this;
  }
}
