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
exports.router = void 0;
const express_1 = require("express");
const asyncHandler = require("express-async-handler");
const config_1 = require("../config");
const getApi_1 = require("../hue-helpers/getApi");
const api_1 = require("./api");
exports.router = express_1.Router();
if (config_1.config.remoteApi) {
    exports.router.get('/login', asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const api = yield getApi_1.getApi(req.getSessionId());
        if (api) {
            res.redirect('/return-from-hue');
        }
    })));
    exports.router.get('/logout', asyncHandler((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield res.clearSession();
        res.redirect('/sovis');
    })));
}
exports.router.use('/api', api_1.apiRouter);
//# sourceMappingURL=index.js.map