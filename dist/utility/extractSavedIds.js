"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BasicUtils_1 = require("./BasicUtils");
function extractSavedIds(data) {
    const results = (0, BasicUtils_1.get)(data, [0, "mutationResults"], null);
    const ids = [];
    if (results) {
        for (const result of results) {
            const paths = (0, BasicUtils_1.get)(result, ["key", "path"], [null]);
            ids.push((0, BasicUtils_1.get)(paths, [paths.length - 1, "id"], null));
        }
    }
    data[0].generatedIds = ids;
    return data;
}
exports.default = extractSavedIds;
//# sourceMappingURL=extractSavedIds.js.map