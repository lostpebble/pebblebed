import { SchemaDefinition } from "../types/PebblebedTypes";
export default function buildDataFromSchema<T>(data: any, schema: SchemaDefinition<any>, entityKind?: string): {
    excludeFromIndexes: string[];
    dataObject: T;
};
