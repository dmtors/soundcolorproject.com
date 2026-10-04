"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = void 0;
const compression = require("compression");
const cookieParser = require("cookie-parser");
const express = require("express");
const path = require("path");
const errorHandler_1 = require("./middleware/errorHandler");
const hsts_1 = require("./middleware/hsts");
const session_1 = require("./middleware/session");
const storybook_1 = require("./middleware/storybook");
const webpack_1 = require("./middleware/webpack");
const routes_1 = require("./routes");
function buildApp() {
    const app = express();
    app.enable('trust proxy');
    app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);
    app.use(hsts_1.hstsMiddleware);
    app.use(compression());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(cookieParser());
    app.use(session_1.sessionMiddleware);
    app.use(routes_1.router);
    app.use(webpack_1.webpackMiddleware());
    app.use(webpack_1.webpackHotMiddleware());
    app.use(storybook_1.storybookMiddleware());
    app.use(express.static(path.join(__dirname, '../static'), {
        etag: true,
        lastModified: true,
    }));
    app.use(webpack_1.html5Fallback());
    app.use(errorHandler_1.errorHandler);
    return app;
}
exports.buildApp = buildApp;
//# sourceMappingURL=app.js.map