/// <reference types="ioredis" />
import { PebblebedCacheStore } from "./PebblebedCacheStore";
import { Redis } from "ioredis";
export declare class PebblebedDefaultRedisCacheStore extends PebblebedCacheStore {
    redis: Redis;
    constructor(ioRedisClient: Redis);
}
