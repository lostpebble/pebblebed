"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Core_1 = require("../Core");
const Messaging_1 = require("../Messaging");
function checkDatastore(operation) {
    if (Core_1.default.Instance.ds == null) {
        Messaging_1.throwError("Datastore has not been connected to Pebblebed");
    }
}
exports.default = checkDatastore;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tEYXRhc3RvcmUuanMiLCJzb3VyY2VSb290IjoiRDovRGV2L19Qcm9qZWN0cy9HaXRodWIvcGViYmxlYmVkL3NyYy8iLCJzb3VyY2VzIjpbInV0aWxpdHkvY2hlY2tEYXRhc3RvcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxrQ0FBMkI7QUFDM0IsNENBQTBDO0FBRTFDLHdCQUF1QyxTQUFpQjtJQUN0RCxFQUFFLENBQUMsQ0FBQyxjQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzdCLHNCQUFVLENBQUMsK0NBQStDLENBQUMsQ0FBQztJQUM5RCxDQUFDO0FBQ0gsQ0FBQztBQUpELGlDQUlDIn0=