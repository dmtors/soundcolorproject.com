"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RGBa = exports.toRgb = void 0;
const constants_1 = require("./constants");
const parseColor_1 = require("./parseColor");
const toSRgb_1 = require("./toSRgb");
function toRgb(color) {
    if (typeof color === 'string') {
        color = parseColor_1.parseColor(color);
    }
    if (color.type === 'RGBa') {
        return color;
    }
    return RGBa.fromSRgb(toSRgb_1.toSRgb(color));
}
exports.toRgb = toRgb;
class RGBa {
    constructor(r, g, b, a = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        this.type = 'RGBa';
    }
    toArray() {
        return [this.r, this.g, this.b, this.a];
    }
    map(mapper) {
        return [this.r, this.g, this.b].map(mapper).concat(this.a);
    }
    toString() {
        return toSRgb_1.SRGBa.fromRgb(this).toString();
    }
    valueOf() {
        return [this.r, this.g, this.b, this.a];
    }
    clone() {
        return new RGBa(this.r, this.g, this.b, this.a);
    }
    fixRgb() {
        return toRgb(new toSRgb_1.SRGBa(...this.toArray()));
    }
    static fromSRgb(orig) {
        if (orig.type !== 'SRGBa') {
            throw new Error('input to fromSRgb must be of type Srgba');
        }
        return new RGBa(...orig.map(c => {
            if (c <= constants_1.colorConversion.sRgbCutoff) {
                return c / constants_1.colorConversion.lowRatio;
            }
            return Math.pow((c + constants_1.colorConversion.fix) / (1 + constants_1.colorConversion.fix), constants_1.colorConversion.power);
        }));
    }
}
exports.RGBa = RGBa;
//# sourceMappingURL=toRgb.js.map