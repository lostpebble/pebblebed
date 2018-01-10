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
const PebblebedCacheStore_1 = require("./PebblebedCacheStore");
const Core_1 = require("../Core");
const serialization_1 = require("../utility/serialization");
class PebblebedDefaultRedisCacheStore extends PebblebedCacheStore_1.PebblebedCacheStore {
    constructor(ioRedisClient) {
        super();
        this.namespace = "PEBBLEBED";
        this.redis = ioRedisClient;
    }
    getEntitiesByKeys(keys) {
        return __awaiter(this, void 0, void 0, function* () {
            const keyStrings = keys.map((key) => `${this.namespace}:${key.path.join(":")}`);
            if (keyStrings.length >= 1) {
                const redisResult = yield this.redis.mget(keyStrings[0], ...keyStrings.slice(1));
                let containsNulls = false;
                const results = redisResult.map((result) => {
                    if (result != null) {
                        return JSON.parse(result, serialization_1.reviveDateObjects);
                    }
                    containsNulls = true;
                    return null;
                });
                if (containsNulls === false) {
                    return results;
                }
            }
            return Promise.resolve(null);
        });
    }
    setEntitiesAfterLoadOrSave(entities, secondsToCache) {
        return __awaiter(this, void 0, void 0, function* () {
            if (entities.length > 0) {
                const pipeline = this.redis.pipeline();
                entities.forEach((entity) => {
                    pipeline.setex(`${this.namespace}:${entity[Core_1.default.Instance.dsModule.KEY].path.join(":")}`, secondsToCache, JSON.stringify(entity));
                });
                yield pipeline.exec();
            }
        });
    }
    setQueryResponse(queryResponse, queryHash, secondsToCache) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.redis.setex(`${this.namespace}:${queryHash}`, secondsToCache, JSON.stringify(queryResponse));
        });
    }
    getQueryResponse(queryHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisResult = yield this.redis.get(`${this.namespace}:${queryHash}`);
            if (redisResult != null) {
                return JSON.parse(redisResult, serialization_1.reviveDateObjects);
            }
            return Promise.resolve(null);
        });
    }
    flushEntitiesByKeys(keys) {
        return __awaiter(this, void 0, void 0, function* () {
            const keyStrings = keys.map((key) => `${this.namespace}:${key.path.join(":")}`);
            if (keyStrings.length >= 1) {
                yield this.redis.del(keyStrings[0], ...keyStrings.slice(1));
            }
        });
    }
}
exports.PebblebedDefaultRedisCacheStore = PebblebedDefaultRedisCacheStore;
//# sourceMappingURL=PebblebedDefaultRedisCacheStore.js.map