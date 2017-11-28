"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Messaging_1 = require("./Messaging");
class Core {
    constructor() {
        this.namespace = null;
        this.isProductionEnv = process.env.NODE_ENV === "production";
        this.validations = true;
        try {
            this.dsModule = require("@google-cloud/datastore");
        }
        catch (e) {
            if (e.code === "MODULE_NOT_FOUND") {
                Messaging_1.throwError(Messaging_1.CreateMessage.NO_GOOGLE_CLOUD_DEPENDENCY);
            }
            throw e;
        }
    }
    static get Instance() {
        return this._instance || (this._instance = new this());
    }
    static get Joi() {
        try {
            return require("joi");
        }
        catch (e) {
            if (e.code === "MODULE_NOT_FOUND") {
                Messaging_1.throwError(`Pebblebed: Using new schema syntax, Joi needs to be added as a dependency to your project.`);
            }
            throw e;
        }
    }
    setDatastore(datastore) {
        this.ds = datastore;
    }
    setNamespace(namespace) {
        this.namespace = namespace;
    }
    setValidations(on) {
        this.validations = on;
    }
}
exports.default = Core;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29yZS5qcyIsInNvdXJjZVJvb3QiOiJEOi9EZXYvX1Byb2plY3RzL0dpdGh1Yi9wZWJibGViZWQvc3JjLyIsInNvdXJjZXMiOlsiQ29yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJDQUF3RDtBQUV4RDtJQVNFO1FBSk8sY0FBUyxHQUFXLElBQUksQ0FBQztRQUN6QixvQkFBZSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxLQUFLLFlBQVksQ0FBQztRQUN4RCxnQkFBVyxHQUFHLElBQUksQ0FBQztRQUd4QixJQUFJLENBQUM7WUFDSCxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBQ3JELENBQUM7UUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1gsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xDLHNCQUFVLENBQUMseUJBQWEsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1lBQ3ZELENBQUM7WUFFRCxNQUFNLENBQUMsQ0FBQztRQUNWLENBQUM7SUFDSCxDQUFDO0lBRU0sTUFBTSxLQUFLLFFBQVE7UUFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRU0sTUFBTSxLQUFLLEdBQUc7UUFDbkIsSUFBSSxDQUFDO1lBQ0gsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4QixDQUFDO1FBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNYLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssa0JBQWtCLENBQUMsQ0FBQyxDQUFDO2dCQUNsQyxzQkFBVSxDQUNSLDRGQUE0RixDQUM3RixDQUFDO1lBQ0osQ0FBQztZQUVELE1BQU0sQ0FBQyxDQUFDO1FBQ1YsQ0FBQztJQUNILENBQUM7SUFFTSxZQUFZLENBQUMsU0FBUztRQUMzQixJQUFJLENBQUMsRUFBRSxHQUFHLFNBQVMsQ0FBQztJQUN0QixDQUFDO0lBRU0sWUFBWSxDQUFDLFNBQWlCO1FBQ25DLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQzdCLENBQUM7SUFFTSxjQUFjLENBQUMsRUFBVztRQUMvQixJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztJQUN4QixDQUFDO0NBQ0Y7QUFsREQsdUJBa0RDIn0=