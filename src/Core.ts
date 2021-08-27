import { CreateMessage, throwError } from "./Messaging";
import { PebblebedCacheStore } from "./caching/PebblebedCacheStore";
import * as Joi from "@hapi/joi";
import * as datastore from "@google-cloud/datastore";
import { Datastore } from "@google-cloud/datastore";

export interface ICacheDefaults {
  onSave: boolean;
  onLoad: boolean;
  onQuery: boolean;
}

export const UNSET_NAMESPACE = "__PEBBLEBED_DELIBERATE_UNSET_NAMESPACE__";

export default class Core {
  private static _instance: Core;
  private static _redisClient = null;

  public ds: typeof datastore;
  public dsModule: Datastore;
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
      // this.ds = require("@google-cloud/datastore");
      this.ds = datastore;
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
      // return require("@hapi/joi");
      return Joi;
    } catch (e) {
      if (e.code === "MODULE_NOT_FOUND") {
        throwError(
          `Pebblebed: Using new schema syntax, Joi (@hapi/joi) needs to be added as a dependency to your project.`
        );
      }

      throw e;
    }
  }

  public setDatastore(datastore: Datastore) {
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
