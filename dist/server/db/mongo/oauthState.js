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
exports.verifyOauthState = exports.generateOauthState = exports.initCollection = void 0;
const config_1 = require("../../config");
const DbWriteError_1 = require("../../errors/DbWriteError");
const random_1 = require("../../helpers/random");
const connection_1 = require("./connection");
function generateStateString() {
    return __awaiter(this, void 0, void 0, function* () {
        let state = yield random_1.randomString(24);
        state = state.replace(/[^a-zA-Z]/g, random_1.randomLetter);
        return state;
    });
}
const COLLECTION_NAME = 'oauthState';
function getCollection() {
    if (!config_1.config.remoteApi) {
        return null;
    }
    return connection_1.getDb().collection(COLLECTION_NAME);
}
const TEN_MINUTES_IN_SECONDS = 60 * 10;
function initCollection() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!config_1.config.remoteApi) {
            return;
        }
        const collection = yield connection_1.getDb().createCollection(COLLECTION_NAME);
        yield collection.createIndex('createdDate', { expireAfterSeconds: TEN_MINUTES_IN_SECONDS });
    });
}
exports.initCollection = initCollection;
exports.generateOauthState = function (session, provider) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!config_1.config.remoteApi) {
            return '';
        }
        const coll = getCollection();
        const state = yield generateStateString();
        const value = {
            session,
            provider,
            state,
            createdDate: new Date(),
        };
        const { result } = yield coll.insertOne(value);
        if (!result.ok || result.n !== 1) {
            throw new DbWriteError_1.DbWriteError(COLLECTION_NAME);
        }
        return state;
    });
};
exports.verifyOauthState = function (session, state, provider) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!config_1.config.remoteApi) {
            return false;
        }
        const coll = getCollection();
        const found = yield coll.findOne({
            session: { $eq: session },
            state: { $eq: state },
            provider: { $eq: provider },
        });
        if (!found) {
            return false;
        }
        const { result } = yield coll.deleteOne({
            session: { $eq: session },
            state: { $eq: state },
            provider: { $eq: provider },
        });
        if (!result.ok) {
            throw new DbWriteError_1.DbWriteError(COLLECTION_NAME);
        }
        return true;
    });
};
//# sourceMappingURL=oauthState.js.map