"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefault = void 0;
const constants_1 = require("./constants");
function getDefault(colorName) {
    if (!constants_1.defaultColors[colorName]) {
        throw new Error(`No default color exists for key '${colorName}'`);
    }
    return constants_1.defaultColors[colorName];
}
exports.getDefault = getDefault;
//# sourceMappingURL=getDefault.js.map