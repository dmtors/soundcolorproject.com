"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContrastingColor = void 0;
const calculateCentralLuminance_1 = require("./calculateCentralLuminance");
const constants_1 = require("./constants");
const getLuminance_1 = require("./getLuminance");
const VAR_BLACK = 'var(--black)';
const VAR_WHITE = 'var(--white)';
const TRUE_BLACK = '#000';
const TRUE_WHITE = '#fff';
const VAR_CENTRAL_LUM = calculateCentralLuminance_1.calculateCentralLuminance(constants_1.defaultColors.white, constants_1.defaultColors.black);
function getContrastingColor(color, useTrue = false) {
    const lum = getLuminance_1.getLuminance(color);
    if (useTrue) {
        if (lum < constants_1.colorConversion.centralLum) {
            return TRUE_WHITE;
        }
        else {
            return TRUE_BLACK;
        }
    }
    else {
        if (lum < VAR_CENTRAL_LUM) {
            return VAR_WHITE;
        }
        else {
            return VAR_BLACK;
        }
    }
}
exports.getContrastingColor = getContrastingColor;
//# sourceMappingURL=getContrastingColor.js.map