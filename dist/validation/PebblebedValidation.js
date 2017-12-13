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
                nullValueIfUnset: Core_1.default.Joi.bool().default(true),
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
        Object.assign(this.defaultMeta, defaultMeta);
        return this;
    }
    setSchema(schema) {
        this.schema = JoiUtils_1.JoiUtils.createObjectValidator(schema);
        return this;
    }
    __getJoiSchema() {
        return this.schema;
    }
    __generateBasicSchema() {
        if (this.schema == null) {
            Messaging_1.throwError(`Pebblebed: Can't create a model without a schema defined`);
        }
        const entityProperties = this.schema.describe().children;
        // console.log(util.inspect(entityProperties, { depth: 4 }));
        let roleIdSet = false;
        const basicSchema = {
            __excludeFromIndexes: [],
        };
        for (const property in entityProperties) {
            if (entityProperties.hasOwnProperty(property)) {
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