"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FatalError = exports.FatalErrorCode = void 0;
var FatalErrorCode;
(function (FatalErrorCode) {
    FatalErrorCode[FatalErrorCode["UNKNOWN_CAUSE"] = 1] = "UNKNOWN_CAUSE";
    FatalErrorCode[FatalErrorCode["EXPECTED_PORT_FAILED_TO_OPEN"] = 10] = "EXPECTED_PORT_FAILED_TO_OPEN";
    FatalErrorCode[FatalErrorCode["NO_AVAILABLE_PORTS"] = 11] = "NO_AVAILABLE_PORTS";
    FatalErrorCode[FatalErrorCode["MONGODB_CONNECTION_FAILED"] = 20] = "MONGODB_CONNECTION_FAILED";
})(FatalErrorCode = exports.FatalErrorCode || (exports.FatalErrorCode = {}));
class FatalError extends Error {
    constructor(exitCode, message, cause) {
        super(message);
        this.exitCode = exitCode;
        this.cause = cause;
    }
}
exports.FatalError = FatalError;
//# sourceMappingURL=FatalError.js.map