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
exports.initDb = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const config_1 = require("./config");
const connection_1 = require("./db/connection");
function initFile(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        let file;
        try {
            file = require(filename);
        }
        catch (e) {
            return;
        }
        if (file.initCollection) {
            yield file.initCollection();
        }
    });
}
const dbDir = path_1.join(__dirname, 'db');
function initDb() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!config_1.config.remoteApi) {
            return;
        }
        yield connection_1.initClient();
        const filepaths = fs_1.readdirSync(dbDir)
            .map(file => path_1.join(dbDir, file));
        yield Promise.all(filepaths.map(initFile));
    });
}
exports.initDb = initDb;
//# sourceMappingURL=initDb.js.map