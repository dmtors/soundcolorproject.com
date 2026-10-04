"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseColor = void 0;
const toHsl_1 = require("./toHsl");
const toSRgb_1 = require("./toSRgb");
const hexDigit = '[0-9a-f]';
const num = '[\-+]?[0-9\.]+';
const color256Rgx = new RegExp(`^#(${hexDigit}{2})(${hexDigit}{2})(${hexDigit}{2})$`, 'i');
const color16Rgx = new RegExp(`^#(${hexDigit})(${hexDigit})(${hexDigit})$`, 'i');
const colorRgbRgx = new RegExp(`^rgb\((${num}), *(${num}), *(${num})\)$`, 'i');
const colorRgbaRgx = new RegExp(`^rgba\((${num}), *(${num}), *(${num}), *(${num})\)$`, 'i');
const colorHslRgx = new RegExp(`^hsl\((${num}), *(${num})%, *(${num})%\)$`, 'i');
const colorHslaRgx = new RegExp(`^hsla\((${num}), *(${num})%, *(${num})%, *(${num})\)$`, 'i');
function parseColor(color) {
    color = color.trim();
    if (color256Rgx.test(color)) {
        const [, r, g, b] = color256Rgx.exec(color).map(c => parseInt(c, 16) / 255);
        return new toSRgb_1.SRGBa(r, g, b);
    }
    else if (color16Rgx.test(color)) {
        const [, r, g, b] = color16Rgx.exec(color).map(c => parseInt(c, 16) / 15);
        return new toSRgb_1.SRGBa(r, g, b);
    }
    else if (colorRgbRgx.test(color)) {
        const [, r, g, b] = colorRgbRgx.exec(color).map(c => parseFloat(c) / 255);
        return new toSRgb_1.SRGBa(r, g, b);
    }
    else if (colorRgbaRgx.test(color)) {
        const [, r, g, b, a] = colorRgbaRgx.exec(color).map(c => parseFloat(c));
        return new toSRgb_1.SRGBa(r / 255, g / 255, b / 255, a);
    }
    else if (colorHslRgx.test(color)) {
        const [, h, s, l] = colorHslRgx.exec(color);
        return new toHsl_1.HSLa(parseFloat(h), parseFloat(s) / 100, parseFloat(l) / 100);
    }
    else if (colorHslaRgx.test(color)) {
        const [, h, s, l, a] = colorHslaRgx.exec(color);
        return new toHsl_1.HSLa(parseFloat(h), parseFloat(s) / 100, parseFloat(l) / 100, parseFloat(a));
    }
    else {
        throw new Error(`Unrecognized color format ${color}`);
    }
}
exports.parseColor = parseColor;
//# sourceMappingURL=parseColor.js.map