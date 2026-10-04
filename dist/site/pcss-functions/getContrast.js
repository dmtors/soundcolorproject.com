"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContrast = void 0;
const constants_1 = require("./constants");
const getLuminance_1 = require("./getLuminance");
function getContrast(c1, c2) {
    const l1 = getLuminance_1.getLuminance(c1);
    const l2 = getLuminance_1.getLuminance(c2);
    return (Math.max(l1, l2) + constants_1.colorConversion.lumContrastConstant)
        / (Math.min(l1, l2) + constants_1.colorConversion.lumContrastConstant);
}
exports.getContrast = getContrast;
//# sourceMappingURL=getContrast.js.map