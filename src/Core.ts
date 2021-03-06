import { CreateMessage, throwError } from "./Messaging";
import { PebblebedCacheStore } from "./caching/PebblebedCacheStore";

export interface ICacheDefaults {
  onSave: boolean;
  onLoad: boolean;
  onQuery: boolean;
}

export const UNSET_NAMESPACE = "__PEBBLEBED_DELIBERATE_UNSET_NAMESPACE__";

export default class Core {
  private static _instance: Core;
  private static _redisClient = null;

  public ds: any;
  public dsModule: any;
  public namespace: string | null = UNSET_NAMESPACE;
  public isProductionEnv = process.env.NODE_ENV === "production";
  public defaultCachingSeconds = 60 * 5;
  public validations = true;
  public caching = true;
  public cacheStore: PebblebedCacheStore | null = null;

  public cacheDefaults: ICacheDefaults = {
    onSave: true,
    onLoad: false,
    onQuery: false,
  };

  private constructor() {
    try {
      this.ds = require("@google-cloud/datastore");
    } catch (e) {
      if (e.code === "MODULE_NOT_FOUND") {
        console.error(e);
        throwError(CreateMessage.NO_GOOGLE_CLOUD_DEPENDENCY);
      } else {
        throw e;
      }
    }
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public static get Joi(): typeof import("@hapi/joi") {
    try {
      return require("@hapi/joi");
    } catch (e) {
      if (e.code === "MODULE_NOT_FOUND") {
        throwError(
          `Pebblebed: Using new schema syntax, Joi (@hapi/joi) needs to be added as a dependency to your project.`
        );
      }

      throw e;
    }
  }

  public setDatastore(datastore) {
    this.dsModule = datastore;
  }

  public setCacheStore(cacheStore: PebblebedCacheStore) {
    this.cacheStore = cacheStore;
  }

  public setCacheDefaults(newDefaults: Partial<ICacheDefaults>) {
    Object.assign(this.cacheDefaults, newDefaults);
  }

  public setNamespace(namespace: string | null) {
    this.namespace = namespace;
  }

  public enableValidations(on: boolean = true) {
    this.validations = on;
  }

  public enableCaching(on: boolean = true) {
    this.caching = on;
  }
}
