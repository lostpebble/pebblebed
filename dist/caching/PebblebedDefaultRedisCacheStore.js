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
const util = require("util");
const Core_1 = require("../Core");
class PebblebedDefaultRedisCacheStore extends PebblebedCacheStore_1.PebblebedCacheStore {
    constructor(ioRedisClient) {
        super();
        this.redis = ioRedisClient;
    }
    getEntitiesByKeys(keys) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Trying to get entities from cache using keys:`);
            console.log(util.inspect(keys, true, 3));
            const keyStrings = keys.map((key) => key.path.join(":"));
            if (keyStrings.length >= 1) {
                const redisResult = yield this.redis.mget(keyStrings[0], ...keyStrings.slice(1));
                // console.log(`Got result from redis:`);
                // console.log(util.inspect(redisResult));
                let containsNulls = false;
                const results = redisResult.map((result) => {
                    if (result != null) {
                        return JSON.parse(result);
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
            // console.log(`Trying to set entities in cache after load or save:`, util.inspect(entities, true, 4));
            // console.log();
            if (entities.length > 0) {
                const pipeline = this.redis.pipeline();
                entities.forEach((entity) => {
                    pipeline.setex(entity[Core_1.default.Instance.dsModule.KEY].path.join(":"), secondsToCache, JSON.stringify(entity));
                });
                const result = yield pipeline.exec();
                console.log(result);
            }
        });
    }
    flushEntitiesByKeys(keys) {
        return __awaiter(this, void 0, void 0, function* () {
            const keyStrings = keys.map((key) => key.path.join(":"));
            if (keyStrings.length >= 1) {
                yield this.redis.del(keyStrings[0], ...keyStrings.slice(1));
            }
        });
    }
}
exports.PebblebedDefaultRedisCacheStore = PebblebedDefaultRedisCacheStore;
//# sourceMappingURL=PebblebedDefaultRedisCacheStore.js.map