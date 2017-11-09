"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Core_1 = require("../Core");
function convertToType(value, type) {
    switch (type) {
        case "string": {
            return value.toString();
        }
        case "int": {
            return Core_1.default.Instance.dsModule.int(value);
        }
        case "double": {
            return Core_1.default.Instance.dsModule.double(value);
        }
        case "datetime": {
            if (Object.prototype.toString.call(value) === "[object Date]") {
                return value;
            }
            else {
                return new Date(value);
            }
        }
        case "geoPoint": {
            if (value && value.value != null) {
                // This is the structure of the GeoPoint object
                return Core_1.default.Instance.dsModule.geoPoint(value.value);
            }
            return Core_1.default.Instance.dsModule.geoPoint(value);
        }
        case "array":
        case "boolean":
        case "object": {
            return value;
        }
        default: {
            return value;
        }
    }
}
exports.default = convertToType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udmVydFRvVHlwZS5qcyIsInNvdXJjZVJvb3QiOiJEOi9EZXYvX1Byb2plY3RzL0dpdGh1Yi9wZWJibGViZWQvc3JjLyIsInNvdXJjZXMiOlsidXRpbGl0eS9jb252ZXJ0VG9UeXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0NBQTJCO0FBRTNCLHVCQUFzQyxLQUFVLEVBQUUsSUFBWTtJQUM1RCxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2IsS0FBSyxRQUFRLEVBQUUsQ0FBQztZQUNkLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDMUIsQ0FBQztRQUNELEtBQUssS0FBSyxFQUFFLENBQUM7WUFDWCxNQUFNLENBQUMsY0FBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNDLENBQUM7UUFDRCxLQUFLLFFBQVEsRUFBRSxDQUFDO1lBQ2QsTUFBTSxDQUFDLGNBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QyxDQUFDO1FBQ0QsS0FBSyxVQUFVLEVBQUUsQ0FBQztZQUNoQixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssZUFBZSxDQUFDLENBQUMsQ0FBQztnQkFDOUQsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNmLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDekIsQ0FBQztRQUNILENBQUM7UUFDRCxLQUFLLFVBQVUsRUFBRSxDQUFDO1lBQ2hCLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLCtDQUErQztnQkFDL0MsTUFBTSxDQUFDLGNBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdEQsQ0FBQztZQUVELE1BQU0sQ0FBQyxjQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEQsQ0FBQztRQUNELEtBQUssT0FBTyxDQUFDO1FBQ2IsS0FBSyxTQUFTLENBQUM7UUFDZixLQUFLLFFBQVEsRUFBRSxDQUFDO1lBQ2QsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNmLENBQUM7UUFDRCxTQUFTLENBQUM7WUFDUixNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2YsQ0FBQztJQUNILENBQUM7QUFDSCxDQUFDO0FBbkNELGdDQW1DQyJ9