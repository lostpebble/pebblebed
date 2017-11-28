"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JoiUtils_1 = require("../utility/JoiUtils");
const Messaging_1 = require("../Messaging");
const util = require("util");
const Core_1 = require("../Core");
class PebblebedValidations {
    static get AVJoiSchemaPropertyMetaInput() {
        if (this._AVJoiSchemaPropertyMetaInput == null) {
            this._AVJoiSchemaPropertyMetaInput = JoiUtils_1.JoiUtils.createObjectValidator({
                indexed: Core_1.default.Joi.bool().default(true),
                role: Core_1.default.Joi.string().valid(["id"]),
                onSave: Core_1.default.Joi.func(),
                nullValueIfUnset: Core_1.default.Joi.bool().default(true),
            });
        }
        return this._AVJoiSchemaPropertyMetaInput;
    }
    static get AVJoiSchemaDefaultMetaInput() {
        if (this._AVJoiSchemaDefaultMetaInput == null) {
            this._AVJoiSchemaDefaultMetaInput = JoiUtils_1.JoiUtils.createObjectValidator({
                indexed: Core_1.default.Joi.bool().default(true),
            });
        }
        return this._AVJoiSchemaDefaultMetaInput;
    }
}
PebblebedValidations._AVJoiSchemaPropertyMetaInput = null;
PebblebedValidations._AVJoiSchemaDefaultMetaInput = null;
class PebblebedJoiSchema {
    constructor() {
        this.__isPebblebedJoiSchema = true;
        this.schema = null;
        this.defaultMeta = {
            indexed: true,
            nullValueIfUnset: true,
        };
    }
    setDefaultMeta(defaultMeta) {
        const validate = Core_1.default.Joi.validate(defaultMeta, PebblebedValidations.AVJoiSchemaDefaultMetaInput, { allowUnknown: false });
        if (validate.error != null) {
            Messaging_1.throwError(`Pebblebed: Setting default meta properties for schema failed: ${validate.error}`);
        }
        this.defaultMeta = defaultMeta;
        return this;
    }
    setSchema(schema) {
        this.schema = JoiUtils_1.JoiUtils.createObjectValidator(schema);
        return this;
    }
    __generateBasicSchema() {
        if (this.schema == null) {
            Messaging_1.throwError(`Pebblebed: Can't create a model without a schema defined`);
        }
        const entityProperties = this.schema.describe().children;
        console.log(util.inspect(entityProperties, { depth: 4 }));
        let roleIdSet = false;
        const basicSchema = {
            __excludeFromIndexes: [],
        };
        for (const property in entityProperties) {
            if (entityProperties.hasOwnProperty(property)) {
                console.log(`Got property ${property}`, entityProperties[property]);
                const currentProp = entityProperties[property];
                const propertyExcludeFromIndexes = [];
                const basicPropertyDefinition = {};
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
                                }
                                else {
                                    Messaging_1.throwError(`Pebblebed: Can't set two properties with the role of ID in schema. Found second ID defined in property: ${property}`);
                                }
                            }
                        }
                        else {
                            const validate = Core_1.default.Joi.validate(metaObject, PebblebedValidations.AVJoiSchemaPropertyMetaInput, { allowUnknown: false });
                            if (validate.error != null) {
                                Messaging_1.throwError(`Pebblebed: Setting schema meta for property (${property}) failed: ${validate.error}`);
                            }
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
        return basicSchema;
    }
}
exports.PebblebedJoiSchema = PebblebedJoiSchema;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGViYmxlYmVkVmFsaWRhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiJEOi9EZXYvX1Byb2plY3RzL0dpdGh1Yi9wZWJibGViZWQvc3JjLyIsInNvdXJjZXMiOlsidmFsaWRhdGlvbi9QZWJibGViZWRWYWxpZGF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQW9FO0FBRXBFLDRDQUEwQztBQU8xQyw2QkFBNkI7QUFDN0Isa0NBQTJCO0FBRTNCO0lBSUUsTUFBTSxLQUFLLDRCQUE0QjtRQUNyQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsNkJBQTZCLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMvQyxJQUFJLENBQUMsNkJBQTZCLEdBQUcsbUJBQVEsQ0FBQyxxQkFBcUIsQ0FBK0I7Z0JBQ2hHLE9BQU8sRUFBRSxjQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7Z0JBQ3RDLElBQUksRUFBRSxjQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNyQyxNQUFNLEVBQUUsY0FBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7Z0JBQ3ZCLGdCQUFnQixFQUFFLGNBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQzthQUNoRCxDQUFDLENBQUM7UUFDTCxDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyw2QkFBNkIsQ0FBQztJQUM1QyxDQUFDO0lBRUQsTUFBTSxLQUFLLDJCQUEyQjtRQUNwQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsNEJBQTRCLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUM5QyxJQUFJLENBQUMsNEJBQTRCLEdBQUcsbUJBQVEsQ0FBQyxxQkFBcUIsQ0FBOEI7Z0JBQzlGLE9BQU8sRUFBRSxjQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxD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