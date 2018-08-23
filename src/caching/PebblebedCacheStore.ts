import { warn } from "../Messaging";
import { DatastoreEntityKey, DatastoreQueryResponse, InternalDatastoreQuery } from "../";

export class PebblebedCacheStore {
  cacheOnSave = true;
  cacheOnLoad = true;
  cacheOnQuery = true;

  async getEntitiesByKeys(keys: DatastoreEntityKey[]): Promise<null | any[]> {
    warn(`Pebblebed: Caching: Trying to get cached entities before a load, but getEntitiesByKeys() hasn't been implemented in your cache store yet.`);
    return null;
  }

  async setEntitiesAfterLoadOrSave(entities: any[], secondsToCache: number) {
    warn(`Pebblebed: Caching: Trying to cache entities after a load or save, but setEntitiesAfterLoadOrSave() hasn't been implemented in your cache store yet.`);
  }

  async setQueryResponse(queryResponse: DatastoreQueryResponse<any>, queryHash: string, secondsToCache: number, queryObject?: InternalDatastoreQuery) {
    warn(`Pebblebed: Caching: Trying to cache entities after a query, but setQueryResponse() hasn't been implemented in your cache store yet.`);
  }

  async getQueryResponse<T = any>(queryHash: string, queryObject?: InternalDatastoreQuery): Promise<DatastoreQueryResponse<T>> {
    warn(`Pebblebed: Caching: Trying to get a query result from the cache, but getQueryResponse() hasn't been implemented in your cache store yet.`);
    return null as any;
  }

  async flushQueryResponse(queryHash: string, queryObject?: InternalDatastoreQuery) {
    warn(`Pebblebed: Caching: Trying to flush a query result out of the cache, but flushQueryResponse() hasn't been implemented in your cache store yet.`);
  }

  async flushEntitiesByKeys(keys: DatastoreEntityKey[]) {
    warn(`Pebblebed: Caching: Trying to flush entities by keys, but flushEntitiesByKeys() hasn't been implemented in your cache store yet.`);
  }

  async flushEntities() {
    warn(`Pebblebed: Caching: Trying to flush entities, but flushEntities() hasn't been implemented in your cache store yet.`);
  }

  async flushQueries() {
    warn(`Pebblebed: Caching: Trying to flush queries, but flushQueries() hasn't been implemented in your cache store yet.`);
  }
}
