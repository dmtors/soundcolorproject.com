"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoHeaderError = void 0;
const ServerErrorCode_1 = require("../../shared/ServerErrorCode");
const ServerError_1 = require("./ServerError");
class NoHeaderError extends ServerError_1.ServerError {
    constructor(headerName) {
        super(ServerErrorCode_1.ServerErrorCode.EXPECTED_HEADER, `Expected header not found (${headerName})`, { headerName }, 400);
        this.headerName = headerName;
    }
}
exports.NoHeaderError = NoHeaderError;
//# sourceMappingURL=NoHeaderError.js.map