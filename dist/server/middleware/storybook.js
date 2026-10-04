"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storybookMiddleware = void 0;
const fs = require("fs");
const path = require("path");
const url = require("url");
const logger_1 = require("../../shared/logger");
const config_1 = require("../config");
let proxy;
function getProxy(port) {
    if (!proxy) {
        proxy = require('express-http-proxy')(`http://localhost:${port}`);
    }
    return proxy;
}
const removePrefixForRoot = [
    /^\/storybook(\/(index.html)?)?$/,
    /^\/storybook\/sb_dll/,
    /^\/storybook\/runtime~main./,
    /^\/storybook\/vendors~main./,
    /^\/storybook\/main./,
];
const removePrefixForIframe = [
    /\.hot-update\.json$/,
    /__webpack_hmr$/,
];
function shouldRemovePrefix(req) {
    var _a;
    if ((_a = req.header('referer')) === null || _a === void 0 ? void 0 : _a.includes('iframe.html')) {
        return removePrefixForIframe.some(rgx => rgx.test(req.path));
    }
    return removePrefixForRoot.some(rgx => rgx.test(req.path));
}
const STORYBOOK_PATH = '/storybook';
function storybookMiddleware() {
    try {
        if (fs.existsSync(path.join(__dirname, '../../public/storybook'))) {
            return (_req, _res, next) => next();
        }
        process.env.BUILD = 'true';
        const storybookPort = config_1.config.port + 1;
        process.argv = ['node', 'start-storybook', '-p', `${storybookPort}`, '-s', path.join(__dirname, '../../static'), '--ci'];
        require('@storybook/react/dist/server');
        return (req, res, next) => {
            logger_1.logger.info('req.path', req.path);
            if (!req.path.startsWith(STORYBOOK_PATH)) {
                return next();
            }
            try {
                if (shouldRemovePrefix(req)) {
                    let origUrl = url.parse(req.url);
                    req.url = url.format(Object.assign(Object.assign({}, origUrl), { pathname: req.path.substring(STORYBOOK_PATH.length) }));
                    logger_1.logger.info('new url:', req.url);
                    logger_1.logger.info('new url:', req.path);
                }
                getProxy(storybookPort)(req, res, next);
            }
            catch (err) {
                logger_1.logger.error(err);
                next(err);
            }
        };
    }
    catch (err) {
        return (_req, _res, next) => next();
    }
}
exports.storybookMiddleware = storybookMiddleware;
//# sourceMappingURL=storybook.js.map