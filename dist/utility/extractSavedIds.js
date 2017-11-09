"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BasicUtils_1 = require("./BasicUtils");
function extractSavedIds(data) {
    const results = BasicUtils_1.get(data, [0, "mutationResults"], null);
    const ids = [];
    if (results) {
        for (const result of results) {
            const paths = BasicUtils_1.get(result, ["key", "path"], [null]);
            ids.push(BasicUtils_1.get(paths, [paths.length - 1, "id"], null));
        }
    }
    data[0].generatedIds = ids;
    return data;
}
exports.default = extractSavedIds;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0cmFjdFNhdmVkSWRzLmpzIiwic291cmNlUm9vdCI6IkQ6L0Rldi9fUHJvamVjdHMvR2l0aHViL3BlYmJsZWJlZC9zcmMvIiwic291cmNlcyI6WyJ1dGlsaXR5L2V4dHJhY3RTYXZlZElkcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZDQUFtQztBQUVuQyx5QkFBd0MsSUFBSTtJQUMxQyxNQUFNLE9BQU8sR0FBRyxnQkFBRyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxpQkFBaUIsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBRXhELE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUVmLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDWixHQUFHLENBQUMsQ0FBQyxNQUFNLE1BQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQzdCLE1BQU0sS0FBSyxHQUFHLGdCQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNuRCxHQUFHLENBQUMsSUFBSSxDQUFDLGdCQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUN2RCxDQUFDO0lBQ0gsQ0FBQztJQUVELElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLEdBQUcsR0FBRyxDQUFDO0lBRTNCLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBZkQsa0NBZUMifQ==