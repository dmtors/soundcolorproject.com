"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USE_HSL = exports.HSLa = exports.toHsl = void 0;
const numbers_1 = require("../helpers/numbers");
const parseColor_1 = require("./parseColor");
const toSRgb_1 = require("./toSRgb");
function toHsl(color) {
    if (typeof color === 'string') {
        color = parseColor_1.parseColor(color);
    }
    if (color.type === 'HSLa') {
        return color;
    }
    return HSLa.fromSRgb(toSRgb_1.toSRgb(color));
}
exports.toHsl = toHsl;
class HSLa {
    constructor(h, s, l, a = 1) {
        this.h = h;
        this.s = s;
        this.l = l;
        this.a = a;
        this.type = 'HSLa';
    }
    toHslString() {
        const H = numbers_1.printDigits(this.h, 2);
        const S = numbers_1.printDigits(this.s * 100, 2);
        const L = numbers_1.printDigits(this.l * 100, 2);
        if (this.a !== 1) {
            const a = numbers_1.printDigits(this.a, 3);
            return `hsla(${H},${S}%,${L}%,${a})`;
        }
        else {
            return `hsl(${H},${S}%,${L}%)`;
        }
    }
    toString(useHsl = exports.USE_HSL) {
        if (useHsl) {
            return this.toHslString();
        }
        else {
            return toSRgb_1.toSRgb(this).toString();
        }
    }
    valueOf() {
        return [this.h, this.s, this.l, this.a];
    }
    clone() {
        return new HSLa(this.h, this.s, this.l, this.a);
    }
    static fromSRgb(orig) {
        if (orig.type !== 'SRGBa') {
            throw new Error('input to fromRgb must be of type Rgba');
        }
        const R = orig.r;
        const G = orig.g;
        const B = orig.b;
        const max = Math.max(R, Math.max(G, B));
        const min = Math.min(R, Math.min(G, B));
        const delta = max - min;
        const L = (max + min) / 2;
        let S;
        if (max === min) {
            S = 0;
        }
        else if (L < 0.5) {
            S = delta / (max + min);
        }
        else {
            S = delta / (2 - max - min);
        }
        let H;
        if (delta === 0) {
            H = 0;
        }
        else if (R === max) {
            H = (G - B) / delta;
            H = H < 0 ? H + 6 : H;
        }
        else if (G === max) {
            H = 2 + (B - R) / delta;
        }
        else {
            H = 4 + (R - G) / delta;
        }
        return new HSLa(H * 60, S, L, orig.a);
    }
}
exports.HSLa = HSLa;
exports.USE_HSL = false;
//# sourceMappingURL=toHsl.js.map