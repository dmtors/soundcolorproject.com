"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apply = exports.args = void 0;
const yargs = require("yargs");
const config_1 = require("../server/config");
const logger_1 = require("../shared/logger");
exports.args = yargs
    .boolean(['d', 'f', 'l', 'r', 's', 'V'])
    .count(['v'])
    .alias('d', 'debug')
    .alias('f', 'fullscreen')
    .alias('l', 'local')
    .alias('r', 'remote')
    .alias('s', 'service')
    .alias('v', 'verbose')
    .alias('V', 'version')
    .argv;
function apply() {
    logger_1.logger.info('args', exports.args);
    if (exports.args.local && exports.args.remote) {
        logger_1.logger.warn('Both remote and local mode requested -- falling back to local');
    }
    if (exports.args.fullscreen) {
        config_1.config.forcedFullscreen = true;
    }
    if (exports.args.remote) {
        config_1.config.remoteApi = true;
    }
    if (exports.args.local) {
        config_1.config.remoteApi = false;
    }
    if (exports.args.service) {
        config_1.config.serviceMode = true;
    }
    if (exports.args.verbose) {
        switch (exports.args.verbose) {
            case 1:
                logger_1.logger.logLevel = 'log';
                break;
            case 2:
                logger_1.logger.logLevel = 'info';
                break;
            default:
                logger_1.logger.logLevel = 'debug';
                break;
        }
    }
    config_1.init();
}
exports.apply = apply;
//# sourceMappingURL=args.js.map