import { PebblebedCacheStore } from "./PebblebedCacheStore";
import { Redis } from "ioredis";
import { DatastoreEntityKey } from "../";
import Core from "../Core";
import { DatastoreQueryResponse } from "../index";
import { reviveDateObjects } from "../utility/serialization";

export class PebblebedDefaultRedisCacheStore extends PebblebedCacheStore {
  redis: Redis;
  namespace = "PEBBLEBED";

  constructor(ioRedisClient: Redis) {
    super();
    this.redis = ioRedisClient;
  }

  async getEntitiesByKeys(keys: DatastoreEntityKey[]) {
    const keyStrings = keys.map((key) => `${this.namespace}:${key.path.join(":")}`);

    if (keyStrings.length >= 1) {
      const redisResult = await this.redis.mget(keyStrings[0], ...keyStrings.slice(1));

      let containsNulls = false;
      const results = redisResult.map((result) => {
        if (result != null) {
          return JSON.parse(result, reviveDateObjects);
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
    if (entities.length > 0) {
      const pipeline = this.redis.pipeline();

      entities.forEach((entity) => {
        pipeline.setex(`${this.namespace}:${entity[Core.Instance.dsModule.KEY].path.join(":")}`, secondsToCache, JSON.stringify(entity));
      });

      await pipeline.exec();
    }
  }

  async setQueryResponse(queryResponse: DatastoreQueryResponse, queryHash: string, secondsToCache: number) {
    await this.redis.setex(`${this.namespace}:${queryHash}`, secondsToCache, JSON.stringify(queryResponse));
  }

  async getQueryResponse(queryHash: string) {
    const redisResult = await this.redis.get(`${this.namespace}:${queryHash}`);

    if (redisResult != null) {
      return JSON.parse(redisResult, reviveDateObjects);
    }

    return Promise.resolve(null);
  }

  async flushQueryResponse(queryHash: string) {
    await this.redis.del(`${this.namespace}:${queryHash}`);
  }

  async flushEntitiesByKeys(keys: DatastoreEntityKey[]) {
    const keyStrings = keys.map((key) => `${this.namespace}:${key.path.join(":")}`);

    if (keyStrings.length >= 1) {
      await this.redis.del(keyStrings[0], ...keyStrings.slice(1));
    }
  }
}
