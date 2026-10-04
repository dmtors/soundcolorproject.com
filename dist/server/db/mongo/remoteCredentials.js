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
exports.deleteRemoteCredentials = exports.getRemoteCredentials = exports.saveRemoteCredentials = exports.initCollection = void 0;
const config_1 = require("../../config");
const DbWriteError_1 = require("../../errors/DbWriteError");
const connection_1 = require("./connection");
const COLLECTION_NAME = 'remoteCredentials';
function getCollection() {
    if (!config_1.config.remoteApi) {
        return null;
    }
    return connection_1.getDb().collection(COLLECTION_NAME);
}
function initCollection() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!config_1.config.remoteApi) {
            return;
        }
        const collection = yield connection_1.getDb().createCollection(COLLECTION_NAME);
        yield collection.createIndex('expirationDate', { expireAfterSeconds: 0 });
    });
}
exports.initCollection = initCollection;
exports.saveRemoteCredentials = function (session, { username, tokens }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!config_1.config.remoteApi) {
            return;
        }
        const coll = getCollection();
        const expirationDate = new Date(tokens.refresh.expiresAt);
        const value = {
            _id: session,
            username,
            tokens,
            expirationDate,
        };
        const found = yield coll.findOneAndReplace({ _id: { $eq: session } }, value);
        if (!found.ok || !found.value) {
            const { result } = yield coll.insertOne(value);
            if (!result.ok || result.n !== 1) {
                throw new DbWriteError_1.DbWriteError(COLLECTION_NAME);
            }
        }
    });
};
exports.getRemoteCredentials = function (session) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!config_1.config.remoteApi) {
            return null;
        }
        const coll = getCollection();
        return coll.findOne({ _id: { $eq: session } });
    });
};
exports.deleteRemoteCredentials = function (session) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!config_1.config.remoteApi) {
            return false;
        }
        const coll = getCollection();
        const { deletedCount = 0 } = yield coll.deleteOne({ _id: { $eq: session } });
        return deletedCount > 0;
    });
};
//# sourceMappingURL=remoteCredentials.js.map