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
const Messaging_1 = require("../Messaging");
class PebblebedCacheStore {
    constructor() {
        this.cacheOnSave = true;
        this.cacheOnLoad = true;
        this.cacheOnQuery = true;
    }
    getEntitiesByKeys(keys) {
        return __awaiter(this, void 0, void 0, function* () {
            Messaging_1.warn(`Pebblebed: Caching: Trying to get cached entities before a load, but getEntitiesByKeys() hasn't been implemented in your cache store yet.`);
            return null;
        });
    }
    setEntitiesAfterLoadOrSave(entities, secondsToCache) {
        return __awaiter(this, void 0, void 0, function* () {
            Messaging_1.warn(`Pebblebed: Caching: Trying to cache entities after a load or save, but setEntitiesAfterLoadOrSave() hasn't been implemented in your cache store yet.`);
            return null;
        });
    }
    setQueryResponse(queryResponse, queryHash, secondsToCache, queryObject) {
        return __awaiter(this, void 0, void 0, function* () {
            Messaging_1.warn(`Pebblebed: Caching: Trying to cache entities after a query, but setQueryResponse() hasn't been implemented in your cache store yet.`);
            return null;
        });
    }
    getQueryResponse(queryHash, queryObject) {
        return __awaiter(this, void 0, void 0, function* () {
            Messaging_1.warn(`Pebblebed: Caching: Trying to get a query result from the cache, but getQueryResponse() hasn't been implemented in your cache store yet.`);
            return null;
        });
    }
    flushEntitiesByKeys(keys) {
        return __awaiter(this, void 0, void 0, function* () {
            Messaging_1.warn(`Pebblebed: Caching: Trying to flush entities by keys, but flushEntitiesByKeys() hasn't been implemented in your cache store yet.`);
            return null;
        });
    }
    flushEntities() {
        return __awaiter(this, void 0, void 0, function* () {
            Messaging_1.warn(`Pebblebed: Caching: Trying to flush entities, but flushEntities() hasn't been implemented in your cache store yet.`);
            return null;
        });
    }
    flushQueries() {
        return __awaiter(this, void 0, void 0, function* () {
            Messaging_1.warn(`Pebblebed: Caching: Trying to flush queries, but flushQueries() hasn't been implemented in your cache store yet.`);
            return null;
        });
    }
}
exports.PebblebedCacheStore = PebblebedCacheStore;
//# sourceMappingURL=PebblebedCacheStore.js.map