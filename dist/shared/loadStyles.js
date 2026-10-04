"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadStyles = void 0;
const fs_1 = require("fs");
const postcss = require("postcss");
const pcssPlugins_1 = require("../config/pcssPlugins");
const helpers_1 = require("../electron/helpers");
const pcss = postcss(pcssPlugins_1.pcssPlugins);
const readFileAsync = (path) => (new Promise((resolve, reject) => {
    fs_1.readFile(path, (err, data) => {
        if (err || !data) {
            reject(err);
        }
        else {
            resolve(data);
        }
    });
}));
function loadStyles(path, document = window.document) {
    return __awaiter(this, void 0, void 0, function* () {
        const content = yield readFileAsync(path);
        const compiled = yield pcss.process(content, { from: path });
        const el = document.createElement('style');
        el.media = 'text/css';
        el.textContent = compiled.css;
        document.head.appendChild(el);
        yield helpers_1.sleep(100);
        return el;
    });
}
exports.loadStyles = loadStyles;
//# sourceMappingURL=loadStyles.js.map