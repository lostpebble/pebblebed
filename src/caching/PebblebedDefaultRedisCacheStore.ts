import { PebblebedCacheStore } from "./PebblebedCacheStore";
import { Redis } from "ioredis";
import { DatastoreEntityKey } from "../";
import * as util from "util";
import Core from "../Core";
import { DatastoreQueryResponse, InternalDatastoreQuery } from "../index";

export class PebblebedDefaultRedisCacheStore extends PebblebedCacheStore {
  redis: Redis;

  constructor(ioRedisClient: Redis) {
    super();
    this.redis = ioRedisClient;
  }

  async getEntitiesByKeys(keys: DatastoreEntityKey[]) {
    const keyStrings = keys.map((key) => key.path.join(":"));

    if (keyStrings.length >= 1) {
      const redisResult = await this.redis.mget(keyStrings[0], ...keyStrings.slice(1));

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
    if (entities.length > 0) {
      const pipeline = this.redis.pipeline();

      entities.forEach((entity) => {
        pipeline.setex(entity[Core.Instance.dsModule.KEY].path.join(":"), secondsToCache, JSON.stringify(entity));
      });

      await pipeline.exec();
    }
  }

  async setQueryResponse(queryResponse: DatastoreQueryResponse, queryHash: string, secondsToCache: number) {
    console.log(`Trying to set query (for ${secondsToCache}s) at hash: ${queryHash}`);

    await this.redis.setex(queryHash, secondsToCache, JSON.stringify(queryResponse));
  }

  async getQueryResponse(queryHash: string) {
    const redisResult = await this.redis.get(queryHash);

    console.log(`Got result for hash: ${queryHash}`, redisResult);

    if (redisResult != null) {
      return JSON.parse(redisResult);
    }

    return Promise.resolve(null);
  }

  async flushEntitiesByKeys(keys: DatastoreEntityKey[]) {
    const keyStrings = keys.map((key) => key.path.join(":"));

    if (keyStrings.length >= 1) {
      await this.redis.del(keyStrings[0], ...keyStrings.slice(1));
    }
  }
}
