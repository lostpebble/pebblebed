import { IPebblebedSaveEntity } from "..";
export declare function convertSaveEntitiesToRegular<T>(saveEntities: IPebblebedSaveEntity<T>[], idProperty: string | null, idType: "string" | "int"): T[];
