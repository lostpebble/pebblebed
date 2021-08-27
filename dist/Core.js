"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UNSET_NAMESPACE = void 0;
const Messaging_1 = require("./Messaging");
const Joi = require("@hapi/joi");
const datastore = require("@google-cloud/datastore");
exports.UNSET_NAMESPACE = "__PEBBLEBED_DELIBERATE_UNSET_NAMESPACE__";
class Core {
    constructor() {
        this.namespace = exports.UNSET_NAMESPACE;
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
            // this.ds = require("@google-cloud/datastore");
            this.ds = datastore;
        }
        catch (e) {
            if (e.code === "MODULE_NOT_FOUND") {
                console.error(e);
                (0, Messaging_1.throwError)(Messaging_1.CreateMessage.NO_GOOGLE_CLOUD_DEPENDENCY);
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
            // return require("@hapi/joi");
            return Joi;
        }
        catch (e) {
            if (e.code === "MODULE_NOT_FOUND") {
                (0, Messaging_1.throwError)(`Pebblebed: Using new schema syntax, Joi (@hapi/joi) needs to be added as a dependency to your project.`);
            }
            throw e;
        }
    }
    setDatastore(datastore) {
        this.dsModule = datastore;
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
exports.default = Core;
Core._redisClient = null;
//# sourceMappingURL=Core.js.map