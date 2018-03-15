import * as Joi from "joi";
import { TPebblebedJoiSchemaObject } from "../utility/JoiUtils";
import { IOJoiSchemaDefaultMetaInput } from "../types/PebblebedTypes";
import { SchemaDefinition } from "../";
export declare class PebblebedJoiSchema<T> {
    __isPebblebedJoiSchema: boolean;
    private schema;
    private basicSchemaObject;
    private defaultMeta;
    constructor(schema: TPebblebedJoiSchemaObject<T>);
    setDefaultMeta(defaultMeta: IOJoiSchemaDefaultMetaInput): this;
    __getBasicSchemaObject(): TPebblebedJoiSchemaObject<T>;
    __getJoiSchema(): Joi.Schema;
    __generateBasicSchema(): SchemaDefinition<T>;
}
