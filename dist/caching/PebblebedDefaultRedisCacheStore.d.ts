import { PebblebedCacheStore } from "./PebblebedCacheStore";
import { Redis } from "ioredis";
import { DatastoreEntityKey } from "../";
import { DatastoreQueryResponse } from "../index";
export declare class PebblebedDefaultRedisCacheStore extends PebblebedCacheStore {
    redis: Redis;
    namespace: string;
    constructor(ioRedisClient: Redis);
    createEntityCacheKey(dsKey: DatastoreEntityKey): string;
    getEntitiesByKeys(keys: DatastoreEntityKey[]): Promise<any>;
    setEntitiesAfterLoadOrSave(entities: any, secondsToCache: any): Promise<void>;
    setQueryResponse(queryResponse: DatastoreQueryResponse<any>, queryHash: string, secondsToCache: number): Promise<void>;
    getQueryResponse(queryHash: string): Promise<any>;
    flushQueryResponse(queryHash: string): Promise<void>;
    flushEntitiesByKeys(keys: DatastoreEntityKey[]): Promise<void>;
}
