"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Messaging_1 = require("../Messaging");
function extractAncestorPaths(model, ...args) {
    let ancestors = [];
    for (let i = 0; i < args.length; i += 2) {
        if (typeof args[i] === "string") {
            ancestors.push([args[i], args[i + 1]]);
        }
        else if (typeof args[i].entityKind === "string") {
            ancestors.push([args[i].entityKind, args[i + 1]]);
        }
        else {
            (0, Messaging_1.throwError)(Messaging_1.CreateMessage.INCORRECT_ANCESTOR_KIND(model));
        }
    }
    return ancestors;
}
exports.default = extractAncestorPaths;
//# sourceMappingURL=extractAncestorPaths.js.map