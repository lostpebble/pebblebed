"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Paul on 2017-06-02.
 *
 */
function pebblebedMessage(message) {
    return `\n--- --- --- Pebblebed --- --- --- -- -- -- - - - .

${message}

--- --- --- Pebblebed --- --- --- -- -- -- - - - '`;
}
function WRONG_SCHEMA_ID_TYPE(kind, wrongType, rightType, idProperty, id) {
    return pebblebedMessage(`Warning: LOAD / QUERY ENTITY: Retrieved an entity of [${kind}]: ID = [${id}] of [${wrongType}] type
- Schema for this Entity defines an ID property [${idProperty}] that is of [${rightType}] type.
  The [${wrongType}] ID will not be populated on the entity's [${rightType}] ID property [${idProperty}]
  It is recommended that you don't mix ID types on entity kinds.
  To correct this - set a new [${rightType}] ID on the [${idProperty}] property on this entity before saving.
  
  (If not, then the entity will keep the same [${wrongType}] ID (${id}) on save)`);
}
exports.WRONG_SCHEMA_ID_TYPE = WRONG_SCHEMA_ID_TYPE;
function DATASTORE_INSTANCE(operation) {
    return `\n- Pebblebed -
    
${operation} : Can't run operation without connecting to a datastore instance first - connect using Pebblebed.useDatastore( datastore )

- Pebblebed -\n`;
}
function SAVE_WRONG_ID_TYPE(kind, rightType, idProperty, value) {
    return pebblebedMessage(`SAVE ENTITY [${kind}]: ID Property [${idProperty}] is type [string] but value passed is not string -> ${value}`);
}
exports.ErrorMessages = {
    NO_GOOGLE_CLOUD_DEPENDENCY: `\n- Pebblebed -

Pebblebed : Pebblebed requires a peerDependency of @google-cloud/datastore - please make sure that you have this dependency installed in your project

- Pebblebed -\n`,
    DATASTORE_INSTANCE,
    WRONG_SCHEMA_ID_TYPE,
    SAVE_WRONG_ID_TYPE,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXJyb3JNZXNzYWdlcy5qcyIsInNvdXJjZVJvb3QiOiJEOi9EZXYvX1Byb2plY3RzL0dpdGh1Yi9wZWJibGViZWQvc3JjLyIsInNvdXJjZXMiOlsiRXJyb3JNZXNzYWdlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7R0FHRztBQUNILDBCQUEwQixPQUFPO0lBQzdCLE1BQU0sQ0FBQzs7RUFFVCxPQUFPOzttREFFMEMsQ0FBQTtBQUNuRCxDQUFDO0FBRUQsOEJBQXFDLElBQVksRUFBRSxTQUFpQixFQUFFLFNBQWlCLEVBQUUsVUFBa0IsRUFBRSxFQUFpQjtJQUMxSCxNQUFNLENBQUMsZ0JBQWdCLENBQzNCLHlEQUF5RCxJQUFJLFlBQVksRUFBRSxTQUFTLFNBQVM7bURBQzFDLFVBQVUsaUJBQWlCLFNBQVM7U0FDOUUsU0FBUywrQ0FBK0MsU0FBUyxrQkFBa0IsVUFBVTs7aUNBRXJFLFNBQVMsZ0JBQWdCLFVBQVU7O2lEQUVuQixTQUFTLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQztBQUNuRixDQUFDO0FBVEQsb0RBU0M7QUFFRCw0QkFBNEIsU0FBUztJQUNqQyxNQUFNLENBQUM7O0VBRVQsU0FBUzs7Z0JBRUssQ0FBQTtBQUNoQixDQUFDO0FBRUQsNEJBQTRCLElBQVksRUFBRSxTQUFpQixFQUFFLFVBQWtCLEVBQUUsS0FBSztJQUNsRixNQUFNLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLElBQUksbUJBQW1CLFVBQVUsd0RBQXdELEtBQUssRUFBRSxDQUFDLENBQUM7QUFDOUksQ0FBQztBQUVZLFFBQUEsYUFBYSxHQUFHO0lBQ3pCLDBCQUEwQixFQUFFOzs7O2dCQUloQjtJQUNaLGtCQUFrQjtJQUNsQixvQkFBb0I7SUFDcEIsa0JBQWtCO0NBQ3JCLENBQUMifQ==