export declare function WRONG_SCHEMA_ID_TYPE(kind: string, wrongType: string, rightType: string, idProperty: string, id: number | string): string;
export declare const ErrorMessages: {
    NO_GOOGLE_CLOUD_DEPENDENCY: string;
    DATASTORE_INSTANCE: (operation: any) => string;
    WRONG_SCHEMA_ID_TYPE: (kind: string, wrongType: string, rightType: string, idProperty: string, id: string | number) => string;
    SAVE_WRONG_ID_TYPE: (kind: string, rightType: string, idProperty: string, value: any) => string;
};
