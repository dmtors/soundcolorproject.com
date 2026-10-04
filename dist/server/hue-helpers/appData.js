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
exports.readJsonFile = exports.writeJsonFile = exports.readDataFile = exports.writeDataFile = exports.dataFileExists = void 0;
const fs = require("fs");
const os = require("os");
const path = require("path");
const util_1 = require("util");
const statAsync = util_1.promisify(fs.stat);
const mkdirAsync = util_1.promisify(fs.mkdir);
const writeFileAsync = util_1.promisify(fs.writeFile);
const readFileAsync = util_1.promisify(fs.readFile);
function existsAsync(path) {
    return statAsync(path)
        .then(() => true)
        .catch(() => false);
}
const DATA_DIRNAME = 'com.soundcolorproject.server';
function getAppDataPath() {
    const home = os.homedir();
    const platform = os.platform();
    switch (platform) {
        case 'aix':
        case 'android':
        case 'freebsd':
        case 'linux':
        case 'netbsd':
        case 'openbsd':
        case 'sunos':
            const config = path.join(home, '.config');
            return path.join(config, DATA_DIRNAME);
        case 'cygwin':
        case 'win32':
            const appData = process.env.APPDATA || path.join(home, 'AppData', 'Roaming');
            return path.join(appData, DATA_DIRNAME);
        case 'darwin':
            const appSupport = path.join(home, 'Library', 'Application Support');
            return path.join(appSupport, DATA_DIRNAME);
    }
}
const appDataPath = getAppDataPath();
function dataFileExists(localPath) {
    const fullPath = path.join(appDataPath, localPath);
    return existsAsync(fullPath);
}
exports.dataFileExists = dataFileExists;
function writeDataFile(localPath, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const fullPath = path.join(appDataPath, localPath);
        const dir = path.dirname(fullPath);
        if (!(yield existsAsync(dir))) {
            yield mkdirAsync(dir, {
                recursive: true,
                mode: 0o700,
            });
        }
        yield writeFileAsync(fullPath, data, {
            mode: 0o600,
        });
    });
}
exports.writeDataFile = writeDataFile;
function readDataFile(localPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const fullPath = path.join(appDataPath, localPath);
        if (!(yield existsAsync(fullPath))) {
            return null;
        }
        return readFileAsync(fullPath);
    });
}
exports.readDataFile = readDataFile;
function writeJsonFile(localPath, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return writeDataFile(localPath, JSON.stringify(data));
    });
}
exports.writeJsonFile = writeJsonFile;
function readJsonFile(localPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const buffer = yield readDataFile(localPath);
        if (buffer === null) {
            return null;
        }
        return JSON.parse(buffer.toString());
    });
}
exports.readJsonFile = readJsonFile;
//# sourceMappingURL=appData.js.map