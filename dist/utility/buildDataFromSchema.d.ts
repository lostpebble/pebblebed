import { SchemaDefinition } from "../types/PebblebedTypes";
export default function buildDataFromSchema(data: any, schema: SchemaDefinition<any>, entityKind?: string): {
    excludeFromIndexes: string[];
    dataObject: object;
};
