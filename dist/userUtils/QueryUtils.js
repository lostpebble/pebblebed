"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryUtils = void 0;
const Core_1 = require("../Core");
function paginateThroughQuery(query, runOnResults) {
    return __awaiter(this, void 0, void 0, function* () {
        let more = true;
        let cursor = null;
        let nextLimit = undefined;
        let total = 0;
        while (more) {
            if (cursor != null) {
                query = query.start(cursor);
            }
            if (nextLimit != null) {
                query.limit(nextLimit);
            }
            const { entities, info } = yield query.run();
            if (info.moreResults !== Core_1.default.Instance.dsModule.NO_MORE_RESULTS) {
                cursor = info.endCursor;
            }
            else {
                more = false;
            }
            total += entities.length;
            const runAgain = (yield runOnResults(entities, total));
            if (runAgain != null) {
                nextLimit = runAgain.nextLimit;
                const { continueQuery = true } = runAgain;
                if (!continueQuery) {
                    more = false;
                }
            }
        }
        return { total };
    });
}
exports.QueryUtils = {
    paginateThroughQuery,
};
//# sourceMappingURL=QueryUtils.js.map