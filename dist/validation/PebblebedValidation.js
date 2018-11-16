"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JoiUtils_1 = require("../utility/JoiUtils");
const Messaging_1 = require("../Messaging");
const Core_1 = require("../Core");
class PebblebedValidations {
    static get AVJoiSchemaPropertyMetaInput() {
        if (this._AVJoiSchemaPropertyMetaInput == null) {
            this._AVJoiSchemaPropertyMetaInput = JoiUtils_1.JoiUtils.createObjectValidator({
                required: Core_1.default.Joi.bool().default(false),
                indexed: Core_1.default.Joi.bool().default(true),
                reviver: Core_1.default.Joi.func().default(null),
                joiSchema: Core_1.default.Joi.any().default(null),
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
    constructor(schema) {
        this.__isPebblebedJoiSchema = true;
        this.defaultMeta = {
            indexed: true,
            nullValueIfUnset: true,
        };
        this.basicSchemaObject = schema;
        this.schema = JoiUtils_1.JoiUtils.createObjectValidator(schema);
    }
    setDefaultMeta(defaultMeta) {
        const validate = Core_1.default.Joi.validate(defaultMeta, PebblebedValidations.AVJoiSchemaDefaultMetaInput, { allowUnknown: false });
        if (validate.error != null) {
            Messaging_1.throwError(`Pebblebed: Setting default meta properties for schema failed: ${validate.error}`);
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
    __generateBasicSchema() {
        if (this.schema == null) {
            Messaging_1.throwError(`Pebblebed: Can't create a model without a schema defined`);
        }
        const entityProperties = this.schema.describe().children;
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
                    if (currentProp.flags.hasOwnProperty("default")) {
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
                            else {
                                const validate = Core_1.default.Joi.validate(metaObject.propertyMeta, PebblebedValidations.AVJoiSchemaPropertyMetaInput, { allowUnknown: false });
                                if (validate.error != null) {
                                    Messaging_1.throwError(`Pebblebed: Setting schema meta for property (${property}) failed: ${validate.error}`);
                                }
                                const propertyMeta = Object.assign({}, this.defaultMeta, metaObject.propertyMeta);
                                if (!propertyMeta.nullValueIfUnset) {
                                    basicPropertyDefinition.optional = true;
                                }
                                if (!propertyMeta.indexed) {
                                    basicPropertyDefinition.excludeFromIndexes = true;
                                    if (basicPropertyDefinition.type !== "array") {
                                        propertyExcludeFromIndexes.push(property);
                                    }
                                    else {
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
                basicSchema.__excludeFromIndexes = basicSchema.__excludeFromIndexes.concat(propertyExcludeFromIndexes);
                basicSchema[property] = basicPropertyDefinition;
            }
        }
        return basicSchema;
    }
}
exports.PebblebedJoiSchema = PebblebedJoiSchema;
//# sourceMappingURL=PebblebedValidation.js.map