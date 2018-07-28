"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Core_1 = require("./Core");
function throwError(msg) {
    throw new Error(message(msg));
}
exports.throwError = throwError;
function errorNoThrow(msg) {
    console.error(message(msg));
}
exports.errorNoThrow = errorNoThrow;
function warn(msg) {
    if (!Core_1.default.Instance.isProductionEnv) {
        console.warn(message(msg));
    }
}
exports.warn = warn;
function message(message) {
    return `PEBBLEBED (Google Cloud Datastore): ${message}`;
}
function LOAD_QUERY_DATA_ID_TYPE_ERROR(kind, wrongType, rightType, idProperty, id) {
    return message(`Warning: LOAD / QUERY ENTITY: Retrieved an entity of [${kind}]: ID = [${id}] of [${wrongType}] type - Schema for this Entity defines an ID property [${idProperty}] that is of [${rightType}] type. The [${wrongType}] ID will not be populated on the entity's [${rightType}] ID property [${idProperty}] It is recommended that you don't mix ID types on entity kinds. To correct this - set a new [${rightType}] ID on the [${idProperty}] property on this entity before saving. (If not, then the entity will keep the same [${wrongType}] ID (${id}) on save)`);
}
exports.LOAD_QUERY_DATA_ID_TYPE_ERROR = LOAD_QUERY_DATA_ID_TYPE_ERROR;
function OPERATION_CHANGED_ANCESTORS_WARNING(model, operation, prevAncestors, nextAncestors) {
    return message(`${operation} entity [${model.entityKind}]: Entity previously had ancestor path: ${prevAncestors} >>> ${operation} operation being performed on entity, with different, deliberately set ancestor path: ${nextAncestors} (to prevent this warning use ignoreDetectedAncestors() on this ${operation} operation)`);
}
function DATASTORE_INSTANCE_ERROR(operation) {
    return message(`${operation} : Can't run operation without connecting to a datastore instance first - connect using Pebblebed.useDatastore( datastore )`);
}
function OPERATION_MISSING_ID_ERROR(model, operation) {
    const extra = model.entityIdType === "int" ? " - or generateUnsetId() should be used." : "";
    return message(`${operation} entity [${model.entityKind}]: string ID Property [${model.entityIdProperty}] in entity [${model.entityKind}] must have a value in order to save.${extra}`);
}
function OPERATION_SCHEMA_ID_TYPE_ERROR(model, operation) {
    return message(`${operation} entity [${model.entityKind}]: Schema ID properties can only be of type "string" || "int" - current type is set to : [${model.entityIdType}] on property [${model.entityIdProperty}]`);
}
function OPERATION_DATA_ID_TYPE_ERROR(model, operation, value) {
    return message(`${operation} entity [${model.entityKind}]: ID Property [${model.entityIdProperty}] should be of type [${model.entityIdType}] but value passed for ID is not a [${model.entityIdType}] -> ${value} [${typeof value}]`);
}
function INCORRECT_ANCESTOR_KIND(model) {
    return message(`Operation on entity [${model.entityKind}]: withAncestors() not set correctly.  
First element and every second one after it needs to be of type PebblebedModel or a string to represent the Ancestor kind. e.g:

---> withAncestors(TestEntityModel, 123, "AnotherEntityKind", "idstring")

  123 and "idstring" in the above example represent the ids for the ancestors
  TestEntityModel is a created PebblebedModel and "AnotherEntityKind" is a string - they represent the kinds of the ancestors`);
}
function SCHEMA_REQUIRED_TYPE_MISSING(property, kind) {
    return message(`On Save Error: Property [${property}] is required on datastore entity [${kind
        ? kind
        : ""}] - as defined in the Schema`);
}
function OPERATION_STRING_ID_EMPTY(model, operation) {
    return message(`${operation} entity [${model.entityKind}]: [string] ID is empty at ID property [${model.entityIdProperty}]`);
}
function OPERATION_KEYS_WRONG(model, operation) {
    return message(`${operation} entity [${model.entityKind}]: Passed key / keys to ${operation} are incorrect (last part of key must be of the same kind)`);
}
exports.CreateMessage = {
    NO_GOOGLE_CLOUD_DEPENDENCY: message(`Pebblebed requires a peerDependency of @google-cloud/datastore - please make sure that you have this dependency installed in your project`),
    DELETE_NO_DATA_IDS_ERROR: message(`DELETE ENTITY: No ID set on entities passed to delete operation.`),
    ACCESS_TRANSACTION_GENERATED_IDS_ERROR: message(`To get generated IDs on transaction, use following method parameters:
---> useTransaction(transaction, true)

This will allocate IDs for all unset entity IDs during this operation and return them in the response object: { generatedIds: [x, x, x] }`),
    SET_NAMESPACE_INCORRECT: message("Pebblebed.setDefaultNamespace(): Default namespace must be set to a string. Default namespace can be unset with null or an empty string."),
    INCORRECT_ARGUMENTS_KEYS_FROM_ARRAY: message('Can\'t use keysFromArray() without an even number of "plucking" arguments (pairs of an Entity model and the property to pluck out of the array, representing: kind, id), \nThis method takes the form of: ([sourceArray], EntityModel, propertyName, EntityModel, propertyName, ...) etc.'),
    OPERATION_KEYS_WRONG,
    OPERATION_STRING_ID_EMPTY,
    SCHEMA_REQUIRED_TYPE_MISSING,
    INCORRECT_ANCESTOR_KIND,
    OPERATION_CHANGED_ANCESTORS_WARNING,
    OPERATION_MISSING_ID_ERROR,
    OPERATION_DATA_ID_TYPE_ERROR,
    OPERATION_SCHEMA_ID_TYPE_ERROR,
    DATASTORE_INSTANCE_ERROR,
    LOAD_QUERY_DATA_ID_TYPE_ERROR,
};
//# sourceMappingURL=Messaging.js.map