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
exports.setupRoundRobin = exports.getNextLightId = exports.initCollection = void 0;
const config_1 = require("../../config");
const DbWriteError_1 = require("../../errors/DbWriteError");
const connection_1 = require("./connection");
const COLLECTION_NAME = 'groupRoundRobinState';
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
        yield collection.createIndex({
            session: 1,
            groupId: 1,
        }, { unique: true });
        yield collection.createIndex('lastModified', { expireAfterSeconds: TEN_MINUTES_IN_SECONDS });
    });
}
exports.initCollection = initCollection;
exports.getNextLightId = function (session, groupId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!config_1.config.remoteApi) {
            return -1;
        }
        const coll = getCollection();
        const { ok, value } = yield coll.findOneAndUpdate({
            session: { $eq: session },
            groupId: { $eq: groupId },
        }, {
            $inc: { currentIndex: 1 },
            $currentDate: { lastModified: true },
        });
        if (!ok || !value) {
            throw new DbWriteError_1.DbWriteError(COLLECTION_NAME);
        }
        const { currentIndex, lightIds } = value;
        const idx = currentIndex % lightIds.length;
        return lightIds[idx];
    });
};
exports.setupRoundRobin = function (session, groupId, lightIds) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!config_1.config.remoteApi) {
            return;
        }
        const coll = getCollection();
        const { result: { ok, n } } = yield coll.insertOne({
            session,
            groupId,
            lightIds,
            currentIndex: 0,
            lastModified: new Date(),
        });
        if (!ok || n === 0) {
            throw new DbWriteError_1.DbWriteError(COLLECTION_NAME);
        }
    });
};
//# sourceMappingURL=groupRoundRobin.js.map