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
exports.deleteRemoteCredentials = exports.getRemoteCredentials = exports.saveRemoteCredentials = void 0;
const config_1 = require("../config");
__exportStar(require("./types/RemoteCredentials"), exports);
exports.saveRemoteCredentials = config_1.config.remoteApi
    ? require('./mongo/remoteCredentials').saveRemoteCredentials
    : require('./memory/remoteCredentials').saveRemoteCredentials;
exports.getRemoteCredentials = config_1.config.remoteApi
    ? require('./mongo/remoteCredentials').getRemoteCredentials
    : require('./memory/remoteCredentials').getRemoteCredentials;
exports.deleteRemoteCredentials = config_1.config.remoteApi
    ? require('./mongo/remoteCredentials').deleteRemoteCredentials
    : require('./memory/remoteCredentials').deleteRemoteCredentials;
//# sourceMappingURL=remoteCredentials.js.map