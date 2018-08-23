import { DatastoreEntityKey, DatastoreQueryResponse, InternalDatastoreQuery } from "../";
export declare class PebblebedCacheStore {
    cacheOnSave: boolean;
    cacheOnLoad: boolean;
    cacheOnQuery: boolean;
    getEntitiesByKeys(keys: DatastoreEntityKey[]): Promise<null | any[]>;
    setEntitiesAfterLoadOrSave(entities: any[], secondsToCache: number): Promise<void>;
    setQueryResponse(queryResponse: DatastoreQueryResponse<any>, queryHash: string, secondsToCache: number, queryObject?: InternalDatastoreQuery): Promise<void>;
    getQueryResponse<T = any>(queryHash: string, queryObject?: InternalDatastoreQuery): Promise<DatastoreQueryResponse<T>>;
    flushQueryResponse(queryHash: string, queryObject?: InternalDatastoreQuery): Promise<void>;
    flushEntitiesByKeys(keys: DatastoreEntityKey[]): Promise<void>;
    flushEntities(): Promise<void>;
    flushQueries(): Promise<void>;
}
