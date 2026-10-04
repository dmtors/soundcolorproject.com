"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initClient = void 0;
const config_1 = require("../config");
exports.initClient = config_1.config.remoteApi
    ? require('./mongo/connection').initClient
    : require('./memory/connection').initClient;
//# sourceMappingURL=connection.js.map