"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.darken = void 0;
const toHsl_1 = require("./toHsl");
const toHsv_1 = require("./toHsv");
const toRgb_1 = require("./toRgb");
const toSRgb_1 = require("./toSRgb");
function toStandard(color) {
    color = toSRgb_1.toSRgb(color);
    color = new toRgb_1.RGBa(color.r, color.g, color.b, color.a);
    return color;
}
function fromStandard(color) {
    color = toRgb_1.toRgb(color);
    color = toRgb_1.toRgb(new toSRgb_1.SRGBa(color.r, color.g, color.b, color.a));
    return color;
}
function darkenHsv(color, amount, srgbMode) {
    if (typeof color === 'string' || color.type !== 'HSVa') {
        color = toHsv_1.toHsv(color).clone();
    }
    color.v = color.v * (1 - amount);
    if (srgbMode) {
        color = toStandard(color);
    }
    return color;
}
function darkenHsl(color, amount, srgbMode) {
    if (typeof color === 'string' || color.type !== 'HSLa') {
        color = toHsl_1.toHsl(color).clone();
    }
    color.l = color.l * (1 - amount);
    if (srgbMode) {
        color = toStandard(color);
    }
    return color;
}
function darken(color, amount, mode = 'sHSL') {
    if (typeof amount === 'string') {
        amount = parseFloat(amount);
    }
    if (amount >= 1) {
        if (typeof color === 'string') {
            color = toHsv_1.toHsv(color);
        }
        return new toRgb_1.RGBa(0, 0, 0, color.a);
    }
    if (amount <= 0) {
        return color;
    }
    const srgbMode = mode[0] === 's';
    if (srgbMode) {
        color = fromStandard(color);
    }
    switch (mode) {
        case 'HSV':
        case 'sHSV':
            return darkenHsv(color, amount, srgbMode);
        case 'HSL':
        case 'sHSL':
            return darkenHsl(color, amount, srgbMode);
    }
}
exports.darken = darken;
//# sourceMappingURL=darken.js.map