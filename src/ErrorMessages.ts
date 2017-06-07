import { PebblebedModel } from "./PebbleBed";
/**
 * Created by Paul on 2017-06-02.
 *
 */
function message(message: string) {
  return `\n--- --- --- Pebblebed --- --- --- -- -- -- - - - .

${message}

--- --- --- Pebblebed --- --- --- -- -- -- - - - ˙`;
}

export function LOAD_QUERY_DATA_ID_TYPE_ERROR(
  kind: string,
  wrongType: string,
  rightType: string,
  idProperty: string,
  id: number | string
) {
  return message(
    `Warning: LOAD / QUERY ENTITY: Retrieved an entity of [${kind}]: ID = [${id}] of [${wrongType}] type
- Schema for this Entity defines an ID property [${idProperty}] that is of [${rightType}] type.
  The [${wrongType}] ID will not be populated on the entity's [${rightType}] ID property [${idProperty}]
  It is recommended that you don't mix ID types on entity kinds.
  To correct this - set a new [${rightType}] ID on the [${idProperty}] property on this entity before saving.
  
  (If not, then the entity will keep the same [${wrongType}] ID (${id}) on save)`
  );
}

function OPERATION_CHANGED_ANCESTORS_WARNING(
  model: PebblebedModel,
  operation: string,
  prevAncestors,
  nextAncestors
) {
  return message(
    `${operation} entity [${model.entityKind}]: Entity previously had ancestor path:
${prevAncestors}

>>> ${operation} operation being performed on entity, with different, deliberately set ancestor path:
${nextAncestors}

(to prevent this warning use ignoreDetectedAncestors() on this ${operation} operation)`
  );
}

function DATASTORE_INSTANCE_ERROR(operation) {
  return message(
    `${operation} : Can't run operation without connecting to a datastore instance first - connect using Pebblebed.useDatastore( datastore )`
  );
}

function OPERATION_MISSING_ID_ERROR(model: PebblebedModel, operation: string) {
  const extra = model.entityIdType === "int"
    ? " - or generateUnsetId() should be used."
    : "";

  return message(
    `${operation} entity [${model.entityKind}]: string ID Property [${model.entityIdProperty}] in entity [${model.entityKind}] must have a value in order to save.${extra}`
  );
}

function OPERATION_SCHEMA_ID_TYPE_ERROR(
  model: PebblebedModel,
  operation: string
) {
  return message(
    `${operation} entity [${model.entityKind}]: Schema ID properties can only be of type "string" || "int" - current type is set to : [${model.entityIdType}] on property [${model.entityIdProperty}]`
  );
}

function OPERATION_DATA_ID_TYPE_ERROR(
  model: PebblebedModel,
  operation: string,
  value
) {
  return message(
    `${operation} entity [${model.entityKind}]: ID Property [${model.entityIdProperty}] should be of type [${model.entityIdType}] but value passed for ID is not a [${model.entityIdType}] -> ${value} [${typeof value}]`
  );
}

function INCORRECT_ANCESTOR_KIND(model: PebblebedModel) {
  return message(
    `Operation on entity [${model.entityKind}]: withAncestors() not set correctly.  
First element and every second one after it needs to be of type PebblebedModel or a string to represent the Ancestor kind. e.g:

---> withAncestors(TestEntityModel, 123, "AnotherEntityKind", "idstring")

  123 and "idstring" in the above example represent the ids for the ancestors
  TestEntityModel is a created PebblebedModel and "AnotherEntityKind" is a string - they represent the kinds of the ancestors`
  )
}

export const ErrorMessages = {
  NO_GOOGLE_CLOUD_DEPENDENCY: message(
    `Pebblebed requires a peerDependency of @google-cloud/datastore - please make sure that you have this dependency installed in your project`
  ),
  DELETE_NO_DATA_IDS_ERROR: message(
    `DELETE ENTITY: No ID set on entities passed to delete operation.`
  ),
  INCORRECT_ANCESTOR_KIND,
  OPERATION_CHANGED_ANCESTORS_WARNING,
  OPERATION_MISSING_ID_ERROR,
  OPERATION_DATA_ID_TYPE_ERROR,
  OPERATION_SCHEMA_ID_TYPE_ERROR,
  DATASTORE_INSTANCE_ERROR,
  LOAD_QUERY_DATA_ID_TYPE_ERROR,
};
