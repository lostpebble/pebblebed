"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PebblebedCacheStore_1 = require("./PebblebedCacheStore");
class PebblebedDefaultRedisCacheStore extends PebblebedCacheStore_1.PebblebedCacheStore {
    constructor(ioRedisClient) {
        super();
        this.redis = ioRedisClient;
    }
}
exports.PebblebedDefaultRedisCacheStore = PebblebedDefaultRedisCacheStore;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGViYmxlYmVkRGVmYXVsdFJlZGlzQ2FjaGVTdG9yZS5qcyIsInNvdXJjZVJvb3QiOiJEOi9EZXYvX1Byb2plY3RzL0dpdGh1Yi9wZWJibGViZWQvc3JjLyIsInNvdXJjZXMiOlsiY2FjaGluZy9QZWJibGViZWREZWZhdWx0UmVkaXNDYWNoZVN0b3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0RBQTREO0FBRzVELHFDQUE2QyxTQUFRLHlDQUFtQjtJQUd0RSxZQUFZLGFBQW9CO1FBQzlCLEtBQUssRUFBRSxDQUFDO1FBRVIsSUFBSSxDQUFDLEtBQUssR0FBRyxhQUFhLENBQUM7SUFDN0IsQ0FBQztDQUNGO0FBUkQsMEVBUUMifQ==