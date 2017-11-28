import { CreateMessage, throwError } from "./Messaging";

export default class Core {
  private static _instance: Core;

  public ds: any;
  public dsModule: any;
  public namespace: string = null;
  public isProductionEnv = process.env.NODE_ENV === "production";
  public validations = true;

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

  public setNamespace(namespace: string) {
    this.namespace = namespace;
  }

  public setValidations(on: boolean) {
    this.validations = on;
  }
}
