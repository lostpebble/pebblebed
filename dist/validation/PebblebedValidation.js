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
        this.defaultMeta = {};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGViYmxlYmVkVmFsaWRhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiJEOi9EZXYvX1Byb2plY3RzL0dpdGh1Yi9wZWJibGViZWQvc3JjLyIsInNvdXJjZXMiOlsidmFsaWRhdGlvbi9QZWJibGViZWRWYWxpZGF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkJBQTJCO0FBQzNCLGtEQUFrRTtBQUVsRSw0Q0FBd0M7QUFLeEMsNkJBQTZCO0FBRWhCLFFBQUEsNEJBQTRCLEdBQUcsbUJBQVEsQ0FBQyxxQkFBcUIsQ0FBK0I7SUFDdkcsT0FBTyxFQUFFLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO0lBQ2pDLElBQUksRUFBRSxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxJQUFJLEVBQUU7Q0FDbkIsQ0FBQyxDQUFDO0FBRVUsUUFBQSwyQkFBMkIsR0FBRyxtQkFBUSxDQUFDLHFCQUFxQixDQUE4QjtJQUNyRyxPQUFPLEVBQUUsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7Q0FDbEMsQ0FBQyxDQUFDO0FBRUg7SUFLRTtRQUpPLDJCQUFzQixHQUFHLElBQUksQ0FBQztRQUM3QixXQUFNLEdBQWUsSUFBSSxDQUFDO1FBQzFCLGdCQUFXLEdBQWdDLEVBQUUsQ0FBQztJQUV2QyxDQUFDO0lBRWhCLGNBQWMsQ0FBQyxXQUF3QztRQUNyRCxNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxtQ0FBMkIsQ0FBQyxDQUFDO1FBRXhFLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMzQixzQkFBVSxDQUFDLGlFQUFpRSxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUNoRyxDQUFDO1FBRUQsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxTQUFTLENBQUMsTUFBOEI7UUFDdEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxtQkFBUSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBRUgscUJBQXFCO1FBQ25CLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN4QixzQkFBVSxDQUFDLDBEQUEwRCxDQUFDLENBQUM7UUFDekUsQ0FBQztRQUVELE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUVoRCxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUU7WUFDekMsS0FBSyxFQUFFLENBQUM7U0FDVCxDQUFDLENBQUMsQ0FBQztRQUVKLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQztRQUV0QixHQUFHLENBQUMsQ0FBQyxNQUFNLFFBQVEsSUFBSyxnQkFBdUMsQ0FBQyxDQUFDLENBQUM7WUFDaEUsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BDLE1BQU0sV0FBVyxHQUErQixnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFFM0UsTUFBTSxtQkFBbUIsR0FBc0MsRUFBRSxDQUFDO2dCQUVsRSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQzdCLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVTt3QkFDbEMsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQzs0QkFDaEMsbUJBQW1CLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUM7NEJBRTNDLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLElBQUksSUFBSSxtQkFBbUIsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztnQ0FDbEUsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO29DQUNmLG1CQUFtQixDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7b0NBQ2hDLFNBQVMsR0FBRyxJQUFJLENBQUM7Z0NBQ25CLENBQUM7Z0NBQUMsSUFBSSxDQUFDLENBQUM7b0NBQ04sc0JBQVUsQ0FBQywyR0FBMkcsUUFBUSxFQUFFLENBQUMsQ0FBQztnQ0FDcEksQ0FBQzs0QkFDSCxDQUFDO3dCQUNILENBQUM7b0JBQ0gsQ0FBQyxDQUFDLENBQUE7Z0JBQ0osQ0FBQztZQUdILENBQUM7UUFDSCxDQUFDO1FBRUQsTUFBTSxDQUFDO1lBQ0wsb0JBQW9CLEVBQUUsRUFBRTtTQUNGLENBQUM7SUFDM0IsQ0FBQztDQUNGO0FBM0VELGdEQTJFQyJ9