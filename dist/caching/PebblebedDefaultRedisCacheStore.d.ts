/// <reference types="ioredis" />
import { PebblebedCacheStore } from "./PebblebedCacheStore";
import { Redis } from "ioredis";
import { DatastoreEntityKey } from "../";
import { DatastoreQueryResponse } from "../index";
export declare class PebblebedDefaultRedisCacheStore extends PebblebedCacheStore {
    redis: Redis;
    constructor(ioRedisClient: Redis);
    getEntitiesByKeys(keys: DatastoreEntityKey[]): Promise<any>;
    setEntitiesAfterLoadOrSave(entities: any, secondsToCache: any): Promise<void>;
    setQueryResponse(queryResponse: DatastoreQueryResponse, queryHash: string, secondsToCache: number): Promise<void>;
    getQueryResponse(queryHash: string): Promise<any>;
    flushEntitiesByKeys(keys: DatastoreEntityKey[]): Promise<void>;
}
