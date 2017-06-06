/**
 * Created by Paul on 2017-06-02.
 *
 */
function pebblebedMessage(message) {
    return `\n--- --- --- Pebblebed --- --- --- -- -- -- - - - .

${message}

--- --- --- Pebblebed --- --- --- -- -- -- - - - '`
}

export function WRONG_SCHEMA_ID_TYPE(kind: string, wrongType: string, rightType: string, idProperty: string, id: number|string) {
    return pebblebedMessage(
`Warning: LOAD / QUERY ENTITY: Retrieved an entity of [${kind}]: ID = [${id}] of [${wrongType}] type
- Schema for this Entity defines an ID property [${idProperty}] that is of [${rightType}] type.
  The [${wrongType}] ID will not be populated on the entity's [${rightType}] ID property [${idProperty}]
  It is recommended that you don't mix ID types on entity kinds.
  To correct this - set a new [${rightType}] ID on the [${idProperty}] property on this entity before saving.
  
  (If not, then the entity will keep the same [${wrongType}] ID (${id}) on save)`);
}

function DATASTORE_INSTANCE(operation) {
    return `\n- Pebblebed -
    
${operation} : Can't run operation without connecting to a datastore instance first - connect using Pebblebed.useDatastore( datastore )

- Pebblebed -\n`
}

function SAVE_WRONG_ID_TYPE(kind: string, rightType: string, idProperty: string, value) {
    return pebblebedMessage(`SAVE ENTITY [${kind}]: ID Property [${idProperty}] is type [string] but value passed is not string -> ${value}`);
}

export const ErrorMessages = {
    NO_GOOGLE_CLOUD_DEPENDENCY: `\n- Pebblebed -

Pebblebed : Pebblebed requires a peerDependency of @google-cloud/datastore - please make sure that you have this dependency installed in your project

- Pebblebed -\n`,
    DATASTORE_INSTANCE,
    WRONG_SCHEMA_ID_TYPE,
    SAVE_WRONG_ID_TYPE,
};
