"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PebblebedCacheStore {
    onSave(entity) {
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
exports.PebblebedCacheStore = PebblebedCacheStore;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGViYmxlYmVkQ2FjaGVTdG9yZS5qcyIsInNvdXJjZVJvb3QiOiJEOi9EZXYvX1Byb2plY3RzL0dpdGh1Yi9wZWJibGViZWQvc3JjLyIsInNvdXJjZXMiOlsiY2FjaGluZy9QZWJibGViZWRDYWNoZVN0b3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7SUFDRSxNQUFNLENBQUMsTUFBYztRQUNuQixPQUFPLENBQUMsR0FBRyxDQUFDLDBIQUEwSCxDQUFDLENBQUM7SUFDMUksQ0FBQztJQUVELE1BQU07UUFDSixPQUFPLENBQUMsR0FBRyxDQUFDLDBIQUEwSCxDQUFDLENBQUM7SUFDMUksQ0FBQztJQUVELE9BQU87UUFDTCxPQUFPLENBQUMsR0FBRyxDQUFDLDZHQUE2RyxDQUFDLENBQUM7SUFDN0gsQ0FBQztJQUVELGVBQWU7UUFDYixPQUFPLENBQUMsR0FBRyxDQUFDLGtJQUFrSSxDQUFDLENBQUM7SUFDbEosQ0FBQztJQUVELGNBQWM7UUFDWixPQUFPLENBQUMsR0FBRyxDQUFDLGdJQUFnSSxDQUFDLENBQUM7SUFDaEosQ0FBQztDQUNGO0FBcEJELGtEQW9CQyJ9