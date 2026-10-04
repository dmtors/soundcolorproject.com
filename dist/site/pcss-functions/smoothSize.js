"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smoothSize = void 0;
function smoothSize(lowSize, highSize, startAt, endAt) {
    return `calc(${lowSize}px + (100vw - ${startAt}px) / ((${endAt} - ${startAt}) / (${highSize} - ${lowSize})))`;
}
exports.smoothSize = smoothSize;
//# sourceMappingURL=smoothSize.js.map