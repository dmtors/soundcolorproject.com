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
exports.stopServer = exports.startup = void 0;
const fs_1 = require("fs");
const http_1 = require("http");
const https_1 = require("https");
const path_1 = require("path");
const logger_1 = require("../shared/logger");
const app_1 = require("./app");
const config_1 = require("./config");
const FatalError_1 = require("./errors/FatalError");
const initDb_1 = require("./initDb");
function randomPort() {
    return 5000 + Math.floor(Math.random() * 35000);
}
function startServerOnPort(port, create) {
    return new Promise((resolve, reject) => {
        logger_1.logger.info('Starting server on port', port);
        const server = create();
        server.once('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                reject(err);
            }
        });
        server.listen(port, () => {
            console.log(`Server listening on port ${port}`);
            resolve(server);
        });
    });
}
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        let failCount = 0;
        const MAX_FAILS = config_1.config.dev || config_1.config.standaloneApp ? 10 : 1;
        const origPort = config_1.config.port;
        const serverCreator = config_1.config.localSsl ?
            () => https_1.createServer({
                cert: fs_1.readFileSync(path_1.join(__dirname, '../local/server.cert')),
                key: fs_1.readFileSync(path_1.join(__dirname, '../local/server.key')),
            }) :
            () => http_1.createServer();
        while (failCount < MAX_FAILS) {
            try {
                config_1.config.port = failCount === 0 ? origPort : randomPort();
                const server = yield startServerOnPort(config_1.config.port, serverCreator);
                return server;
            }
            catch (e) {
                logger_1.logger.warn(`Failed to listen on port ${config_1.config.port}!`);
                if (!config_1.config.dev && !config_1.config.standaloneApp) {
                    throw new FatalError_1.FatalError(FatalError_1.FatalErrorCode.EXPECTED_PORT_FAILED_TO_OPEN, `Failed to listen on port ${config_1.config.port}!`);
                }
                logger_1.logger.warn(`Trying another port...`);
                failCount++;
            }
        }
        logger_1.logger.fatal(`Could not find an open port!`);
        throw new FatalError_1.FatalError(FatalError_1.FatalErrorCode.NO_AVAILABLE_PORTS, 'Could not find an open port!');
    });
}
let server = null;
function startup() {
    return __awaiter(this, void 0, void 0, function* () {
        config_1.init();
        let app = app_1.buildApp();
        yield initDb_1.initDb();
        server = yield startServer();
        server.on('request', app);
        console.log('Server ready');
        if (module.hot) {
            let currentApp = app;
            module.hot.accept('./app', () => {
                if (!server) {
                    return;
                }
                try {
                    logger_1.logger.info('New module for server/app');
                    const { buildApp } = require('./app');
                    server.removeListener('request', currentApp);
                    currentApp = buildApp();
                    server.on('request', currentApp);
                    logger_1.logger.info('Express app reloaded!');
                }
                catch (err) {
                    logger_1.logger.error('Failed to reload express app:', err);
                }
            });
        }
    });
}
exports.startup = startup;
function stopServer() {
    return new Promise((resolve, reject) => {
        if (server && server.listening) {
            server.close((err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        }
        else {
            resolve();
        }
    });
}
exports.stopServer = stopServer;
//# sourceMappingURL=startup.js.map