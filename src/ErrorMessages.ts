/**
 * Created by Paul on 2017-06-02.
 *
 */
export function warnMessageSchemaIdType(wrongType: string, rightType: string, idProperty: string, id: number|string) {
    return `
WARNING: PEBBLEBED: LOAD / QUERY ENTITY: Retrieved an entity with an ID (${id}) of [${wrongType}] type
- BUT schema for this Entity defines an ID property [${idProperty}] that is of [${rightType}] type.
     The [${wrongType}] ID will not be populated on the entity's [${rightType}] ID property [${idProperty}]
     It is recommended that you don't mix ID types on entity kinds.
     To correct this - set a new [${rightType}] ID on the [${idProperty}] property on this entity before saving.
     (If not, then the entity will keep the same [${wrongType}] ID (${id}) on save)
`;
}
