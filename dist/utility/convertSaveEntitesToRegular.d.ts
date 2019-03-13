import { IPebblebedSaveEntity, SchemaDefinition } from "..";
export declare function convertSaveEntitiesToRegular<T>(saveEntities: IPebblebedSaveEntity<T>[], idProperty: string | null, idType: "string" | "int", schema: SchemaDefinition<any>): T[];
