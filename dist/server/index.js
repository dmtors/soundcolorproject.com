"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../shared/logger");
const FatalError_1 = require("./errors/FatalError");
const startup_1 = require("./startup");
startup_1.startup().catch(e => {
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
//# sourceMappingURL=index.js.map