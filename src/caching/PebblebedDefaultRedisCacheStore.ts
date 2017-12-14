import { PebblebedCacheStore } from "./PebblebedCacheStore";
import { Redis } from "ioredis";
import { DatastoreEntityKey } from "../";
import * as util from "util";
import Core from "../Core";

export class PebblebedDefaultRedisCacheStore extends PebblebedCacheStore {
  redis: Redis;

  constructor(ioRedisClient: Redis) {
    super();
    this.redis = ioRedisClient;
  }

  async getEntitiesByKeys(keys: DatastoreEntityKey[]) {
    console.log(`Trying to get entities from cache using keys:`);
    console.log(util.inspect(keys, true, 3));

    const keyStrings = keys.map((key) => key.path.join(":"));

    if (keyStrings.length >= 1) {
      const redisResult = await this.redis.mget(keyStrings[0], ...keyStrings.slice(1));

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
  }

  async setEntitiesAfterLoadOrSave(entities, secondsToCache) {
    // console.log(`Trying to set entities in cache after load or save:`, util.inspect(entities, true, 4));
    // console.log();

    if (entities.length > 0) {
      const pipeline = this.redis.pipeline();

      entities.forEach((entity) => {
        pipeline.setex(entity[Core.Instance.dsModule.KEY].path.join(":"), secondsToCache, JSON.stringify(entity));
      });

      const result = await pipeline.exec();

      console.log(result);
    }
  }

  async flushEntitiesByKeys(keys: DatastoreEntityKey[]) {
    const keyStrings = keys.map((key) => key.path.join(":"));

    if (keyStrings.length >= 1) {
      await this.redis.del(keyStrings[0], ...keyStrings.slice(1));
    }
  }
}
