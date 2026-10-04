"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.html5Fallback = exports.webpackHotMiddleware = exports.webpackMiddleware = void 0;
const express = require("express");
const path = require("path");
const config_1 = require("../config");
let compiler = null;
let compilerError = null;
function getCompiler() {
    if (compilerError) {
        throw compilerError;
    }
    else if (!compiler) {
        try {
            const webpack = require('webpack');
            compiler = webpack(require('../../config/webpack').default({ appMode: config_1.config.standaloneApp }));
            console.info('Using webpack middleware');
        }
        catch (e) {
            compilerError = e;
            console.info('Using precompiled assets');
            throw e;
        }
    }
    return compiler;
}
let webpackMiddlewareInstance = null;
function webpackMiddleware() {
    if (!webpackMiddlewareInstance) {
        try {
            const webpackDevMiddleware = require('webpack-dev-middleware');
            webpackMiddlewareInstance = webpackDevMiddleware(getCompiler());
        }
        catch (e) {
            webpackMiddlewareInstance = express.static(path.join(__dirname, '../../public'), {
                etag: true,
                lastModified: true,
            });
        }
    }
    return webpackMiddlewareInstance;
}
exports.webpackMiddleware = webpackMiddleware;
function webpackHotMiddleware() {
    try {
        const webpackHotMiddleware = require('webpack-hot-middleware');
        return webpackHotMiddleware(getCompiler(), {
            heartbeat: 2000,
        });
    }
    catch (e) {
        return (_req, _res, next) => next();
    }
}
exports.webpackHotMiddleware = webpackHotMiddleware;
function html5Fallback() {
    const webpack = webpackMiddleware();
    return (req, res, next) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') {
            return next();
        }
        const newReq = Object.assign(Object.assign({}, req), { url: '/', originalUrl: '/' });
        webpack(newReq, res, next);
    };
}
exports.html5Fallback = html5Fallback;
//# sourceMappingURL=webpack.js.map