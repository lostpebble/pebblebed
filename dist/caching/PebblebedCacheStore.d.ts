import { DatastoreEntityKey } from "../";
export declare class PebblebedCacheStore {
    cacheOnSave: boolean;
    cacheOnLoad: boolean;
    getEntitiesByKeys(keys: DatastoreEntityKey[]): Promise<null | any[]>;
    setEntitiesAfterLoadOrSave(entities: any[], secondsToCache: number): Promise<any>;
    setEntitiesByQuery(query: any): Promise<any>;
    getEntitiesByQuery(query: any): Promise<any>;
    flushEntitiesByKeys(keys: DatastoreEntityKey[]): Promise<any>;
    flushEntities(): Promise<any>;
    flushQueries(): Promise<any>;
}
