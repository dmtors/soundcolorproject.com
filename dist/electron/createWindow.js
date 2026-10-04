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
exports.createWindow = void 0;
const electron_1 = require("electron");
const config_1 = require("../server/config");
const logger_1 = require("../shared/logger");
const args_1 = require("./args");
function createWindow() {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.logger.info('Creating new browser window...');
        const { width, height } = electron_1.screen.getPrimaryDisplay().workAreaSize;
        const win = new electron_1.BrowserWindow({
            width,
            height,
            show: false,
            webPreferences: {
                nodeIntegration: true,
            },
            closable: !args_1.args.service && !config_1.config.dev,
        });
        if (args_1.args.service) {
            if (config_1.config.dev) {
                let closeCount = 0;
                win.on('close', (ev) => {
                    logger_1.logger.info('close requested');
                    if (++closeCount < 3) {
                        logger_1.logger.info('yup');
                        ev.preventDefault();
                        return false;
                    }
                    else {
                        logger_1.logger.info('nope');
                    }
                });
            }
            else {
                win.on('close', (ev) => {
                    logger_1.logger.info('Running in service mode -- preventing close');
                    ev.preventDefault();
                    return false;
                });
            }
        }
        logger_1.logger.info('Loading app into browser window...');
        yield win.loadURL(`http://localhost:${config_1.config.port}/sovis`);
        win.show();
        if (args_1.args.fullscreen) {
            win.setFullScreen(true);
            yield win.webContents.executeJavaScript('window.__FORCED_FULLSCREEN__ = true');
        }
        if (config_1.config.dev || args_1.args.debug) {
            win.webContents.openDevTools();
        }
        logger_1.logger.info('Browser window loaded!');
    });
}
exports.createWindow = createWindow;
//# sourceMappingURL=createWindow.js.map