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
exports.hueRouter = void 0;
const express_1 = require("express");
const asyncHandler = require("express-async-handler");
const logger_1 = require("../../../shared/logger");
const config_1 = require("../../config");
const groupRoundRobin_1 = require("../../db/groupRoundRobin");
const DbWriteError_1 = require("../../errors/DbWriteError");
const InputValidationError_1 = require("../../errors/InputValidationError");
const hue_1 = require("../../hue");
const getApi_1 = require("../../hue-helpers/getApi");
exports.hueRouter = express_1.Router();
exports.hueRouter.get('/groups', asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const api = yield getApi_1.getApi(req.getSessionId());
    const [rooms, zones] = yield Promise.all([
        api.groups.getRooms(),
        api.groups.getZones(),
    ]);
    rooms.forEach(room => {
        logger_1.logger.info('Room lights', room.lights);
    });
    const groupData = [...rooms, ...zones]
        .map(({ id, name, lights, type }) => ({
        id,
        name,
        type,
        lightCount: lights.length,
    }));
    res.json(groupData);
})));
exports.hueRouter.post('/groups/select', asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const api = yield getApi_1.getApi(req.getSessionId());
    if (!body || !body.groupId) {
        throw new InputValidationError_1.InputValidationError([
            'groupId',
        ]);
    }
    if (!config_1.config.disableBlink) {
        const state = new hue_1.GroupLightState().alertShort();
        yield api.groups.setGroupState(body.groupId, state);
    }
    res.status(204).end();
})));
function setColor(state, { h, s, v }) {
    return state
        .hue(Math.floor(h * 65535 / 360))
        .saturation(s * 100)
        .brightness(v * 100);
}
function updateGroupColor(api, { groupId, color }) {
    return __awaiter(this, void 0, void 0, function* () {
        const state = setColor(new hue_1.GroupLightState(), color)
            .transitiontime(10);
        yield api.groups.setGroupState(groupId, state);
    });
}
function updateRoundRobinColor(session, api, { groupId, color }, time = 2) {
    return __awaiter(this, void 0, void 0, function* () {
        const state = setColor(new hue_1.LightState(), color)
            .transitiontime(time);
        let lightId;
        try {
            lightId = yield groupRoundRobin_1.getNextLightId(session, groupId);
        }
        catch (e) {
            if (!(e instanceof DbWriteError_1.DbWriteError)) {
                throw e;
            }
            const group = yield api.groups.getGroup(groupId);
            const lightIds = group.lights.map(id => parseInt(id, 10));
            const lights = yield Promise.all(lightIds.map(id => api.lights.getLight(id)));
            const validIds = lights.filter(l => {
                return !!l.colorGamut;
            }).map(l => l.id);
            logger_1.logger.info('Setting up round robin');
            yield groupRoundRobin_1.setupRoundRobin(session, groupId, validIds);
            lightId = validIds[0];
        }
        logger_1.logger.info('Setting color on light', lightId);
        api.lights.setLightState(lightId, state).then(() => {
            logger_1.logger.info('Light color set for light', lightId);
        }).catch(e => {
            logger_1.logger.warn('Failed to set light color:', e);
        });
    });
}
exports.hueRouter.post('/groups/setColor', asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = req.getSessionId();
    const body = req.body;
    const api = yield getApi_1.getApi(session);
    if (!body || !body.groupId || !body.color) {
        throw new InputValidationError_1.InputValidationError([
            'groupId',
            'color',
        ]);
    }
    switch (body.mode) {
        case 'round-robin':
            yield updateRoundRobinColor(session, api, body);
            break;
        case 'group':
        default:
            yield updateGroupColor(api, body);
    }
    res.status(204).end();
})));
//# sourceMappingURL=hue.js.map