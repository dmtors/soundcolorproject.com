"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailCredentialsNotFoundError = void 0;
const ServerErrorCode_1 = require("../../shared/ServerErrorCode");
const ServerError_1 = require("./ServerError");
class EmailCredentialsNotFoundError extends ServerError_1.ServerError {
    constructor(cause) {
        super(ServerErrorCode_1.ServerErrorCode.EMAIL_TRANSPORT_FAILED_TO_INITIALIZE, 'Email transport failed to initialize', cause);
    }
}
exports.EmailCredentialsNotFoundError = EmailCredentialsNotFoundError;
//# sourceMappingURL=EmailTransportInitializationError.js.map