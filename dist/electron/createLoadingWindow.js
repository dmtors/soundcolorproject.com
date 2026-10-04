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
exports.destroyLoadingWindow = exports.createLoadingWindow = void 0;
const electron_1 = require("electron");
const path_1 = require("path");
const args_1 = require("./args");
const helpers_1 = require("./helpers");
let loadingWindow = null;
function createLoadingWindow(waitFor) {
    return __awaiter(this, void 0, void 0, function* () {
        if (loadingWindow) {
            return;
        }
        yield electron_1.app.whenReady();
        loadingWindow = new electron_1.BrowserWindow({
            width: 600,
            height: 300,
            titleBarStyle: 'hidden',
            frame: false,
            resizable: false,
            movable: false,
            alwaysOnTop: true,
            center: true,
            closable: false,
        });
        if (args_1.args.fullscreen) {
            loadingWindow.setFullScreen(true);
        }
        yield loadingWindow.loadFile(path_1.join(__dirname, './static/loading.html'));
        yield Promise.all([waitFor, helpers_1.sleep(1000)]);
        destroyLoadingWindow();
    });
}
exports.createLoadingWindow = createLoadingWindow;
function destroyLoadingWindow() {
    if (loadingWindow) {
        loadingWindow.hide();
        loadingWindow.destroy();
        loadingWindow = null;
    }
}
exports.destroyLoadingWindow = destroyLoadingWindow;
//# sourceMappingURL=createLoadingWindow.js.map