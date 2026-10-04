"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextLightId = exports.setupRoundRobin = void 0;
const config_1 = require("../config");
__exportStar(require("./types/GroupRoundRobin"), exports);
exports.setupRoundRobin = config_1.config.remoteApi
    ? require('./mongo/groupRoundRobin').setupRoundRobin
    : require('./memory/groupRoundRobin').setupRoundRobin;
exports.getNextLightId = config_1.config.remoteApi
    ? require('./mongo/groupRoundRobin').getNextLightId
    : require('./memory/groupRoundRobin').getNextLightId;
//# sourceMappingURL=groupRoundRobin.js.map