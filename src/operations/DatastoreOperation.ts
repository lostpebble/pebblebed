import PebblebedModel from "../PebblebedModel";
import extractAncestorPaths from "../utility/extractAncestorPaths";
import Core, { UNSET_NAMESPACE } from "../Core";
import { DatastoreEntityKey, IPebblebedModelOptions, SchemaDefinition } from "../";

export class DatastoreBaseOperation<T> {
  protected model: PebblebedModel;
  protected modelOptions: IPebblebedModelOptions;
  protected kind: string;
  protected schema: SchemaDefinition<any>;
  protected idProperty: string|null;
  protected idType: "string" | "int";
  protected hasIdProperty = false;
  protected defaultNamespace: string|null = UNSET_NAMESPACE;
  protected deliberateNamespace: string|null = UNSET_NAMESPACE;
  protected ancestors: Array<[string, string | number]> = [];

  constructor(model: PebblebedModel<T>) {
    this.model = model;
    this.modelOptions = model.modelOptions;
    this.kind = model.entityKind;
    this.schema = model.entitySchema;
    this.idProperty = model.entityIdProperty;
    this.idType = model.entityIdType;
    this.hasIdProperty = model.entityHasIdProperty;
    this.defaultNamespace = model.entityDefaultNamespace;
  }

  public withAncestors(...args: any[]) {
    this.ancestors = extractAncestorPaths(this.model, ...args);
    return this;
  }

  public useNamespace(namespace: string|null) {
    this.deliberateNamespace = namespace;
    return this;
  }

  protected getFinalNamespace(keyOriginalNamespace: string|undefined = undefined): string|undefined {
    if (this.deliberateNamespace !== UNSET_NAMESPACE) {
      return this.deliberateNamespace || undefined;
    }

    if (this.defaultNamespace !== UNSET_NAMESPACE) {
      return this.defaultNamespace || undefined;
    }

    if (Core.Instance.namespace !== UNSET_NAMESPACE) {
      return Core.Instance.namespace || undefined;
    }

    return keyOriginalNamespace;
  }

  protected augmentKey = (key: DatastoreEntityKey): DatastoreEntityKey => {
    key.namespace = this.getFinalNamespace(key.namespace);
    return key;
  };

  protected createFullKey(fullPath: any[], entityKey?: DatastoreEntityKey): DatastoreEntityKey {
    let originalKeyNamespace: string|undefined = entityKey ? entityKey.namespace : undefined;

    const newNamespace = this.getFinalNamespace(originalKeyNamespace);

    if (newNamespace !== undefined) {
      return Core.Instance.ds.key({
        namespace: newNamespace,
        path: fullPath,
      });
    }

    return Core.Instance.ds.key(fullPath);
  }

  protected getBaseKey() {
    const baseKey: any[] = [];

    for (const ancestor of this.ancestors) {
      baseKey.push(ancestor[0], ancestor[1]);
    }

    return baseKey;
  }
}

export default class DatastoreOperation<T> extends DatastoreBaseOperation<T> {
  protected transaction: any = null;
  protected runValidation: boolean = true;
  protected useCache: boolean = true;
  protected cachingTimeSeconds: number = 60 * 5;

  constructor(model: PebblebedModel<T>) {
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
