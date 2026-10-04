"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USE_HSL = exports.HSVa = exports.toHsv = void 0;
const parseColor_1 = require("./parseColor");
const toSRgb_1 = require("./toSRgb");
function toHsv(color) {
    if (typeof color === 'string') {
        color = parseColor_1.parseColor(color);
    }
    if (color.type === 'HSVa') {
        return color;
    }
    return HSVa.fromSRgb(toSRgb_1.toSRgb(color));
}
exports.toHsv = toHsv;
function clamp(min, value, max) {
    return Math.max(min, Math.min(value, max));
}
class HSVa {
    constructor(h, s, v, a = 1) {
        this.h = h;
        this.s = s;
        this.v = v;
        this.a = a;
        this.type = 'HSVa';
        this.h = clamp(0, h, 360);
        this.s = clamp(0, s, 1);
        this.v = clamp(0, v, 1);
        this.a = clamp(0, a, 1);
    }
    toString() {
        return toSRgb_1.toSRgb(this).toString();
    }
    valueOf() {
        return [this.h, this.s, this.v, this.a];
    }
    clone() {
        return new HSVa(this.h, this.s, this.v, this.a);
    }
    static fromSRgb(orig) {
        if (orig.type !== 'SRGBa') {
            throw new Error('input to fromRgb must be of type Rgba');
        }
        const R = orig.r;
        const G = orig.g;
        const B = orig.b;
        const max = Math.max(R, G, B);
        const min = Math.min(R, G, B);
        const delta = max - min;
        const V = max;
        let S;
        if (max === 0) {
            S = 0;
        }
        else {
            S = delta / max;
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
        return new HSVa(H * 60, S, V, orig.a);
    }
}
exports.HSVa = HSVa;
exports.USE_HSL = false;
//# sourceMappingURL=toHsv.js.map