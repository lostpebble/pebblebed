import * as Joi from "joi";
export declare type TJoiValidObjectKeys<T> = {
    [key in keyof T]: Joi.Schema;
};
export declare function createObjectValidator<T = any>(keysSchema: TJoiValidObjectKeys<T>): any;
export declare const JoiUtils: {
    createObjectValidator: <T = any>(keysSchema: TJoiValidObjectKeys<T>) => any;
};
