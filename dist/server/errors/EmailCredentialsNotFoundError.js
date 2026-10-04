"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailCredentialsNotFoundError = void 0;
const ServerErrorCode_1 = require("../../shared/ServerErrorCode");
const ServerError_1 = require("./ServerError");
class EmailCredentialsNotFoundError extends ServerError_1.ServerError {
    constructor() {
        super(ServerErrorCode_1.ServerErrorCode.EMAIL_CREDENTIALS_NOT_FOUND, 'Email credentials not found');
    }
}
exports.EmailCredentialsNotFoundError = EmailCredentialsNotFoundError;
//# sourceMappingURL=EmailCredentialsNotFoundError.js.map