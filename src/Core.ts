import { CreateMessage, throwError } from "./Messaging";
import { PebblebedCacheStore } from "./caching/PebblebedCacheStore";

export default class Core {
  private static _instance: Core;
  private static _redisClient = null;

  public ds: any;
  public dsModule: any;
  public namespace: string = null;
  public isProductionEnv = process.env.NODE_ENV === "production";
  public defaultCachingSeconds = 60 * 5;
  public validations = true;
  public caching = true;
  public cacheStore: PebblebedCacheStore = null;

  public cacheEnabledOnSaveDefault = true;
  public cacheEnabledOnLoadDefault = true;
  public cacheEnabledOnQueryDefault = false;

  private constructor() {
    try {
      this.dsModule = require("@google-cloud/datastore");
    } catch (e) {
      if (e.code === "MODULE_NOT_FOUND") {
        throwError(CreateMessage.NO_GOOGLE_CLOUD_DEPENDENCY);
      }

      throw e;
    }
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public static get Joi() {
    try {
      return require("joi");
    } catch (e) {
      if (e.code === "MODULE_NOT_FOUND") {
        throwError(
          `Pebblebed: Using new schema syntax, Joi needs to be added as a dependency to your project.`
        );
      }

      throw e;
    }
  }

  public setDatastore(datastore) {
    this.ds = datastore;
  }

  public setCacheStore(cacheStore: PebblebedCacheStore) {
    this.cacheStore = cacheStore;
  }

  public setNamespace(namespace: string) {
    this.namespace = namespace;
  }

  public enableValidations(on: boolean = true) {
    this.validations = on;
  }

  public enableCaching(on: boolean = true) {
    this.caching = on;
  }
}
