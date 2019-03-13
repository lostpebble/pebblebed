"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const PebblebedModel_1 = require("./PebblebedModel");
const BasicUtils_1 = require("./utility/BasicUtils");
const Core_1 = require("./Core");
const Messaging_1 = require("./Messaging");
const PebblebedValidation_1 = require("./validation/PebblebedValidation");
exports.Pebblebed = {
    connectDatastore: (datastore) => {
        Core_1.default.Instance.setDatastore(datastore);
        console.log("Connecting Pebbledbed to Datastore");
    },
    get ds() {
        return Core_1.default.Instance.dsModule;
    },
    /*get dsLibrary() {
      return Core.Instance.dsModule;
    },*/
    flushCacheKeys(keys) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Core_1.default.Instance.cacheStore) {
                yield Core_1.default.Instance.cacheStore.flushEntitiesByKeys(keys);
            }
            else {
                Messaging_1.warn(`Tried to flush keys in cache but there is no cache store connected.`);
            }
        });
    },
    transaction: () => {
        return Core_1.default.Instance.dsModule.transaction();
    },
    combineSchemas: (...schemas) => {
        const combinedSchemas = schemas.reduce((accum, current) => Object.assign(accum, current.__getBasicSchemaObject()), {});
        return new PebblebedValidation_1.PebblebedJoiSchema(combinedSchemas);
    },
    createSchema: (schema) => {
        return new PebblebedValidation_1.PebblebedJoiSchema(schema);
    },
    createModel: (entityKind, entitySchema, options = {}) => {
        return new PebblebedModel_1.default(entityKind, entitySchema, options);
    },
    setCacheStore: (cacheStore) => {
        Core_1.default.Instance.setCacheStore(cacheStore);
    },
    clearDefaultNamespace: () => {
        Core_1.default.Instance.setNamespace(Core_1.UNSET_NAMESPACE);
    },
    setDefaultNamespace: (namespace) => {
        Core_1.default.Instance.setNamespace(namespace);
        /*if (namespace != null) {
          if (typeof namespace === "string") {
            if (namespace.length > 0) {
              Core.Instance.setNamespace(namespace);
            } else {
              Core.Instance.setNamespace(null);
            }
          } else {
            throwError(CreateMessage.SET_NAMESPACE_INCORRECT);
          }
        } else {
          Core.Instance.setNamespace(null);
        }*/
    },
    enableValidations(on = true) {
        Core_1.default.Instance.enableValidations(on);
    },
    enableCaching(on = true) {
        Core_1.default.Instance.enableCaching(on);
    },
    setDefaultCachingSeconds: (seconds) => {
        Core_1.default.Instance.defaultCachingSeconds = seconds;
    },
    setCacheEnabledOnSaveDefault(on) {
        Core_1.default.Instance.cacheDefaults.onSave = on;
    },
    setCacheEnabledOnLoadDefault(on) {
        Core_1.default.Instance.cacheDefaults.onLoad = on;
    },
    setCacheEnabledOnQueryDefault(on) {
        Core_1.default.Instance.cacheDefaults.onQuery = on;
    },
    setCacheEnabledDefaults(newDefaults) {
        Core_1.default.Instance.setCacheDefaults(newDefaults);
    },
    key(...args) {
        const keyPath = [];
        let currentIdType = "unknown";
        for (let i = 0; i < args.length; i += 1) {
            if (i % 2 === 0) {
                if (typeof args[i] !== "string") {
                    keyPath.push(args[i].entityKind);
                    currentIdType = args[i].entityIdType;
                }
                else {
                    keyPath.push(args[i]);
                }
            }
            else {
                if (currentIdType === "int") {
                    keyPath.push(Core_1.default.Instance.dsModule.int(args[i]));
                }
                else {
                    keyPath.push(args[i]);
                }
                currentIdType = "unknown";
            }
        }
        if (Core_1.default.Instance.namespace != null) {
            return Core_1.default.Instance.dsModule.key({
                path: keyPath,
                namespace: Core_1.default.Instance.namespace,
            });
        }
        return Core_1.default.Instance.dsModule.key(keyPath);
    },
    keysFromObjectArray(sourceArray, ...args) {
        if (args.length % 2 !== 0) {
            Messaging_1.throwError(Messaging_1.CreateMessage.INCORRECT_ARGUMENTS_KEYS_FROM_ARRAY);
        }
        return sourceArray.map(source => {
            const keyPath = [];
            for (let i = 0; i < args.length; i += 2) {
                keyPath.push(args[i], source[args[i + 1]]);
            }
            return exports.Pebblebed.key(...keyPath);
        });
    },
    uniqueKeysFromObjectArray(sourceArray, ...args) {
        if (args.length % 2 !== 0) {
            Messaging_1.throwError(Messaging_1.CreateMessage.INCORRECT_ARGUMENTS_KEYS_FROM_ARRAY);
        }
        const obj = {};
        const keys = [];
        for (const source of sourceArray) {
            const keyPath = [];
            const kindKeyPath = [];
            for (let i = 0; i < args.length; i += 2) {
                keyPath.push(args[i], source[args[i + 1]]);
                kindKeyPath.push(args[i].entityKind, source[args[i + 1]]);
            }
            if (BasicUtils_1.get(obj, kindKeyPath, false) === false) {
                keys.push(exports.Pebblebed.key(...keyPath));
                BasicUtils_1.set(obj, kindKeyPath, true);
            }
        }
        return keys;
    },
};
//# sourceMappingURL=Pebblebed.js.map