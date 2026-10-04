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
exports.getApi = exports.createApiFromAccessCode = exports.getLocalApi = exports.getHueRedirectUrl = void 0;
const os_1 = require("os");
const logger_1 = require("../../shared/logger");
const config_1 = require("../config");
const oauthState_1 = require("../db/oauthState");
const remoteCredentials_1 = require("../db/remoteCredentials");
const NoLocalBridgesError_1 = require("../errors/NoLocalBridgesError");
const RedirectError_1 = require("../errors/RedirectError");
const hue_1 = require("../hue");
const appData_1 = require("./appData");
const cache_1 = require("./cache");
const getLocalBridges_1 = require("./getLocalBridges");
function bridgeUserFile(bridge) {
    return `user.${bridge.name}.${bridge.ipaddress}.${bridge.modelid}.json`;
}
function writeLocalUser(bridge, user) {
    return appData_1.writeJsonFile(bridgeUserFile(bridge), user);
}
function readLocalUser(bridge) {
    return appData_1.readJsonFile(bridgeUserFile(bridge));
}
function localUserFileExists(bridge) {
    return appData_1.dataFileExists(bridgeUserFile(bridge));
}
function createAccess() {
    return hue_1.v3.api.createRemote(config_1.config.clientId, config_1.config.clientSecret);
}
function getHueRedirectUrl(session) {
    return __awaiter(this, void 0, void 0, function* () {
        const state = yield oauthState_1.generateOauthState(session, 'hue');
        const access = createAccess();
        return access.getAuthCodeUrl(os_1.hostname(), config_1.config.appId, state);
    });
}
exports.getHueRedirectUrl = getHueRedirectUrl;
const FIFTEEN_SECONDS = 1000 * 15;
function getRemoteApi(session) {
    return __awaiter(this, void 0, void 0, function* () {
        let credentials = null;
        const api = yield cache_1.apiCache.getOrExecute(session, () => __awaiter(this, void 0, void 0, function* () {
            credentials = yield remoteCredentials_1.getRemoteCredentials(session);
            if (!credentials) {
                throw new RedirectError_1.RedirectError(yield getHueRedirectUrl(session), 'No OAuth tokens found for the current session');
            }
            const { tokens: { access, refresh }, username } = credentials;
            if (refresh.expiresAt < Date.now()) {
                yield remoteCredentials_1.deleteRemoteCredentials(session);
                throw new RedirectError_1.RedirectError(yield getHueRedirectUrl(session), 'OAuth tokens for the current session have expired');
            }
            const api = yield createAccess().connectWithTokens(access.value, refresh.value, username, FIFTEEN_SECONDS, 'web_server');
            api._getTransport().configureLimiter({
                maxConcurrent: 10,
                minTime: 0,
            });
            return api;
        }));
        if (!credentials) {
            credentials = yield remoteCredentials_1.getRemoteCredentials(session);
        }
        if (credentials && credentials.tokens.access.expiresAt < Date.now()) {
            yield api.remote.refreshTokens();
            const newCreds = api.remote.getRemoteAccessCredentials();
            yield remoteCredentials_1.saveRemoteCredentials(session, newCreds);
        }
        return api;
    });
}
function getLocalUser(bridge) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield localUserFileExists(bridge)) {
            const fileUser = yield readLocalUser(bridge);
            if (fileUser && fileUser.clientkey && fileUser.username) {
                return fileUser;
            }
        }
        const api = yield hue_1.v3.api.createLocal(bridge.ipaddress).connect();
        const user = yield api.users.createUser('soundcolorproject', os_1.hostname());
        yield writeLocalUser(bridge, user);
        return user;
    });
}
let localApi = undefined;
function getLocalApi() {
    return __awaiter(this, void 0, void 0, function* () {
        if (localApi) {
            return localApi;
        }
        const bridges = yield getLocalBridges_1.getLocalBridges();
        const bridge = bridges[0];
        if (!bridge) {
            throw new NoLocalBridgesError_1.NoLocalBridgesError();
        }
        const { username, clientkey } = yield getLocalUser(bridge);
        localApi = yield hue_1.v3.api.createLocal(bridge.ipaddress).connect(username, clientkey);
        localApi._getTransport().configureLimiter({
            maxConcurrent: 10,
            minTime: 0,
        });
        return localApi;
    });
}
exports.getLocalApi = getLocalApi;
function createApiFromAccessCode(session, accessCode) {
    return __awaiter(this, void 0, void 0, function* () {
        const api = yield createAccess().connectWithCode(accessCode);
        api._getTransport().configureLimiter({
            maxConcurrent: 10,
            minTime: 0,
        });
        const remoteCredentials = api.remote.getRemoteAccessCredentials();
        logger_1.logger.info(`Remote API Access Credentials:\n ${JSON.stringify(remoteCredentials, null, 2)}\n`);
        logger_1.logger.info(`The Access Token is valid until:  ${new Date(remoteCredentials.tokens.access.expiresAt)}`);
        logger_1.logger.info(`The Refresh Token is valid until: ${new Date(remoteCredentials.tokens.refresh.expiresAt)}`);
        yield remoteCredentials_1.saveRemoteCredentials(session, remoteCredentials);
        cache_1.apiCache.set(session, api);
        return api;
    });
}
exports.createApiFromAccessCode = createApiFromAccessCode;
function getApi(session) {
    return __awaiter(this, void 0, void 0, function* () {
        if (config_1.config.remoteApi) {
            return getRemoteApi(session);
        }
        else {
            return getLocalApi();
        }
    });
}
exports.getApi = getApi;
if (!config_1.config.remoteApi) {
    getLocalApi().catch(e => {
        logger_1.logger.info('Local api not initialized. A user probably needs to be created --', e);
    });
}
//# sourceMappingURL=getApi.js.map