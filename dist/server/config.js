"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = exports.config = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const getLogLevel_1 = require("../shared/getLogLevel");
const CannotStringifyError_1 = require("./errors/CannotStringifyError");
try {
    const dotenv = require('dotenv');
    const envFile = path_1.join(__dirname, '../.env');
    try {
        const envConfig = dotenv.parse(fs_1.readFileSync(envFile));
        for (const k in envConfig) {
            process.env[k] = envConfig[k];
        }
        console.info('Loaded .env file');
    }
    catch (e) {
        if (/ENOENT/.test(e.toString())) {
            console.info('No .env file present');
        }
        else {
            console.warn('Failed to load .env file:', e);
        }
    }
}
catch (e) {
}
exports.config = {
    standaloneApp: false,
    forcedFullscreen: false,
    serviceMode: false,
    logLevel: getLogLevel_1.getLogLevel(),
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 9000,
    dev: process.env.DEV === 'true',
    localSsl: process.env.LOCAL_SSL === 'true',
    remoteApi: process.env.USE_REMOTE_API === 'true',
    disableBlink: process.env.DISABLE_BLINK === 'true',
    clientId: process.env.HUE_CLIENT_ID || '',
    clientSecret: process.env.HUE_CLIENT_SECRET || '',
    appId: process.env.HUE_APP_ID || '',
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/soundcolor',
    emailServer: process.env.EMAIL_SMTP_SERVER || '',
    emailUser: process.env.EMAIL_USER || '',
    emailPass: process.env.EMAIL_PASS || '',
    emailRecipient: process.env.EMAIL_RECIPIENT || '',
    toJSON: () => { throw new CannotStringifyError_1.CannotStringifyError('config file'); },
};
let initialized = false;
function init() {
    if (initialized) {
        return;
    }
    initialized = true;
    if (exports.config.remoteApi) {
        console.info('Using remote api');
    }
    else {
        console.info('Using local api');
    }
}
exports.init = init;
//# sourceMappingURL=config.js.map