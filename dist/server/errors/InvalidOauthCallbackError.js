"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidOauthCallbackError = void 0;
const ServerErrorCode_1 = require("../../shared/ServerErrorCode");
const ServerError_1 = require("./ServerError");
class InvalidOauthCallbackError extends ServerError_1.ServerError {
    constructor() {
        super(ServerErrorCode_1.ServerErrorCode.INVALID_OAUTH_CALLBACK, 'OAuth callback failed validation');
    }
}
exports.InvalidOauthCallbackError = InvalidOauthCallbackError;
//# sourceMappingURL=InvalidOauthCallbackError.js.map