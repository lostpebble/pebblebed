"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Paul on 2017-06-02.
 *
 */
function warnMessageSchemaIdType(wrongType, rightType, idProperty, id) {
    return `
WARNING: PEBBLEBED: LOAD / QUERY ENTITY: Retrieved an entity with an ID (${id}) of [${wrongType}] type
- BUT schema for this Entity defines an ID property [${idProperty}] that is of [${rightType}] type.
     The [${wrongType}] ID will not be populated on the entity's [${rightType}] ID property [${idProperty}]
     It is recommended that you don't mix ID types on entity kinds.
     To correct this - set a new [${rightType}] ID on the [${idProperty}] property on this entity before saving.
     (If not, then the entity will keep the same [${wrongType}] ID (${id}) on save)
`;
}
exports.warnMessageSchemaIdType = warnMessageSchemaIdType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXJyb3JNZXNzYWdlcy5qcyIsInNvdXJjZVJvb3QiOiJEOi9EZXYvX1Byb2plY3RzL0dpdGh1Yi9wZWJibGViZWQvc3JjLyIsInNvdXJjZXMiOlsiRXJyb3JNZXNzYWdlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7R0FHRztBQUNILGlDQUF3QyxTQUFpQixFQUFFLFNBQWlCLEVBQUUsVUFBa0IsRUFBRSxFQUFpQjtJQUMvRyxNQUFNLENBQUM7MkVBQ2dFLEVBQUUsU0FBUyxTQUFTO3VEQUN4QyxVQUFVLGlCQUFpQixTQUFTO1lBQy9FLFNBQVMsK0NBQStDLFNBQVMsa0JBQWtCLFVBQVU7O29DQUVyRSxTQUFTLGdCQUFnQixVQUFVO29EQUNuQixTQUFTLFNBQVMsRUFBRTtDQUN2RSxDQUFDO0FBQ0YsQ0FBQztBQVRELDBEQVNDIn0=