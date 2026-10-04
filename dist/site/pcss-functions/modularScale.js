"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ms = void 0;
const constants_1 = require("./constants");
const { base, unit, ratio } = constants_1.modularScale;
function ms(factor) {
    if (typeof factor === 'string')
        factor = parseFloat(factor);
    const multiplier = Math.pow(ratio, factor);
    return `${base * multiplier}${unit}`;
}
exports.ms = ms;
//# sourceMappingURL=modularScale.js.map