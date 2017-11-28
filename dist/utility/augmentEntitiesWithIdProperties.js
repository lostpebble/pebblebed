"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Core_1 = require("../Core");
const Messaging_1 = require("../Messaging");
function augmentEntitiesWithIdProperties(respArray, idProperty, type, kind) {
    for (const entity of respArray) {
        if (entity[Object.getOwnPropertySymbols(entity)[0]].hasOwnProperty("id")) {
            if (type === "int") {
                entity[idProperty] = entity[Core_1.default.Instance.dsModule.KEY].id;
            }
            else {
                Messaging_1.warn(Messaging_1.CreateMessage.LOAD_QUERY_DATA_ID_TYPE_ERROR(kind, "int", "string", idProperty, entity[Core_1.default.Instance.dsModule.KEY].id));
            }
        }
        if (entity[Core_1.default.Instance.dsModule.KEY].hasOwnProperty("name")) {
            if (type === "string") {
                entity[idProperty] = entity[Core_1.default.Instance.dsModule.KEY].name;
            }
            else {
                Messaging_1.warn(Messaging_1.CreateMessage.LOAD_QUERY_DATA_ID_TYPE_ERROR(kind, "string", "int", idProperty, entity[Core_1.default.Instance.dsModule.KEY].name));
            }
        }
    }
}
exports.default = augmentEntitiesWithIdProperties;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXVnbWVudEVudGl0aWVzV2l0aElkUHJvcGVydGllcy5qcyIsInNvdXJjZVJvb3QiOiJEOi9EZXYvX1Byb2plY3RzL0dpdGh1Yi9wZWJibGViZWQvc3JjLyIsInNvdXJjZXMiOlsidXRpbGl0eS9hdWdtZW50RW50aXRpZXNXaXRoSWRQcm9wZXJ0aWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0NBQTJCO0FBQzNCLDRDQUFtRDtBQUVuRCx5Q0FDRSxTQUFnQixFQUNoQixVQUFrQixFQUNsQixJQUFZLEVBQ1osSUFBWTtJQUVaLEdBQUcsQ0FBQyxDQUFDLE1BQU0sTUFBTSxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDL0IsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekUsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxNQUFNLENBQUMsY0FBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQzdELENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixnQkFBSSxDQUNGLHlCQUFhLENBQUMsNkJBQTZCLENBQ3pDLElBQUksRUFDSixLQUFLLEVBQ0wsUUFBUSxFQUNSLFVBQVUsRUFDVixNQUFNLENBQUMsY0FBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUN0QyxDQUNGLENBQUM7WUFDSixDQUFDO1FBQ0gsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlELEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsTUFBTSxDQUFDLGNBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUMvRCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sZ0JBQUksQ0FDRix5QkFBYSxDQUFDLDZCQUE2QixDQUN6QyxJQUFJLEVBQ0osUUFBUSxFQUNSLEtBQUssRUFDTCxVQUFVLEVBQ1YsTUFBTSxDQUFDLGNBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FDeEMsQ0FDRixDQUFDO1lBQ0osQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0FBQ0gsQ0FBQztBQXZDRCxrREF1Q0MifQ==