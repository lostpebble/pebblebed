import { DatastoreEntityKey } from "../";
export declare class PebblebedCacheStore {
    getEntitiesByKeys(keys: DatastoreEntityKey[]): Promise<null | any[]>;
    setEntitiesAfterLoadOrSave(entities: any[], secondsToCache: number): Promise<any>;
    getEntitiesByQuery(query: any): Promise<any>;
    onFlushEntitiesByKeys(keys: DatastoreEntityKey[]): Promise<any>;
    onFlushEntities(): Promise<any>;
    onFlushQueries(): Promise<any>;
}
