import { DatastoreEntityKey, DatastoreQueryResponse, InternalDatastoreQuery } from "../";
export declare class PebblebedCacheStore {
    cacheOnSave: boolean;
    cacheOnLoad: boolean;
    cacheOnQuery: boolean;
    getEntitiesByKeys(keys: DatastoreEntityKey[]): Promise<null | any[]>;
    setEntitiesAfterLoadOrSave(entities: any[], secondsToCache: number): Promise<any>;
    setQueryResponse(queryResponse: DatastoreQueryResponse, queryHash: string, secondsToCache: number, queryObject?: InternalDatastoreQuery): Promise<any>;
    getQueryResponse(queryHash: string, queryObject?: InternalDatastoreQuery): Promise<any>;
    flushEntitiesByKeys(keys: DatastoreEntityKey[]): Promise<any>;
    flushEntities(): Promise<any>;
    flushQueries(): Promise<any>;
}
