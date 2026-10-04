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
exports.getDb = exports.getClient = exports.initClient = void 0;
const mongodb_1 = require("mongodb");
const config_1 = require("../../config");
const FatalError_1 = require("../../errors/FatalError");
let mongoClient = null;
let db = null;
function initClient() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!config_1.config.remoteApi) {
            return;
        }
        try {
            console.info('Connecting to database...');
            mongoClient = yield mongodb_1.connect(config_1.config.mongodbUri, { useUnifiedTopology: true });
            db = mongoClient.db();
        }
        catch (e) {
            throw new FatalError_1.FatalError(FatalError_1.FatalErrorCode.MONGODB_CONNECTION_FAILED, 'Failed to connect to database', e);
        }
    });
}
exports.initClient = initClient;
function getClient() {
    return mongoClient;
}
exports.getClient = getClient;
function getDb() {
    return db;
}
exports.getDb = getDb;
//# sourceMappingURL=connection.js.map