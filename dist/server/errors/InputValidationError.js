"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputValidationError = void 0;
const ServerErrorCode_1 = require("../../shared/ServerErrorCode");
const ServerError_1 = require("./ServerError");
class InputValidationError extends ServerError_1.ServerError {
    constructor(requiredFields) {
        super(ServerErrorCode_1.ServerErrorCode.INPUT_FAILED_VALIDATION, `Request body was missing required fields`, { requiredFields });
        this.requiredFields = requiredFields;
    }
}
exports.InputValidationError = InputValidationError;
//# sourceMappingURL=InputValidationError.js.map