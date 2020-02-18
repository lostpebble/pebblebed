/// <reference types="hapi__joi" />
import * as Joi from "@hapi/joi";
export declare type TPebblebedJoiSchemaObject<T> = {
    [key in keyof T]: Joi.Schema;
};
export declare function createObjectValidator<T = any>(keysSchema: TPebblebedJoiSchemaObject<T>): Joi.ObjectSchema<any>;
export declare const JoiUtils: {
    createObjectValidator: typeof createObjectValidator;
};
