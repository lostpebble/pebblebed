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
const extractAncestorPaths_1 = require("../utility/extractAncestorPaths");
const augmentEntitiesWithIdProperties_1 = require("../utility/augmentEntitiesWithIdProperties");
const convertToType_1 = require("../utility/convertToType");
const Core_1 = require("../Core");
const pickOutEntityFromResults_1 = require("../utility/pickOutEntityFromResults");
const Messaging_1 = require("../Messaging");
const deserializeJsonProperties_1 = require("../utility/deserializeJsonProperties");
const crypto = require("crypto");
function createDatastoreQuery(model, namespace) {
    const idProp = model.entityIdProperty;
    const kind = model.entityKind;
    const hasIdProp = model.entityHasIdProperty;
    const type = hasIdProp ? model.entitySchema[model.entityIdProperty].type : null;
    const schema = model.entitySchema;
    const ns = namespace !== Core_1.UNSET_NAMESPACE ? namespace : (Core_1.default.Instance.namespace !== Core_1.UNSET_NAMESPACE ? Core_1.default.Instance.namespace : null);
    const dsQuery = (ns != null && ns !== Core_1.UNSET_NAMESPACE)
        ? Core_1.default.Instance.dsModule.createQuery(ns, model.entityKind)
        : Core_1.default.Instance.dsModule.createQuery(model.entityKind);
    const runQuery = dsQuery.run.bind(dsQuery);
    const filterQuery = dsQuery.filter.bind(dsQuery);
    const useCache = (model.modelOptions.neverCache || !Core_1.default.Instance.caching)
        ? false
        : Core_1.default.Instance.cacheDefaults.onQuery;
    const returnOnlyEntity = null;
    const cachingTimeSeconds = model.modelOptions.defaultCachingSeconds != null
        ? model.modelOptions.defaultCachingSeconds
        : Core_1.default.Instance.defaultCachingSeconds;
    return Object.assign(dsQuery, {
        returnOnlyEntity,
        useCache,
        cachingTimeSeconds,
        enableCache(on) {
            this.useCache = on;
            return this;
        },
        cachingSeconds(seconds) {
            this.cachingTimeSeconds = seconds;
            return this;
        },
        first() {
            this.returnOnlyEntity = "FIRST";
            return this;
        },
        last() {
            this.returnOnlyEntity = "LAST";
            return this;
        },
        randomOne() {
            this.returnOnlyEntity = "RANDOM";
            return this;
        },
        filter(property, comparator, value) {
            if (!schema[property]) {
                Messaging_1.throwError(`Property "${property}" doesn't exist on entity schema for [ ${kind} ]`);
            }
            return filterQuery(property, comparator, convertToType_1.default(value, schema[property].type));
        },
        withAncestors(...args) {
            const ancestors = extractAncestorPaths_1.default(model, ...args);
            if (ns != null) {
                this.hasAncestor(Core_1.default.Instance.dsModule.key({
                    namespace: ns,
                    path: [].concat.apply([], ancestors),
                }));
            }
            else {
                this.hasAncestor(Core_1.default.Instance.dsModule.key([].concat.apply([], ancestors)));
            }
            return this;
        },
        flushQueryInCache() {
            return __awaiter(this, void 0, void 0, function* () {
                if (Core_1.default.Instance.cacheStore != null) {
                    const hash = createHashFromQuery(this);
                    yield Core_1.default.Instance.cacheStore.flushQueryResponse(hash, this);
                }
                else {
                    Messaging_1.warn(`Trying to flush a query - but no Cache Store has been set on Pebblebed instance!`);
                }
            });
        },
        run(throwIfNotFound = false) {
            return __awaiter(this, void 0, void 0, function* () {
                let hash = null;
                if (Core_1.default.Instance.cacheStore != null && Core_1.default.Instance.cacheStore.cacheOnQuery && this.useCache) {
                    hash = createHashFromQuery(this);
                    const queryResponse = yield Core_1.default.Instance.cacheStore.getQueryResponse(hash, this);
                    if (queryResponse != null) {
                        cachingAugmentQueryEntitiesWithRealKeys(queryResponse);
                        deserializeJsonProperties_1.default(queryResponse.entities, schema);
                        if (this.returnOnlyEntity != null) {
                            return pickOutEntityFromResults_1.default(queryResponse.entities, this.returnOnlyEntity);
                        }
                        return queryResponse;
                    }
                }
                const data = yield runQuery();
                if (hasIdProp && data[0].length > 0) {
                    augmentEntitiesWithIdProperties_1.default(data[0], idProp, type, kind);
                }
                const queryResponse = {
                    entities: data[0],
                    info: data[1],
                };
                if (Core_1.default.Instance.cacheStore != null &&
                    Core_1.default.Instance.cacheStore.cacheOnQuery &&
                    this.useCache &&
                    queryResponse.entities.length > 0) {
                    if (hash == null) {
                        hash = createHashFromQuery(this);
                    }
                    cachingAugmentQueryEntitiesWithSerializableKeys(queryResponse);
                    yield Core_1.default.Instance.cacheStore.setQueryResponse(queryResponse, hash, this.cachingTimeSeconds, this);
                    removeSerializableKeysFromEntities(queryResponse);
                }
                deserializeJsonProperties_1.default(queryResponse.entities, schema);
                if (queryResponse.entities.length === 0 && throwIfNotFound) {
                    console.error(`Couldn't find any ${model.entityKind} entity(s) with specified query:\n\n${createDataStringFromQuery(this)}`);
                    Messaging_1.throwError(`Couldn't find any ${model.entityKind} entity(s) with specified query, see server log for more detail`);
                }
                if (this.returnOnlyEntity != null) {
                    return pickOutEntityFromResults_1.default(queryResponse.entities, this.returnOnlyEntity);
                }
                return queryResponse;
            });
        },
    });
}
exports.createDatastoreQuery = createDatastoreQuery;
function createDataStringFromQuery(query) {
    return `namespace:${query.namespace != null ? query.namespace : ""}
kinds:${query.kinds.join("-KIND_JOIN-")}
filters:${JSON.stringify(query.filters)}
limit:${query.limitVal}
offset:${query.offsetVal}
orders:${query.orders.join("-ORDERS_JOIN-")}
select:${query.selectVal.join("-SELECT_JOIN-")}
groupBy:${query.groupByVal.join("-GROUP_BY_JOIN-")}
start:${query.startVal}
end:${query.endVal}`;
}
exports.createDataStringFromQuery = createDataStringFromQuery;
function createHashFromQuery(query) {
    /*const dataString = `namespace:${query.namespace != null ? query.namespace : ""}
  kinds:${query.kinds.join("-KIND_JOIN-")}
  filters:${JSON.stringify(query.filters)}
  limit:${query.limitVal}
  offset:${query.offsetVal}
  orders:${query.orders.join("-ORDERS_JOIN-")}
  select:${query.selectVal.join("-SELECT_JOIN-")}
  groupBy:${query.groupByVal.join("-GROUP_BY_JOIN-")}
  start:${query.startVal}
  end:${query.endVal}`;*/
    return crypto.createHash("sha1").update(createDataStringFromQuery(query)).digest("base64");
}
exports.createHashFromQuery = createHashFromQuery;
const serializableKeyName = "__pebblebed_serializable_key__";
function cachingAugmentQueryEntitiesWithSerializableKeys(queryResponse) {
    for (const entity of queryResponse.entities) {
        entity[serializableKeyName] = entity[Core_1.default.Instance.dsModule.KEY];
    }
}
function removeSerializableKeysFromEntities(queryResponse) {
    for (const entity of queryResponse.entities) {
        delete entity[serializableKeyName];
    }
}
function cachingAugmentQueryEntitiesWithRealKeys(queryResponse) {
    for (const entity of queryResponse.entities) {
        entity[Core_1.default.Instance.dsModule.KEY] = entity[serializableKeyName];
        delete entity[serializableKeyName];
    }
}
//# sourceMappingURL=DatastoreQuery.js.map