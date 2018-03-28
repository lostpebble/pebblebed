import * as Joi from "joi";
export declare type TPebblebedJoiSchemaObject<T> = {
    [key in keyof T]: Joi.Schema;
};
export declare function createObjectValidator<T = any>(keysSchema: TPebblebedJoiSchemaObject<T>): any;
export declare const JoiUtils: {
    createObjectValidator: typeof createObjectValidator;
};
