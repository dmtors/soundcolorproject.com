"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailFailedToSendError = void 0;
const ServerErrorCode_1 = require("../../shared/ServerErrorCode");
const ServerError_1 = require("./ServerError");
class EmailFailedToSendError extends ServerError_1.ServerError {
    constructor(cause) {
        super(ServerErrorCode_1.ServerErrorCode.EMAIL_FAILED_TO_SEND, 'Failed to send email', cause);
    }
}
exports.EmailFailedToSendError = EmailFailedToSendError;
//# sourceMappingURL=EmailFailedToSendError.js.map