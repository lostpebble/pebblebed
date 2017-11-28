import * as Joi from "joi";
import { JoiUtils, TJoiValidObjectKeys } from "../utility/JoiUtils";
import { IOJoiSchemaDefaultMetaInput, IOJoiSchemaPropertyMetaInput } from "../types/PebblebedTypes";
import { throwError } from "../Messaging";
import {
  IJoiDescribeObject,
  IJoiDescribeObjectProperty,
  SchemaDefinition,
  SchemaPropertyDefinition,
} from "../";
import * as util from "util";
import {inspect} from "util";

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
  private defaultMeta: IOJoiSchemaDefaultMetaInput = {
    indexed: true,
    nullValueIfUnset: true,
  };

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

  __generateBasicSchema(): SchemaDefinition<T> {
    if (this.schema == null) {
      throwError(`Pebblebed: Can't create a model without a schema defined`);
    }

    const entityProperties = this.schema.describe().children;

    console.log(util.inspect(entityProperties, { depth: 4 }));

    let roleIdSet = false;

    const basicSchema: Partial<SchemaDefinition> = {
      __excludeFromIndexes: [],
    };

    for (const property in entityProperties as IJoiDescribeObject) {
      if (entityProperties.hasOwnProperty(property)) {
        console.log(`Got property ${property}`, entityProperties[property]);

        const currentProp: IJoiDescribeObjectProperty = entityProperties[property];

        const propertyExcludeFromIndexes = [];
        const basicPropertyDefinition: Partial<SchemaPropertyDefinition> = {};

        if (currentProp.flags) {
          if (currentProp.flags.default) {
            basicPropertyDefinition.default = currentProp.flags.default;
          }

          if (currentProp.flags.presence === "required") {
            basicPropertyDefinition.required = true;
          }
        }

        if (currentProp.meta != null) {
          currentProp.meta.forEach(metaObject => {
            if (metaObject.__typeDefinition) {
              basicPropertyDefinition.type = metaObject.type;

              if (metaObject.role && metaObject.role === "id") {
                if (!roleIdSet) {
                  basicPropertyDefinition.role = "id";
                  roleIdSet = true;
                } else {
                  throwError(
                    `Pebblebed: Can't set two properties with the role of ID in schema. Found second ID defined in property: ${property}`
                  );
                }
              }
            } else {
              const propertyMeta = Object.assign({}, this.defaultMeta, metaObject);

              if (!propertyMeta.nullValueIfUnset) {
                basicPropertyDefinition.optional = true;
              }

              if (!propertyMeta.indexed) {
                basicPropertyDefinition.excludeFromIndexes = true;
                propertyExcludeFromIndexes.push(property);
              }

              if (propertyMeta.onSave) {
                basicPropertyDefinition.onSave = propertyMeta.onSave;
              }

              if (currentProp.type === "object") {
                if (propertyMeta.serialize) {
                  basicPropertyDefinition.serialize = true;
                }
              }
            }
          });
        }

        basicSchema.__excludeFromIndexes = basicSchema.__excludeFromIndexes.concat(propertyExcludeFromIndexes);
        basicSchema[property] = basicPropertyDefinition;
      }
    }

    console.log(util.inspect(basicSchema, { depth: 4 }));

    return {
      __excludeFromIndexes: [],
    } as SchemaDefinition<T>;
  }
}
