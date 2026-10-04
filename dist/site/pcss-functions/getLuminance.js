"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.greyScale = exports.getLuminance = void 0;
const toHsv_1 = require("./toHsv");
const toSRgb_1 = require("./toSRgb");
function getLuminance(color) {
    let [r, g, b] = toSRgb_1.toSRgb(color).map(c => (c > 0.03928
        ? Math.pow(((c + 0.055) / 1.055), 2.4)
        : c / 12.92));
    return (0.2126 * r +
        0.7152 * g +
        0.0722 * b);
}
exports.getLuminance = getLuminance;
const cutoff = 0.03928 / 12.92;
function greyScale(color) {
    let [r, g, b, a] = toSRgb_1.toSRgb(color).map(c => (c > 0.03928
        ? Math.pow(((c + 0.055) / 1.055), 2.4)
        : c / 12.92));
    const lum = (0.4252 * r +
        0.7152 * g +
        0.2888 * b);
    const c = lum > cutoff
        ? Math.pow(lum, (1 / 2.4)) * 1.055 - 0.055
        : lum * 12.92;
    return new toHsv_1.HSVa(0, 0, c, a);
}
exports.greyScale = greyScale;
//# sourceMappingURL=getLuminance.js.map