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
        console.log(util.inspect(this.schema.describe(), {
            depth: 4,
        }));
        return {
            __excludeFromIndexes: [],
        };
    }
}
exports.PebblebedJoiSchema = PebblebedJoiSchema;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGViYmxlYmVkVmFsaWRhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiJEOi9EZXYvX1Byb2plY3RzL0dpdGh1Yi9wZWJibGViZWQvc3JjLyIsInNvdXJjZXMiOlsidmFsaWRhdGlvbi9QZWJibGViZWRWYWxpZGF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkJBQTJCO0FBQzNCLGtEQUFrRTtBQUVsRSw0Q0FBd0M7QUFFeEMsNkJBQTZCO0FBRWhCLFFBQUEsNEJBQTRCLEdBQUcsbUJBQVEsQ0FBQyxxQkFBcUIsQ0FBK0I7SUFDdkcsT0FBTyxFQUFFLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO0lBQ2pDLElBQUksRUFBRSxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxJQUFJLEVBQUU7Q0FDbkIsQ0FBQyxDQUFDO0FBRVUsUUFBQSwyQkFBMkIsR0FBRyxtQkFBUSxDQUFDLHFCQUFxQixDQUE4QjtJQUNyRyxPQUFPLEVBQUUsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7Q0FDbEMsQ0FBQyxDQUFDO0FBRUg7SUFLRTtRQUpPLDJCQUFzQixHQUFHLElBQUksQ0FBQztRQUM3QixXQUFNLEdBQWUsSUFBSSxDQUFDO1FBQzFCLGdCQUFXLEdBQWdDLEVBQUUsQ0FBQztJQUV2QyxDQUFDO0lBRWhCLGNBQWMsQ0FBQyxXQUF3QztRQUNyRCxNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxtQ0FBMkIsQ0FBQyxDQUFDO1FBRXhFLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMzQixzQkFBVSxDQUFDLGlFQUFpRSxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUNoRyxDQUFDO1FBRUQsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxTQUFTLENBQUMsTUFBOEI7UUFDdEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxtQkFBUSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBRUgscUJBQXFCO1FBQ25CLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN4QixzQkFBVSxDQUFDLDBEQUEwRCxDQUFDLENBQUM7UUFDekUsQ0FBQztRQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxFQUFFO1lBQy9DLEtBQUssRUFBRSxDQUFDO1NBQ1QsQ0FBQyxDQUFDLENBQUM7UUFFSixNQUFNLENBQUM7WUFDTCxvQkFBb0IsRUFBRSxFQUFFO1NBQ0YsQ0FBQztJQUMzQixDQUFDO0NBQ0Y7QUE1Q0QsZ0RBNENDIn0=