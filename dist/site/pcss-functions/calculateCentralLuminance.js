"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateCentralLuminance = void 0;
const constants_1 = require("./constants");
const getLuminance_1 = require("./getLuminance");
function calculateCentralLuminance(white, black) {
    const whiteLum = getLuminance_1.getLuminance(white);
    const blackLum = getLuminance_1.getLuminance(black);
    const c = constants_1.colorConversion.lumContrastConstant;
    return Math.sqrt((whiteLum + c) * (blackLum + c)) - c;
}
exports.calculateCentralLuminance = calculateCentralLuminance;
//# sourceMappingURL=calculateCentralLuminance.js.map