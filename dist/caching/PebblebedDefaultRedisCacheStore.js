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
            // return this.redis.get
            console.log(`Trying to get entities by keys:`);
            console.log(util.inspect(keys, true, 3));
            const keyStrings = keys.map((key) => key.path.join(":"));
            if (keyStrings.length >= 1) {
                const redisResult = yield this.redis.mget(keyStrings[0], ...keyStrings.slice(1));
                console.log(`Got result from redis:`);
                console.log(util.inspect(redisResult));
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
            console.log(`Trying to set entities:`);
            console.log(util.inspect(entities, true, 4));
            if (entities.length > 0) {
                const pipeline = this.redis.pipeline();
                entities.forEach((entity) => {
                    pipeline.setex(entity[Core_1.default.Instance.dsModule.KEY].path.join(":"), secondsToCache, JSON.stringify(entity));
                });
                const result = yield pipeline.exec();
                console.log(result);
            }
            /*const keyValues = entities.map((entity) => `${entity[Core.Instance.dsModule.KEY].path.join(":")} ${JSON.stringify(entity)}`);
        
            if (keyValues.length >= 1) {
              await this.redis.mset()
            }*/
        });
    }
}
exports.PebblebedDefaultRedisCacheStore = PebblebedDefaultRedisCacheStore;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGViYmxlYmVkRGVmYXVsdFJlZGlzQ2FjaGVTdG9yZS5qcyIsInNvdXJjZVJvb3QiOiJEOi9EZXYvX1Byb2plY3RzL0dpdGh1Yi9wZWJibGViZWQvc3JjLyIsInNvdXJjZXMiOlsiY2FjaGluZy9QZWJibGViZWREZWZhdWx0UmVkaXNDYWNoZVN0b3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSwrREFBNEQ7QUFHNUQsNkJBQTZCO0FBQzdCLGtDQUEyQjtBQUUzQixxQ0FBNkMsU0FBUSx5Q0FBbUI7SUFHdEUsWUFBWSxhQUFvQjtRQUM5QixLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxLQUFLLEdBQUcsYUFBYSxDQUFDO0lBQzdCLENBQUM7SUFFSyxpQkFBaUIsQ0FBQyxJQUEwQjs7WUFDaEQsd0JBQXdCO1lBQ3hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUNBQWlDLENBQUMsQ0FBQztZQUMvQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXpDLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUV6RCxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNCLE1BQU0sV0FBVyxHQUFHLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVqRixPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7Z0JBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUV2QyxJQUFJLGFBQWEsR0FBRyxLQUFLLENBQUM7Z0JBQzFCLE1BQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNO29CQUNyQyxFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQzt3QkFDbkIsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQzVCLENBQUM7b0JBRUQsYUFBYSxHQUFHLElBQUksQ0FBQztvQkFDckIsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDZCxDQUFDLENBQUMsQ0FBQztnQkFFSCxFQUFFLENBQUMsQ0FBQyxhQUFhLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDNUIsTUFBTSxDQUFDLE9BQU8sQ0FBQztnQkFDakIsQ0FBQztZQUNILENBQUM7WUFFRCxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQixDQUFDO0tBQUE7SUFFSywwQkFBMEIsQ0FBQyxRQUFRLEVBQUUsY0FBYzs7WUFDdkQsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1lBQ3ZDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFN0MsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUV2QyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTTtvQkFDdEIsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsY0FBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxjQUFjLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUM1RyxDQUFDLENBQUMsQ0FBQztnQkFFSCxNQUFNLE1BQU0sR0FBRyxNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFFckMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN0QixDQUFDO1lBRUQ7Ozs7ZUFJRztRQUNMLENBQUM7S0FBQTtDQUNGO0FBN0RELDBFQTZEQyJ9