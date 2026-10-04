"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = void 0;
const express_1 = require("express");
const auth_1 = require("./auth");
const email_1 = require("./email");
const hue_1 = require("./hue");
const local_1 = require("./local");
exports.apiRouter = express_1.Router();
exports.apiRouter.use('/auth', auth_1.authRouter);
exports.apiRouter.use('/email', email_1.emailRouter);
exports.apiRouter.use('/hue', hue_1.hueRouter);
exports.apiRouter.use('/local', local_1.localRouter);
//# sourceMappingURL=index.js.map