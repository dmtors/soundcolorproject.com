"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoLocalBridgesError = void 0;
const ServerErrorCode_1 = require("../../shared/ServerErrorCode");
const ServerError_1 = require("./ServerError");
class NoLocalBridgesError extends ServerError_1.ServerError {
    constructor() {
        super(ServerErrorCode_1.ServerErrorCode.NO_LOCAL_BRIDGES, 'No hue bridges found on the current local network.');
    }
}
exports.NoLocalBridgesError = NoLocalBridgesError;
//# sourceMappingURL=NoLocalBridgesError.js.map