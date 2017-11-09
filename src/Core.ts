import { CreateMessage, throwError } from "./Messaging";

export default class Core {
  private static _instance: Core;

  public ds: any;
  public dsModule: any;
  public namespace: string = null;
  public isProductionEnv = process.env.NODE_ENV === "production";

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

  public setDatastore(datastore) {
    this.ds = datastore;
  }

  public setNamespace(namespace: string) {
    this.namespace = namespace;
  }
}
