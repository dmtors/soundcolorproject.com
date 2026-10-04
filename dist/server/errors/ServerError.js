"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerError = exports.DEFAULT_ERROR_MESSAGE = void 0;
exports.DEFAULT_ERROR_MESSAGE = 'Something went wrong.  Please try again later';
class ServerError extends Error {
    constructor(errorCode, errorMessage = exports.DEFAULT_ERROR_MESSAGE, errorData, statusCode = 500) {
        super(errorMessage);
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
        this.errorData = errorData;
        this.statusCode = statusCode;
    }
}
exports.ServerError = ServerError;
//# sourceMappingURL=ServerError.js.map