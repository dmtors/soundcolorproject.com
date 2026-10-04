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
exports.emailRouter = void 0;
const express_1 = require("express");
const asyncHandler = require("express-async-handler");
const logger_1 = require("../../../shared/logger");
const email_1 = require("../../helpers/email");
exports.emailRouter = express_1.Router();
function makeRateLimiter(limitMs, errorRespone) {
    const lastRequestTimes = new Map();
    return function limitByIp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const lastTime = lastRequestTimes.get(req.ip) || 0;
            if (Date.now() - lastTime > limitMs) {
                lastRequestTimes.set(req.ip, Date.now());
                return true;
            }
            logger_1.logger.warn(`Limited a request to ${req.url} from ${req.ip}`);
            if (typeof errorRespone === 'function') {
                yield errorRespone(req, res);
            }
            else {
                res.status(400).json(errorRespone);
            }
            return false;
        });
    };
}
const FIVE_MINUTES = 5 * 60 * 1000;
const emailLimiter = makeRateLimiter(FIVE_MINUTES, {
    success: false,
    message: 'You have to wait a bit before sending another email.',
});
exports.emailRouter.post('/sendFeedback', asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(yield emailLimiter(req, res))) {
        return;
    }
    const { message } = req.body;
    const { success } = yield email_1.sendSimpleEmailWithRetry({
        subject: 'Sound Color Project Feedback',
        message,
    });
    const response = {
        success,
    };
    if (!success) {
        res = res.status(500);
    }
    res.json(response);
})));
//# sourceMappingURL=email.js.map