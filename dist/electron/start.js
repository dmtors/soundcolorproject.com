"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FatalError_1 = require("../server/errors/FatalError");
const logger_1 = require("../shared/logger");
const bootstrap_1 = require("./bootstrap");
bootstrap_1.bootstrap().catch(e => {
    logger_1.logger.fatal(e);
    if (e instanceof FatalError_1.FatalError) {
        if (e.cause) {
            logger_1.logger.fatal('caused by:', e.cause);
        }
        process.exit(e.exitCode);
    }
    else {
        process.exit(1);
    }
});
//# sourceMappingURL=start.js.map