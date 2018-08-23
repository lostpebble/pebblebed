"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Messaging_1 = require("./Messaging");
class Core {
    constructor() {
        this.namespace = null;
        this.isProductionEnv = process.env.NODE_ENV === "production";
        this.defaultCachingSeconds = 60 * 5;
        this.validations = true;
        this.caching = true;
        this.cacheStore = null;
        this.cacheDefaults = {
            onSave: true,
            onLoad: false,
            onQuery: false,
        };
        try {
            this.dsModule = require("@google-cloud/datastore");
        }
        catch (e) {
            if (e.code === "MODULE_NOT_FOUND") {
                console.error(e);
                Messaging_1.throwError(Messaging_1.CreateMessage.NO_GOOGLE_CLOUD_DEPENDENCY);
            }
            else {
                throw e;
            }
        }
    }
    static get Instance() {
        return this._instance || (this._instance = new this());
    }
    static get Joi() {
        try {
            return require("joi");
        }
        catch (e) {
            if (e.code === "MODULE_NOT_FOUND") {
                Messaging_1.throwError(`Pebblebed: Using new schema syntax, Joi needs to be added as a dependency to your project.`);
            }
            throw e;
        }
    }
    setDatastore(datastore) {
        this.ds = datastore;
    }
    setCacheStore(cacheStore) {
        this.cacheStore = cacheStore;
    }
    setCacheDefaults(newDefaults) {
        Object.assign(this.cacheDefaults, newDefaults);
    }
    setNamespace(namespace) {
        this.namespace = namespace;
    }
    enableValidations(on = true) {
        this.validations = on;
    }
    enableCaching(on = true) {
        this.caching = on;
    }
}
Core._redisClient = null;
exports.default = Core;
//# sourceMappingURL=Core.js.map