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
exports.sessionMiddleware = void 0;
const asyncHandler = require("express-async-handler");
const logger_1 = require("../../shared/logger");
const config_1 = require("../config");
const remoteCredentials_1 = require("../db/remoteCredentials");
const random_1 = require("../helpers/random");
const cache_1 = require("../hue-helpers/cache");
exports.sessionMiddleware = config_1.config.remoteApi
    ? asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const allowCookies = config_1.config.standaloneApp || req.header('allow-cookie') === 'true';
        let session = req.cookies.session;
        if (!session && allowCookies) {
            session = yield random_1.randomString(16);
            logger_1.logger.debug('generated session', session);
            res.cookie('session', session);
        }
        req.getSessionId = () => session || '';
        res.clearSession = () => __awaiter(void 0, void 0, void 0, function* () {
            res.clearCookie('session');
            cache_1.apiCache.del(session);
            yield remoteCredentials_1.deleteRemoteCredentials(session);
        });
        next();
    }))
    : (req, _res, next) => {
        req.getSessionId = () => 'dummy session';
        next();
    };
//# sourceMappingURL=session.js.map