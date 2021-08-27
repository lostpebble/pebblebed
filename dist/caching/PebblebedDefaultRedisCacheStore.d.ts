import { PebblebedCacheStore } from "./PebblebedCacheStore";
import { Redis } from "ioredis";
import { DatastoreQueryResponse } from "../index";
import { Key } from "@google-cloud/datastore";
export declare class PebblebedDefaultRedisCacheStore extends PebblebedCacheStore {
    redis: Redis;
    namespace: string;
    constructor(ioRedisClient: Redis);
    createEntityCacheKey(dsKey: Key): string;
    getEntitiesByKeys(keys: Key[]): Promise<any>;
    setEntitiesAfterLoadOrSave(entities: any, secondsToCache: any): Promise<void>;
    setQueryResponse(queryResponse: DatastoreQueryResponse<any>, queryHash: string, secondsToCache: number): Promise<void>;
    getQueryResponse(queryHash: string): Promise<any>;
    flushQueryResponse(queryHash: string): Promise<void>;
    flushEntitiesByKeys(keys: Key[]): Promise<void>;
}
