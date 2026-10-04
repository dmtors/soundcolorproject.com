"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SRGBa = exports.toSRgb = void 0;
const numbers_1 = require("../helpers/numbers");
const constants_1 = require("./constants");
const parseColor_1 = require("./parseColor");
const toRgb_1 = require("./toRgb");
function toSRgb(color) {
    if (typeof color === 'string') {
        color = parseColor_1.parseColor(color);
    }
    if (color.type === 'SRGBa') {
        return color;
    }
    if (color.type === 'HSLa') {
        return SRGBa.fromHSL(color);
    }
    if (color.type === 'HSVa') {
        return SRGBa.fromHSV(color);
    }
    return SRGBa.fromRgb(toRgb_1.toRgb(color));
}
exports.toSRgb = toSRgb;
function toHex(num) {
    num = Math.round(num);
    let str = Math.max(0, Math.min(num, 255)).toString(16);
    if (str.length === 1) {
        return `0${str}`;
    }
    else {
        return str;
    }
}
class SRGBa {
    constructor(r, g, b, a = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        this.type = 'SRGBa';
    }
    map(mapper) {
        return [this.r, this.g, this.b].map(mapper).concat(this.a);
    }
    toString() {
        if (this.a !== 1) {
            const R = numbers_1.printDigits(this.r * 255, 2);
            const G = numbers_1.printDigits(this.g * 255, 2);
            const B = numbers_1.printDigits(this.b * 255, 2);
            const a = numbers_1.printDigits(this.a, 4);
            return `rgba(${R}, ${G}, ${B}, ${a})`;
        }
        else {
            const R = toHex(this.r * 255);
            const G = toHex(this.g * 255);
            const B = toHex(this.b * 255);
            return `#${R}${G}${B}`;
        }
    }
    toArray() {
        return [this.r, this.g, this.b, this.a];
    }
    valueOf() {
        return this.toArray();
    }
    clone() {
        return new SRGBa(this.r, this.g, this.b, this.a);
    }
    fixSRgb() {
        return toSRgb(new toRgb_1.RGBa(...this.toArray()));
    }
    static fromRgb(orig) {
        if (orig.type !== 'RGBa') {
            throw new Error('input to fromRgb must be of type Rgba');
        }
        return new SRGBa(...orig.map(c => {
            if (c <= constants_1.colorConversion.sRgbCutoff / constants_1.colorConversion.lowRatio) {
                return c * constants_1.colorConversion.lowRatio;
            }
            return Math.pow(c * (1 + constants_1.colorConversion.fix), 1 / constants_1.colorConversion.power) - constants_1.colorConversion.fix;
        }));
    }
    static fromHSL(orig) {
        if (orig.type !== 'HSLa') {
            throw new Error('input to fromHSL must be of type HSLa');
        }
        const H = orig.h;
        const S = orig.s;
        const L = orig.l;
        if (S === 0) {
            return new SRGBa(L, L, L, orig.a);
        }
        const q = L < 0.5 ? L * (1 + S) : L + S - L * S;
        const p = 2 * L - q;
        const ts = [
            (H / 360 + 1 / 3) % 1,
            (H / 360),
            (H / 360 + 2 / 3) % 1,
        ];
        const [r, g, b] = ts.map(t => {
            if (t < 1 / 6)
                return p + (q - p) * 6 * t;
            if (t < 1 / 2)
                return q;
            if (t < 2 / 3)
                return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        });
        return new SRGBa(r, g, b, orig.a);
    }
    static fromHSV(orig) {
        const H = orig.h;
        const S = orig.s;
        const V = orig.v;
        const min = V - (V * S);
        const max = V * S + min;
        const mid = V * S * (1 - Math.abs(((H / 60) % 2) - 1)) + min;
        let R;
        let G;
        let B;
        if (H < 60) {
            R = max;
            G = mid;
            B = min;
        }
        else if (H < 120) {
            R = mid;
            G = max;
            B = min;
        }
        else if (H < 180) {
            R = min;
            G = max;
            B = mid;
        }
        else if (H < 240) {
            R = min;
            G = mid;
            B = max;
        }
        else if (H < 300) {
            R = mid;
            G = min;
            B = max;
        }
        else {
            R = max;
            G = min;
            B = mid;
        }
        return new SRGBa(R, G, B, orig.a);
    }
}
exports.SRGBa = SRGBa;
//# sourceMappingURL=toSRgb.js.map