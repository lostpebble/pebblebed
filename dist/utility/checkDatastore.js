"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Core_1 = require("../Core");
function checkDatastore(operation) {
    if (Core_1.default.Instance.ds == null) {
        throw new Error("Datastore has not been connected to Pebblebed");
    }
}
exports.default = checkDatastore;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tEYXRhc3RvcmUuanMiLCJzb3VyY2VSb290IjoiL2hvbWUvbG9zdHBlYmJsZS9EZXYvb3RoZXJfcHJvamVjdHMvZ2l0aHViL3BlYmJsZWJlZC9zcmMvIiwic291cmNlcyI6WyJ1dGlsaXR5L2NoZWNrRGF0YXN0b3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0NBQTJCO0FBRTNCLHdCQUF1QyxTQUFpQjtJQUN0RCxFQUFFLENBQUMsQ0FBQyxjQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzdCLE1BQU0sSUFBSSxLQUFLLENBQUMsK0NBQStDLENBQUMsQ0FBQztJQUNuRSxDQUFDO0FBQ0gsQ0FBQztBQUpELGlDQUlDIn0=