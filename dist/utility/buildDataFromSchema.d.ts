import { SchemaDefinition } from "../types/PebblebedTypes";
export declare function preBuildDataFromSchema<T>(data: any, schema: SchemaDefinition<any>): T;
export default function buildDataFromSchema<T>(data: any, schema: SchemaDefinition<any>, entityKind?: string): {
    excludeFromIndexes: string[];
    dataObject: T;
};
