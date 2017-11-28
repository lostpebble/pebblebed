import * as Joi from "joi";
import { TJoiValidObjectKeys } from "../utility/JoiUtils";
import { IOJoiSchemaDefaultMetaInput } from "../types/PebblebedTypes";
import { SchemaDefinition } from "../";
export declare const AVJoiSchemaPropertyMetaInput: Joi.ObjectSchema;
export declare const AVJoiSchemaDefaultMetaInput: Joi.ObjectSchema;
export declare class PebblebedJoiSchema<T> {
    __isPebblebedJoiSchema: boolean;
    private schema;
    private defaultMeta;
    constructor();
    setDefaultMeta(defaultMeta: IOJoiSchemaDefaultMetaInput): this;
    setSchema(schema: TJoiValidObjectKeys<T>): this;
    __generateBasicSchema(): SchemaDefinition<T>;
}