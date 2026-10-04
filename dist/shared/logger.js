"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const browserAnsi_1 = require("./browserAnsi");
const getLogLevel_1 = require("./getLogLevel");
const isBrowser_1 = require("./isBrowser");
let colors = null;
try {
    if (!isBrowser_1.isBrowser()) {
        colors = require('ansi-colors');
    }
}
catch (e) {
}
const textIdent = (text) => text;
function getStyleFunc(style) {
    if (colors && style.length > 0) {
        const styleFn = style.slice(1).reduce((fn, name) => fn[name], colors[style[0]]);
        return styleFn;
    }
    else {
        return textIdent;
    }
}
function getBrowserAnsi(style) {
    if (style.length === 0) {
        return '';
    }
    return style.slice(1).reduce((style, name) => style[name], browserAnsi_1.browserAnsi[style[0]]).toString();
}
const useStack = typeof new Error().stack === 'string';
function createLogFunc(target, expected, logger, prefix, style = []) {
    if (prefix) {
        prefix = `${prefix}:`;
    }
    if (isBrowser_1.isBrowser()) {
        const styleStr = getBrowserAnsi(style);
        if (!styleStr) {
            return (...args) => {
                if (expected < target.level)
                    return;
                logger(prefix, ...args);
            };
        }
        return (...args) => {
            var _a;
            if (expected < target.level)
                return;
            let format = `%c${prefix} ` + args.map(arg => {
                switch (typeof arg) {
                    case 'string':
                        return '%s';
                    case 'number':
                        if (arg % 1 === 0) {
                            return '%d';
                        }
                        else {
                            return '%f';
                        }
                    case 'bigint':
                        return '%d';
                    default:
                        return '%o';
                }
            }).join(' ');
            if (useStack) {
                format += `\n${(_a = new Error().stack) === null || _a === void 0 ? void 0 : _a.split('\n')[2]}`;
            }
            logger(format, styleStr, ...args);
        };
    }
    else {
        const styleFn = getStyleFunc(style);
        return (...args) => {
            if (expected < target.level)
                return;
            const str = args.reduce((str, arg) => {
                if (typeof arg === 'object') {
                    if (arg.constructor.name === 'ApiError') {
                        const err = arg.getHueError();
                        arg = `${arg.message} ${JSON.stringify(err.payload, null, 2)}`;
                    }
                    else if (arg instanceof Error) {
                        arg = arg.stack;
                    }
                    else {
                        try {
                            arg = JSON.stringify(arg, null, 2);
                        }
                        catch (e) {
                        }
                    }
                }
                return `${str} ${arg}`;
            }, prefix);
            logger(styleFn(str));
        };
    }
}
function createLogger() {
    const target = { level: getLogLevel_1.LogLevel[getLogLevel_1.getLogLevel()] };
    const logger = {
        debug: createLogFunc(target, getLogLevel_1.LogLevel.debug, console.debug, 'DEBUG', ['underline']),
        info: createLogFunc(target, getLogLevel_1.LogLevel.info, console.info, 'INFO', ['cyan']),
        log: createLogFunc(target, getLogLevel_1.LogLevel.log, console.log, 'LOG'),
        warn: createLogFunc(target, getLogLevel_1.LogLevel.warn, console.warn, 'WARNING', ['yellow']),
        error: createLogFunc(target, getLogLevel_1.LogLevel.error, console.error, 'ERROR', ['red', 'bold']),
        fatal: createLogFunc(target, getLogLevel_1.LogLevel.fatal, console.error, '🔥 FATAL', ['red', 'bold']),
        set logLevel(newLevel) {
            const levelValue = getLogLevel_1.LogLevel[newLevel];
            if (levelValue !== undefined) {
                target.level = levelValue;
                console.log(`Log level set to ${newLevel} (${levelValue})`);
            }
            else {
                console.log(`Log level "${newLevel}" not recognized.  Valid log levels are: [${getLogLevel_1.validLevels.join(', ')}]`);
            }
        },
        get logLevel() {
            return getLogLevel_1.LogLevel[target.level];
        },
    };
    return logger;
}
exports.logger = createLogger();
if (typeof globalThis !== 'undefined') {
    globalThis.logger = exports.logger;
}
else if (typeof window !== 'undefined') {
    window.logger = exports.logger;
}
else if (typeof global !== 'undefined') {
    global.logger = exports.logger;
}
//# sourceMappingURL=logger.js.map