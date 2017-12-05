import { PebblebedCacheStore } from "./PebblebedCacheStore";
import { Redis } from "ioredis";

export class PebblebedDefaultRedisCacheStore extends PebblebedCacheStore {
  redis: Redis;

  constructor(ioRedisClient: Redis) {
    super();

    this.redis = ioRedisClient;
  }
}
