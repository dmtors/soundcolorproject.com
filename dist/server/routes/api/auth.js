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
exports.authRouter = void 0;
const express_1 = require("express");
const asyncHandler = require("express-async-handler");
const logger_1 = require("../../../shared/logger");
const config_1 = require("../../config");
const oauthState_1 = require("../../db/oauthState");
const InvalidOauthCallbackError_1 = require("../../errors/InvalidOauthCallbackError");
const NoLocalBridgesError_1 = require("../../errors/NoLocalBridgesError");
const getApi_1 = require("../../hue-helpers/getApi");
exports.authRouter = express_1.Router();
exports.authRouter.get('/status', asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let authenticated;
    try {
        yield getApi_1.getApi(req.getSessionId());
        authenticated = true;
    }
    catch (e) {
        authenticated = false;
    }
    res.json({
        authenticated,
    });
})));
function getOauthProvider(_req) {
    return 'hue';
}
if (config_1.config.remoteApi) {
    exports.authRouter.get('/callback', asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const session = req.getSessionId();
        const state = req.query.state;
        const provider = getOauthProvider(req);
        const code = req.query.code;
        logger_1.logger.debug(`OAuth session: ${session}`);
        logger_1.logger.debug(`OAuth state: ${state}`);
        logger_1.logger.debug(`OAuth provider: ${provider}`);
        logger_1.logger.debug(`OAuth code: ${code}`);
        const valid = yield oauthState_1.verifyOauthState(session, state, provider);
        if (!valid) {
            throw new InvalidOauthCallbackError_1.InvalidOauthCallbackError();
        }
        const api = yield getApi_1.createApiFromAccessCode(session, code);
        if (api) {
            return res.redirect('/return-from-hue');
        }
        res.status(400).send('Something went wrong, please try again.');
    })));
}
else {
    exports.authRouter.get('/connect', asyncHandler((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let status = 'not connected';
        try {
            const api = yield getApi_1.getLocalApi();
            if (api) {
                status = 'connected';
            }
        }
        catch (err) {
            if (err instanceof NoLocalBridgesError_1.NoLocalBridgesError) {
                status = 'no bridges';
            }
        }
        const response = {
            status,
        };
        res.json(response);
    })));
}
exports.authRouter.get('/loggedIn', asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let loggedIn;
    try {
        const api = yield getApi_1.getApi(req.getSessionId());
        loggedIn = !!api;
    }
    catch (e) {
        loggedIn = false;
    }
    res.json(loggedIn);
})));
//# sourceMappingURL=auth.js.map