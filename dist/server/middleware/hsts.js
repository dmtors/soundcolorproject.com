"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hstsMiddleware = void 0;
const config_1 = require("../config");
const TWO_YEARS = 60 * 60 * 24 * 365 * 2;
exports.hstsMiddleware = (req, res, next) => {
    if (!req.secure && req.get('x-forwarded-proto') !== 'https' && !config_1.config.dev && !config_1.config.standaloneApp) {
        res.setHeader('Strict-Transport-Security', `max-age=${TWO_YEARS}; includeSubDomains`);
        return res.redirect('https://' + req.hostname + req.url);
    }
    next();
};
//# sourceMappingURL=hsts.js.map