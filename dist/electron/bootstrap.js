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
exports.bootstrap = void 0;
const electron_1 = require("electron");
const config_1 = require("../server/config");
const logger_1 = require("../shared/logger");
const args_1 = require("./args");
const createLoadingWindow_1 = require("./createLoadingWindow");
const createWindow_1 = require("./createWindow");
const isMac = process.platform === 'darwin';
function prepareApplication() {
    return __awaiter(this, void 0, void 0, function* () {
        const { startup } = require('../server/startup');
        yield startup();
        yield createWindow_1.createWindow();
    });
}
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        config_1.config.remoteApi = false;
        config_1.config.standaloneApp = true;
        electron_1.app.on('before-quit', () => {
            createLoadingWindow_1.destroyLoadingWindow();
            const { stopServer } = require('../server/startup');
            stopServer().catch(err => {
                logger_1.logger.error('Failed to stop server:', err);
            });
            logger_1.logger.info('Exiting...');
        });
        yield electron_1.app.whenReady();
        const menu = [];
        if (!args_1.args.service) {
            const item = new electron_1.MenuItem({
                label: 'File',
                role: 'fileMenu',
                submenu: [
                    { role: 'close' },
                    { role: 'quit' },
                ],
            });
            menu.push(item);
        }
        if (config_1.config.dev) {
            const item = new electron_1.MenuItem({
                label: 'View',
                role: 'viewMenu',
                submenu: [
                    { role: 'reload' },
                    { role: 'toggleDevTools' },
                ],
            });
            menu.push(item);
        }
        electron_1.Menu.setApplicationMenu(electron_1.Menu.buildFromTemplate(menu));
        logger_1.logger.info('Launching server & electron app...');
        yield createLoadingWindow_1.createLoadingWindow(prepareApplication());
        electron_1.app.on('window-all-closed', () => {
            if (!isMac) {
                electron_1.app.quit();
            }
        });
        electron_1.app.on('activate', () => {
            if (electron_1.BrowserWindow.getAllWindows().length === 0) {
                createWindow_1.createWindow().catch(e => {
                    logger_1.logger.error('Failed to open new window:', e);
                });
            }
        });
        logger_1.logger.info('Electron app ready!');
    });
}
exports.bootstrap = bootstrap;
//# sourceMappingURL=bootstrap.js.map