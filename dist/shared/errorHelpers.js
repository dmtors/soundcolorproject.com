"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorString = void 0;
function errorString(err) {
    if (typeof err === 'string') {
        return err;
    }
    else if (err instanceof Error) {
        return err.stack || err.message;
    }
    else {
        try {
            return JSON.stringify(err);
        }
        catch (e) {
            return err.toString();
        }
    }
}
exports.errorString = errorString;
//# sourceMappingURL=errorHelpers.js.map