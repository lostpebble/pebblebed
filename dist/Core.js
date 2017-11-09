"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Messaging_1 = require("./Messaging");
class Core {
    constructor() {
        this.namespace = null;
        this.isProductionEnv = process.env.NODE_ENV === "production";
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
    setDatastore(datastore) {
        this.ds = datastore;
    }
    setNamespace(namespace) {
        this.namespace = namespace;
    }
}
exports.default = Core;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29yZS5qcyIsInNvdXJjZVJvb3QiOiJEOi9EZXYvX1Byb2plY3RzL0dpdGh1Yi9wZWJibGViZWQvc3JjLyIsInNvdXJjZXMiOlsiQ29yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJDQUF3RDtBQUV4RDtJQVFFO1FBSE8sY0FBUyxHQUFXLElBQUksQ0FBQztRQUN6QixvQkFBZSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxLQUFLLFlBQVksQ0FBQztRQUc3RCxJQUFJLENBQUM7WUFDSCxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBQ3JELENBQUM7UUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1gsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xDLHNCQUFVLENBQUMseUJBQWEsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1lBQ3ZELENBQUM7WUFFRCxNQUFNLENBQUMsQ0FBQztRQUNWLENBQUM7SUFDSCxDQUFDO0lBRU0sTUFBTSxLQUFLLFFBQVE7UUFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRU0sWUFBWSxDQUFDLFNBQVM7UUFDM0IsSUFBSSxDQUFDLEVBQUUsR0FBRyxTQUFTLENBQUM7SUFDdEIsQ0FBQztJQUVNLFlBQVksQ0FBQyxTQUFpQjtRQUNuQyxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUM3QixDQUFDO0NBQ0Y7QUEvQkQsdUJBK0JDIn0=