"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbWriteError = void 0;
const ServerErrorCode_1 = require("../../shared/ServerErrorCode");
const ServerError_1 = require("./ServerError");
class DbWriteError extends ServerError_1.ServerError {
    constructor(collection) {
        super(ServerErrorCode_1.ServerErrorCode.DB_WRITE_FAILED);
        this.collection = collection;
    }
}
exports.DbWriteError = DbWriteError;
//# sourceMappingURL=DbWriteError.js.map