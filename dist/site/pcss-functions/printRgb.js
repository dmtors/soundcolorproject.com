"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printRgb = void 0;
const numbers_1 = require("../helpers/numbers");
const toRgb_1 = require("./toRgb");
function printRgb(color) {
    const srgb = toRgb_1.toRgb(color);
    const R = numbers_1.printDigits(srgb.r * 255, 1);
    const G = numbers_1.printDigits(srgb.g * 255, 1);
    const B = numbers_1.printDigits(srgb.b * 255, 1);
    return `${R}, ${G}, ${B}`;
}
exports.printRgb = printRgb;
//# sourceMappingURL=printRgb.js.map