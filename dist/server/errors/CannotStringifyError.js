"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannotStringifyError = void 0;
class CannotStringifyError extends Error {
    constructor(name) {
        super(`Cannot JSON.stringify ${name} due to possible security vulnerability.`);
    }
}
exports.CannotStringifyError = CannotStringifyError;
//# sourceMappingURL=CannotStringifyError.js.map