"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Messaging_1 = require("../Messaging");
class PebblebedCacheStore {
    getEntitiesByKeys(keys) {
        return __awaiter(this, void 0, void 0, function* () {
            Messaging_1.warn(`Pebblebed: Caching: Trying to get cached entities before a load, but getEntitiesByKeys() hasn't been implemented in your cache store yet.`);
            return null;
        });
    }
    setEntitiesAfterLoadOrSave(entities, secondsToCache) {
        return __awaiter(this, void 0, void 0, function* () {
            Messaging_1.warn(`Pebblebed: Caching: Trying to cache entities after a load or save, but setEntitiesAfterLoadOrSave() hasn't been implemented in your cache store yet.`);
            return null;
        });
    }
    getEntitiesByQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            Messaging_1.warn(`Pebblebed: Caching: Trying to cache a query, but onQuery() hasn't been implemented in your cache store yet.`);
            return null;
        });
    }
    onFlushEntitiesByKeys(keys) {
        return __awaiter(this, void 0, void 0, function* () {
            Messaging_1.warn(`Pebblebed: Caching: Trying to flush / rehydrate entities by keys, but onFlushEntitiesByKeys() hasn't been implemented in your cache store yet.`);
            return null;
        });
    }
    onFlushEntities() {
        return __awaiter(this, void 0, void 0, function* () {
            Messaging_1.warn(`Pebblebed: Caching: Trying to flush / rehydrate entities, but onFlushEntities() hasn't been implemented in your cache store yet.`);
            return null;
        });
    }
    onFlushQueries() {
        return __awaiter(this, void 0, void 0, function* () {
            Messaging_1.warn(`Pebblebed: Caching: Trying to flush / rehydrate queries, but onFlushQueries() hasn't been implemented in your cache store yet.`);
            return null;
        });
    }
}
exports.PebblebedCacheStore = PebblebedCacheStore;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGViYmxlYmVkQ2FjaGVTdG9yZS5qcyIsInNvdXJjZVJvb3QiOiJEOi9EZXYvX1Byb2plY3RzL0dpdGh1Yi9wZWJibGViZWQvc3JjLyIsInNvdXJjZXMiOlsiY2FjaGluZy9QZWJibGViZWRDYWNoZVN0b3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSw0Q0FBb0M7QUFHcEM7SUFDUSxpQkFBaUIsQ0FBQyxJQUEwQjs7WUFDaEQsZ0JBQUksQ0FBQywySUFBMkksQ0FBQyxDQUFDO1lBQ2xKLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDZCxDQUFDO0tBQUE7SUFFSywwQkFBMEIsQ0FBQyxRQUFlLEVBQUUsY0FBc0I7O1lBQ3RFLGdCQUFJLENBQUMsc0pBQXNKLENBQUMsQ0FBQztZQUM3SixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2QsQ0FBQztLQUFBO0lBRUssa0JBQWtCLENBQUMsS0FBVTs7WUFDakMsZ0JBQUksQ0FBQyw2R0FBNkcsQ0FBQyxDQUFDO1lBQ3BILE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDZCxDQUFDO0tBQUE7SUFFSyxxQkFBcUIsQ0FBQyxJQUEwQjs7WUFDcEQsZ0JBQUksQ0FBQyxnSkFBZ0osQ0FBQyxDQUFDO1lBQ3ZKLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDZCxDQUFDO0tBQUE7SUFFSyxlQUFlOztZQUNuQixnQkFBSSxDQUFDLGtJQUFrSSxDQUFDLENBQUM7WUFDekksTUFBTSxDQUFDLElBQUksQ0FBQztRQUNkLENBQUM7S0FBQTtJQUVLLGNBQWM7O1lBQ2xCLGdCQUFJLENBQUMsZ0lBQWdJLENBQUMsQ0FBQztZQUN2SSxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2QsQ0FBQztLQUFBO0NBQ0Y7QUE5QkQsa0RBOEJDIn0=