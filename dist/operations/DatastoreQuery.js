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
const crypto = require("crypto");
function createDatastoreQuery(model, namespace = null) {
    const idProp = model.entityIdProperty;
    const kind = model.entityKind;
    const hasIdProp = model.entityHasIdProperty;
    const type = hasIdProp ? model.entitySchema[model.entityIdProperty].type : null;
    const schema = model.entitySchema;
    const ns = namespace != null ? namespace : Core_1.default.Instance.namespace;
    const dsQuery = ns != null
        ? Core_1.default.Instance.ds.createQuery(ns, model.entityKind)
        : Core_1.default.Instance.ds.createQuery(model.entityKind);
    const runQuery = dsQuery.run.bind(dsQuery);
    const filterQuery = dsQuery.filter.bind(dsQuery);
    const useCache = model.modelOptions.neverCache ? false : Core_1.default.Instance.caching;
    const cachingTimeSeconds = model.modelOptions.defaultCachingSeconds != null
        ? model.modelOptions.defaultCachingSeconds
        : Core_1.default.Instance.defaultCachingSeconds;
    return Object.assign(dsQuery, {
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
        filter(property, comparator, value) {
            return filterQuery(property, comparator, convertToType_1.default(value, schema[property].type));
        },
        withAncestors(...args) {
            const ancestors = extractAncestorPaths_1.default(model, ...args);
            if (ns != null) {
                this.hasAncestor(Core_1.default.Instance.ds.key({
                    namespace: ns,
                    path: [].concat.apply([], ancestors),
                }));
            }
            else {
                this.hasAncestor(Core_1.default.Instance.ds.key([].concat.apply([], ancestors)));
            }
            return this;
        },
        run() {
            return __awaiter(this, void 0, void 0, function* () {
                let hash = null;
                if (Core_1.default.Instance.cacheStore != null && Core_1.default.Instance.cacheStore.cacheOnQuery && this.useCache) {
                    hash = createHashFromQuery(this);
                    console.log("Created HASH for QUERY", hash);
                    const queryResponse = yield Core_1.default.Instance.cacheStore.getQueryResponse(hash, this);
                    if (queryResponse != null) {
                        console.log(queryResponse);
                        augmentEntitiesWithIdProperties_1.default(queryResponse.entities, idProp, type, kind);
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
                    Core_1.default.Instance.cacheStore.setQueryResponse(queryResponse, hash, this.cachingTimeSeconds, this);
                }
                return queryResponse;
            });
        },
    });
}
exports.createDatastoreQuery = createDatastoreQuery;
function createHashFromQuery(query) {
    const dataString = `kinds:${query.kinds.join("-KIND_JOIN-")}
filters:${JSON.stringify(query.filters)}
limit:${query.limitVal}
offset:${query.offsetVal}
orders:${query.orders.join("-ORDERS_JOIN-")}
select:${query.selectVal.join("-SELECT_JOIN-")}
groupBy:${query.groupByVal.join("-GROUP_BY_JOIN-")}
start:${query.startVal}
end:${query.endVal}`;
    return crypto.createHash("sha1").update(dataString).digest("base64");
}
exports.createHashFromQuery = createHashFromQuery;
//# sourceMappingURL=DatastoreQuery.js.map