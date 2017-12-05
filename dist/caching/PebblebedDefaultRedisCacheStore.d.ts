/// <reference types="ioredis" />
import { PebblebedCacheStore } from "./PebblebedCacheStore";
import { Redis } from "ioredis";
import { DatastoreEntityKey } from "../";
export declare class PebblebedDefaultRedisCacheStore extends PebblebedCacheStore {
    redis: Redis;
    constructor(ioRedisClient: Redis);
    getEntitiesByKeys(keys: DatastoreEntityKey[]): Promise<any>;
    setEntitiesAfterLoadOrSave(entities: any, secondsToCache: any): Promise<void>;
}
