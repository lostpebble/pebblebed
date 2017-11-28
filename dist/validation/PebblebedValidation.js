"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const JoiUtils_1 = require("../utility/JoiUtils");
const Messaging_1 = require("../Messaging");
const util = require("util");
exports.AVJoiSchemaPropertyMetaInput = JoiUtils_1.JoiUtils.createObjectValidator({
    indexed: Joi.bool().default(true),
    role: Joi.string().valid(["id"]),
    onSave: Joi.func(),
});
exports.AVJoiSchemaDefaultMetaInput = JoiUtils_1.JoiUtils.createObjectValidator({
    indexed: Joi.bool().default(true),
});
class PebblebedJoiSchema {
    constructor() {
        this.__isPebblebedJoiSchema = true;
        this.schema = null;
        this.defaultMeta = {
            indexed: true,
        };
    }
    setDefaultMeta(defaultMeta) {
        const validate = Joi.validate(defaultMeta, exports.AVJoiSchemaDefaultMetaInput);
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
    /*__getSchema(): Joi.Schema {
      return this.schema;
    }
  
    __getDefaultMeta(): IOJoiSchemaDefaultMetaInput {
      return this.defaultMeta;
    }*/
    __generateBasicSchema() {
        if (this.schema == null) {
            Messaging_1.throwError(`Pebblebed: Can't create a model without a schema defined`);
        }
        const entityProperties = this.schema.describe();
        console.log(util.inspect(entityProperties, {
            depth: 4,
        }));
        let roleIdSet = false;
        const excludeFromIndexesMap = {};
        for (const property in entityProperties) {
            if (Object.hasOwnProperty(property)) {
                const currentProp = entityProperties[property];
                const basicTypeDefinition = {};
                if (currentProp.meta != null) {
                    currentProp.meta.forEach((metaObject) => {
                        if (metaObject.__typeDefinition) {
                            basicTypeDefinition.type = metaObject.type;
                            if (basicTypeDefinition.role && basicTypeDefinition.role === "id") {
                                if (!roleIdSet) {
                                    basicTypeDefinition.role = "id";
                                    roleIdSet = true;
                                }
                                else {
                                    Messaging_1.throwError(`Pebblebed: Can't set two properties with the role of ID in schema. Found second ID defined in property: ${property}`);
                                }
                            }
                        }
                        else {
                            const propertyMeta = Object.assign({}, this.defaultMeta, metaObject);
                            if (!propertyMeta.indexed) {
                                basicTypeDefinition.excludeFromIndexes = true;
                            }
                        }
                    });
                }
            }
        }
        return {
            __excludeFromIndexes: [],
        };
    }
}
exports.PebblebedJoiSchema = PebblebedJoiSchema;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGViYmxlYmVkVmFsaWRhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiJEOi9EZXYvX1Byb2plY3RzL0dpdGh1Yi9wZWJibGViZWQvc3JjLyIsInNvdXJjZXMiOlsidmFsaWRhdGlvbi9QZWJibGViZWRWYWxpZGF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkJBQTJCO0FBQzNCLGtEQUFrRTtBQUVsRSw0Q0FBd0M7QUFLeEMsNkJBQTZCO0FBRWhCLFFBQUEsNEJBQTRCLEdBQUcsbUJBQVEsQ0FBQyxxQkFBcUIsQ0FBK0I7SUFDdkcsT0FBTyxFQUFFLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO0lBQ2pDLElBQUksRUFBRSxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxJQUFJLEVBQUU7Q0FDbkIsQ0FBQyxDQUFDO0FBRVUsUUFBQSwyQkFBMkIsR0FBRyxtQkFBUSxDQUFDLHFCQUFxQixDQUE4QjtJQUNyRyxPQUFPLEVBQUUsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7Q0FDbEMsQ0FBQyxDQUFDO0FBRUg7SUFPRTtRQU5PLDJCQUFzQixHQUFHLElBQUksQ0FBQztRQUM3QixXQUFNLEdBQWUsSUFBSSxDQUFDO1FBQzFCLGdCQUFXLEdBQWdDO1lBQ2pELE9BQU8sRUFBRSxJQUFJO1NBQ2QsQ0FBQztJQUVhLENBQUM7SUFFaEIsY0FBYyxDQUFDLFdBQXdDO1FBQ3JELE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLG1DQUEyQixDQUFDLENBQUM7UUFFeEUsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzNCLHNCQUFVLENBQUMsaUVBQWlFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxD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