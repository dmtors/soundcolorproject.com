"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogLevel = exports.validLevels = exports.LogLevel = void 0;
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["debug"] = 0] = "debug";
    LogLevel[LogLevel["info"] = 1] = "info";
    LogLevel[LogLevel["log"] = 2] = "log";
    LogLevel[LogLevel["warn"] = 3] = "warn";
    LogLevel[LogLevel["error"] = 4] = "error";
    LogLevel[LogLevel["fatal"] = 5] = "fatal";
    LogLevel[LogLevel["none"] = 6] = "none";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
exports.validLevels = Object.keys(LogLevel).filter(level => Number.isNaN(parseFloat(level)));
const defaultLogLevel = 'warn';
function computeLogLevel() {
    var _a;
    try {
        if (typeof __LOG_LEVEL__ === 'string') {
            return __LOG_LEVEL__;
        }
        const index = exports.validLevels.indexOf((_a = process.env.LOG_LEVEL) === null || _a === void 0 ? void 0 : _a.toLowerCase());
        if (index >= 0) {
            const level = exports.validLevels[index];
            console.info(`Using log level ${level}`);
            return level;
        }
        else {
            if (process.env.LOG_LEVEL) {
                console.warn(`LOG_LEVEL ${process.env.LOG_LEVEL} is invalid.`);
                console.warn(`Valid options are [${exports.validLevels.join(', ')}].`);
                console.warn(`Falling back to default level, which is ${defaultLogLevel}`);
            }
            return defaultLogLevel;
        }
    }
    catch (e) {
        return defaultLogLevel;
    }
}
let logLevel = null;
function getLogLevel() {
    if (!logLevel) {
        logLevel = computeLogLevel();
    }
    return logLevel;
}
exports.getLogLevel = getLogLevel;
//# sourceMappingURL=getLogLevel.js.map