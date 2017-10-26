"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorMessages_1 = require("./ErrorMessages");
class Core {
    constructor() {
        this.namespace = null;
        try {
            this.dsModule = require("@google-cloud/datastore");
        }
        catch (e) {
            if (e.code === "MODULE_NOT_FOUND") {
                throw new Error(ErrorMessages_1.default.NO_GOOGLE_CLOUD_DEPENDENCY);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29yZS5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS9sb3N0cGViYmxlL0Rldi9vdGhlcl9wcm9qZWN0cy9naXRodWIvcGViYmxlYmVkL3NyYy8iLCJzb3VyY2VzIjpbIkNvcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtREFBNEM7QUFFNUM7SUFPRTtRQUZPLGNBQVMsR0FBVyxJQUFJLENBQUM7UUFHOUIsSUFBSSxDQUFDO1lBQ0gsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztRQUNyRCxDQUFDO1FBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNYLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssa0JBQWtCLENBQUMsQ0FBQyxDQUFDO2dCQUNsQyxNQUFNLElBQUksS0FBSyxDQUFDLHVCQUFhLENBQUMsMEJBQTBCLENBQUMsQ0FBQztZQUM1RCxDQUFDO1lBRUQsTUFBTSxDQUFDLENBQUM7UUFDVixDQUFDO0lBQ0gsQ0FBQztJQUVNLE1BQU0sS0FBSyxRQUFRO1FBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVNLFlBQVksQ0FBQyxTQUFTO1FBQzNCLElBQUksQ0FBQyxFQUFFLEdBQUcsU0FBUyxDQUFDO0lBQ3RCLENBQUM7SUFFTSxZQUFZLENBQUMsU0FBaUI7UUFDbkMsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDN0IsQ0FBQztDQUNGO0FBOUJELHVCQThCQyJ9