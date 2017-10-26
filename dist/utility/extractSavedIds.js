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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0cmFjdFNhdmVkSWRzLmpzIiwic291cmNlUm9vdCI6Ii9ob21lL2xvc3RwZWJibGUvRGV2L290aGVyX3Byb2plY3RzL2dpdGh1Yi9wZWJibGViZWQvc3JjLyIsInNvdXJjZXMiOlsidXRpbGl0eS9leHRyYWN0U2F2ZWRJZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBbUM7QUFFbkMseUJBQXdDLElBQUk7SUFDMUMsTUFBTSxPQUFPLEdBQUcsZ0JBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsaUJBQWlCLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUV4RCxNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFFZixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ1osR0FBRyxDQUFDLENBQUMsTUFBTSxNQUFNLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQztZQUM3QixNQUFNLEtBQUssR0FBRyxnQkFBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDbkQsR0FBRyxDQUFDLElBQUksQ0FBQyxnQkFBRyxDQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDdkQsQ0FBQztJQUNILENBQUM7SUFFRCxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQztJQUUzQixNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQWZELGtDQWVDIn0=