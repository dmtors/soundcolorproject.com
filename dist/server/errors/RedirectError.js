"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedirectError = void 0;
const ServerErrorCode_1 = require("../../shared/ServerErrorCode");
const ServerError_1 = require("./ServerError");
class RedirectError extends ServerError_1.ServerError {
    constructor(redirectTo, fallbackError, errorCode = ServerErrorCode_1.ServerErrorCode.REDIRECTING) {
        super(errorCode, fallbackError, { redirectTo }, 401);
        this.redirectTo = redirectTo;
    }
}
exports.RedirectError = RedirectError;
//# sourceMappingURL=RedirectError.js.map