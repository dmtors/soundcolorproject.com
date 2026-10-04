"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBrowser = void 0;
exports.isBrowser = () => {
    const browser = typeof window !== 'undefined';
    exports.isBrowser = () => browser;
    return browser;
};
//# sourceMappingURL=isBrowser.js.map