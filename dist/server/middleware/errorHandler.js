"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const node_hue_api_1 = require("node-hue-api");
const logger_1 = require("../../shared/logger");
const ServerErrorCode_1 = require("../../shared/ServerErrorCode");
const config_1 = require("../config");
const RedirectError_1 = require("../errors/RedirectError");
const ServerError_1 = require("../errors/ServerError");
const HueErrorCode_1 = require("../hue/HueErrorCode");
exports.errorHandler = (err, req, res, _next) => {
    let status = 500;
    let errorCode = ServerErrorCode_1.ServerErrorCode.UNKNOWN_ERROR;
    let data = null;
    let message = ServerError_1.DEFAULT_ERROR_MESSAGE;
    if (err instanceof RedirectError_1.RedirectError && req.accepts('text/html')) {
        return res.redirect(err.redirectTo);
    }
    else if (err instanceof ServerError_1.ServerError) {
        status = err.statusCode;
        data = err.errorData;
        message = err.errorMessage;
        errorCode = err.errorCode;
        logger_1.logger.info(`${status} -- ${message}`);
        if (data) {
            logger_1.logger.info(JSON.stringify(data, null, 2));
        }
    }
    else if (err instanceof node_hue_api_1.ApiError) {
        logger_1.logger.warn(err.stack);
        const hueError = err.getHueError();
        if (hueError) {
            errorCode = 10000 + hueError.type;
            logger_1.logger.warn(JSON.stringify(hueError.payload, null, 2));
            if (hueError.type === HueErrorCode_1.HueErrorCode.INVALID_ACCESS_TOKEN) {
                res.clearSession().catch(e => {
                    logger_1.logger.warn('Failed to clear session data for session.', e);
                });
                if (req.accepts('text/html')) {
                    return res.redirect('/login');
                }
            }
            if (config_1.config.dev) {
                data = hueError.payload;
                if (data) {
                    delete data.type;
                }
            }
            else {
                message = hueError.message;
            }
            switch (hueError.type) {
                case HueErrorCode_1.HueErrorCode.UNAUTHORIZED_USER:
                case HueErrorCode_1.HueErrorCode.LINK_BUTTON_NOT_PRESSED:
                    status = 403;
                    break;
            }
            if (hueError.type === 101) {
                status = 403;
            }
        }
    }
    else if (config_1.config.dev) {
        if (err instanceof Error) {
            message = err.stack || err.message;
        }
        else {
            message = err.toString();
        }
    }
    data = Object.assign({ message,
        errorCode }, data);
    res.status(status).send(data);
};
//# sourceMappingURL=errorHandler.js.map