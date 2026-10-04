"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerErrorCode = void 0;
var ServerErrorCode;
(function (ServerErrorCode) {
    ServerErrorCode[ServerErrorCode["OFFLINE"] = 0] = "OFFLINE";
    ServerErrorCode[ServerErrorCode["UNKNOWN_ERROR"] = 1] = "UNKNOWN_ERROR";
    ServerErrorCode[ServerErrorCode["REDIRECTING"] = 2] = "REDIRECTING";
    ServerErrorCode[ServerErrorCode["INPUT_FAILED_VALIDATION"] = 100] = "INPUT_FAILED_VALIDATION";
    ServerErrorCode[ServerErrorCode["EXPECTED_HEADER"] = 101] = "EXPECTED_HEADER";
    ServerErrorCode[ServerErrorCode["DB_WRITE_FAILED"] = 200] = "DB_WRITE_FAILED";
    ServerErrorCode[ServerErrorCode["INVALID_OAUTH_CALLBACK"] = 300] = "INVALID_OAUTH_CALLBACK";
    ServerErrorCode[ServerErrorCode["NO_LOCAL_BRIDGES"] = 400] = "NO_LOCAL_BRIDGES";
    ServerErrorCode[ServerErrorCode["EMAIL_CREDENTIALS_NOT_FOUND"] = 500] = "EMAIL_CREDENTIALS_NOT_FOUND";
    ServerErrorCode[ServerErrorCode["EMAIL_TRANSPORT_FAILED_TO_INITIALIZE"] = 501] = "EMAIL_TRANSPORT_FAILED_TO_INITIALIZE";
    ServerErrorCode[ServerErrorCode["EMAIL_FAILED_TO_SEND"] = 502] = "EMAIL_FAILED_TO_SEND";
})(ServerErrorCode = exports.ServerErrorCode || (exports.ServerErrorCode = {}));
//# sourceMappingURL=ServerErrorCode.js.map