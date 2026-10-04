"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USE_AAA = exports.makeCompliant = void 0;
const logger_1 = require("../../shared/logger");
const constants_1 = require("./constants");
const getContrast_1 = require("./getContrast");
const getContrastingColor_1 = require("./getContrastingColor");
const getLuminance_1 = require("./getLuminance");
const toHsl_1 = require("./toHsl");
function makeCompliant(variableColor, staticColor, useAAA = exports.USE_AAA) {
    const { contrastRatio, minLumOnBlack, maxLumOnWhite } = useAAA ? constants_1.wcag.aaa : constants_1.wcag.aa;
    if (getContrast_1.getContrast(variableColor, staticColor) >= contrastRatio) {
        return variableColor;
    }
    variableColor = toHsl_1.toHsl(variableColor);
    const staticLum = getLuminance_1.getLuminance(staticColor);
    if (minLumOnBlack > staticLum && staticLum > maxLumOnWhite) {
        logger_1.logger.error(`The static color ${staticColor} is strictly non-compliant; will return black or white appropriately`);
        return getContrastingColor_1.getContrastingColor(staticColor);
    }
    else if (staticLum < constants_1.colorConversion.centralLum) {
        while (getContrast_1.getContrast(variableColor, staticColor) < contrastRatio) {
            variableColor.l = Math.min(variableColor.l + 0.01, 1);
        }
    }
    else {
        while (getContrast_1.getContrast(variableColor, staticColor) < contrastRatio) {
            variableColor.l = Math.max(variableColor.l - 0.01, 0);
        }
    }
    return variableColor;
}
exports.makeCompliant = makeCompliant;
exports.USE_AAA = true;
//# sourceMappingURL=makeCompliant.js.map