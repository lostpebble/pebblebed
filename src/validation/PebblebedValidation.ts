import * as Joi from "@hapi/joi";
import { JoiUtils, TPebblebedJoiSchemaObject } from "../utility/JoiUtils";
import {
  IOJoiSchemaDefaultMetaInput,
  IOJoiSchemaPropertyMetaInput,
  IOJoiSchemaSerializedJsonPropertyMetaInput,
} from "../types/PebblebedTypes";
import { throwError } from "../Messaging";
import { IJoiDescribeObject, IJoiDescribeObjectProperty, SchemaDefinition, SchemaPropertyDefinition, } from "../";
import Core from "../Core";
import { Schema } from "@hapi/joi";

class PebblebedValidations {
  private static _AVJoiSchemaPropertyMetaInput: Schema | null = null;
  private static _AVJoiSchemaDefaultMetaInput: Schema | null = null;

  static get AVJoiSchemaPropertyMetaInput() {
    if (this._AVJoiSchemaPropertyMetaInput == null) {
      this._AVJoiSchemaPropertyMetaInput = JoiUtils.createObjectValidator<
        IOJoiSchemaPropertyMetaInput<any> & IOJoiSchemaSerializedJsonPropertyMetaInput
      >({
        required: Core.Joi.bool().default(false),
        indexed: Core.Joi.bool().default(true),
        reviver: Core.Joi.func().default(null),
        joiSchema: Core.Joi.any().default(null),
        role: Core.Joi.string().valid("id"),
        onSave: Core.Joi.func(),
        nullValueIfUnset: Core.Joi.bool().default(true),
      });
    }

    return this._AVJoiSchemaPropertyMetaInput;
  }

  static get AVJoiSchemaDefaultMetaInput() {
    if (this._AVJoiSchemaDefaultMetaInput == null) {
      this._AVJoiSchemaDefaultMetaInput = JoiUtils.createObjectValidator<IOJoiSchemaDefaultMetaInput>({
        indexed: Core.Joi.bool().default(true),
        nullValueIfUnset: Core.Joi.bool().default(true),
      });
    }

    return this._AVJoiSchemaDefaultMetaInput;
  }
}

export class PebblebedJoiSchema<T> {
  public __isPebblebedJoiSchema = true;
  private schema: Joi.Schema;
  private basicSchemaObject: TPebblebedJoiSchemaObject<T>;
  private defaultMeta: IOJoiSchemaDefaultMetaInput = {
    indexed: true,
    nullValueIfUnset: true,
  };

  constructor(schema: TPebblebedJoiSchemaObject<T>) {
    this.basicSchemaObject = schema;
    this.schema = JoiUtils.createObjectValidator(schema);
  }

  setDefaultMeta(defaultMeta: IOJoiSchemaDefaultMetaInput) {
    /*const validate = Core.Joi.validate(defaultMeta, PebblebedValidations.AVJoiSchemaDefaultMetaInput, {
      allowUnknown: false,
    });*/
    const validate = PebblebedValidations.AVJoiSchemaDefaultMetaInput.validate(defaultMeta, { allowUnknown: false });

    if (validate.error != null) {
      throwError(`Pebblebed: Setting default meta properties for schema failed: ${validate.error.message}`);
    }

    Object.assign(this.defaultMeta, defaultMeta);
    return this;
  }

  __getBasicSchemaObject() {
    return this.basicSchemaObject;
  }

  __getJoiSchema() {
    return this.schema;
  }

  __generateBasicSchema(): SchemaDefinition<T> {
    if (this.schema == null) {
      throwError(`Pebblebed: Can't create a model without a schema defined`);
    }

    const entityProperties = this.schema.describe().keys;
    // const entityDescription = this.schema.describe();

    // console.info(entityDescription);

    let roleIdSet = false;

    const basicSchema = {
      __excludeFromIndexes: [] as string[],
    } as SchemaDefinition<T>;

    for (const property in entityProperties) {
      if (entityProperties.hasOwnProperty(property)) {
        const currentProp: IJoiDescribeObjectProperty = entityProperties[property];

        const propertyExcludeFromIndexes: string[] = [];
        const basicPropertyDefinition: Partial<SchemaPropertyDefinition> = {};

        if (currentProp.flags) {
          if (currentProp.flags.hasOwnProperty("default")) {
            basicPropertyDefinition.default = currentProp.flags.default;
          }

          if (currentProp.flags.presence === "required") {
            basicPropertyDefinition.required = true;
          }
        }

        if (currentProp.metas != null) {
          currentProp.metas.forEach(metaObject => {
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
              } else {
                /*const validate = Core.Joi.validate(
                  metaObject.propertyMeta,
                  PebblebedValidations.AVJoiSchemaPropertyMetaInput,
                  { allowUnknown: false }
                );*/
                const validate = PebblebedValidations.AVJoiSchemaPropertyMetaInput.validate(metaObject.propertyMeta, { allowUnknown: false });

                if (validate.error != null) {
                  throwError(
                    `Pebblebed: Setting schema meta for property (${property}) failed: ${validate.error.message}`
                  );
                }

                const propertyMeta = Object.assign({}, this.defaultMeta, metaObject.propertyMeta);

                if (!propertyMeta.nullValueIfUnset) {
                  basicPropertyDefinition.optional = true;
                }

                if (!propertyMeta.indexed) {
                  basicPropertyDefinition.excludeFromIndexes = true;

                  if (basicPropertyDefinition.type !== "array") {
                    propertyExcludeFromIndexes.push(property);
                  } else {
                    propertyExcludeFromIndexes.push(`${property}[]`);
                    // warn("Pebblebed: The Google Datastore Node.JS library currently does not provide a way to keep arrays excluded from indexes properly. Will be updating as soon as the functionality is available.");
                  }
                }

                if (propertyMeta.reviver) {
                  basicPropertyDefinition.reviver = propertyMeta.reviver;
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
            }
          });
        }

        basicSchema.__excludeFromIndexes = basicSchema.__excludeFromIndexes!.concat(
          propertyExcludeFromIndexes
        );
        basicSchema[property] = basicPropertyDefinition;
      }
    }

    return basicSchema;
  }
}
