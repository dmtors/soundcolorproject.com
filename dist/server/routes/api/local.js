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
exports.localRouter = void 0;
const express_1 = require("express");
const asyncHandler = require("express-async-handler");
const getLocalBridges_1 = require("../../hue-helpers/getLocalBridges");
exports.localRouter = express_1.Router();
exports.localRouter.get('/bridges', asyncHandler((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bridges = yield getLocalBridges_1.getLocalBridges();
    res.json(bridges);
})));
//# sourceMappingURL=local.js.map