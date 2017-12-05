export class PebblebedCacheStore {
  onSave(entity: string) {
    console.log(`Pebblebed: Caching: Trying to cache entities after a save, but onSave() hasn't been implemented in your cache store yet.`);
  }

  onLoad() {
    console.log(`Pebblebed: Caching: Trying to cache entities after a load, but onLoad() hasn't been implemented in your cache store yet.`);
  }

  onQuery() {
    console.log(`Pebblebed: Caching: Trying to cache a query, but onQuery() hasn't been implemented in your cache store yet.`);
  }

  onFlushEntities() {
    console.log(`Pebblebed: Caching: Trying to flush / rehydrate entities, but onFlushEntities() hasn't been implemented in your cache store yet.`);
  }

  onFlushQueries() {
    console.log(`Pebblebed: Caching: Trying to flush / rehydrate queries, but onFlushQueries() hasn't been implemented in your cache store yet.`);
  }
}
