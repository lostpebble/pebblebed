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
    __getJoiSchema() {
        return this.schema;
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