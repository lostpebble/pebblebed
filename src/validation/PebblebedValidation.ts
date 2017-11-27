import * as Joi from "joi";
import {JoiUtils, TJoiValidObjectKeys} from "../utility/JoiUtils";
import {IOJoiSchemaDefaultMetaInput, IOJoiSchemaPropertyMetaInput} from "../types/PebblebedTypes";
import {throwError} from "../Messaging";
import {
  IJoiDescribeObject, IJoiDescribeObjectProperty, SchemaDefinition,
  SchemaPropertyDefinition
} from "../";
import * as util from "util";

export const AVJoiSchemaPropertyMetaInput = JoiUtils.createObjectValidator<IOJoiSchemaPropertyMetaInput>({
  indexed: Joi.bool().default(true),
  role: Joi.string().valid(["id"]),
  onSave: Joi.func(),
});

export const AVJoiSchemaDefaultMetaInput = JoiUtils.createObjectValidator<IOJoiSchemaDefaultMetaInput>({
  indexed: Joi.bool().default(true),
});

export class PebblebedJoiSchema<T> {
  public __isPebblebedJoiSchema = true;
  private schema: Joi.Schema = null;
  private defaultMeta: IOJoiSchemaDefaultMetaInput = {};

  constructor() {}

  setDefaultMeta(defaultMeta: IOJoiSchemaDefaultMetaInput) {
    const validate = Joi.validate(defaultMeta, AVJoiSchemaDefaultMetaInput);

    if (validate.error != null) {
      throwError(`Pebblebed: Setting default meta properties for schema failed: ${validate.error}`);
    }

    this.defaultMeta = defaultMeta;
    return this;
  }

  setSchema(schema: TJoiValidObjectKeys<T>) {
    this.schema = JoiUtils.createObjectValidator(schema);
    return this;
  }

  /*__getSchema(): Joi.Schema {
    return this.schema;
  }

  __getDefaultMeta(): IOJoiSchemaDefaultMetaInput {
    return this.defaultMeta;
  }*/

  __generateBasicSchema(): SchemaDefinition<T> {
    if (this.schema == null) {
      throwError(`Pebblebed: Can't create a model without a schema defined`);
    }

    const entityProperties = this.schema.describe();

    console.log(util.inspect(entityProperties, {
      depth: 4,
    }));

    for (const property in (entityProperties as IJoiDescribeObject)) {
      if (Object.hasOwnProperty(property)) {
        const basicTypeDefinition: SchemaPropertyDefinition;
        const currentProp: IJoiDescribeObjectProperty = entityProperties[property];

        if (currentProp.meta != null) {
          currentProp.meta.forEach((metaObject) => {
            
          })
        }
      }
    }

    return {
      __excludeFromIndexes: [],
    } as SchemaDefinition<T>;
  }
}