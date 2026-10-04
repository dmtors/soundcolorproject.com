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
exports.sendSimpleEmailWithRetry = exports.sendSimpleEmail = void 0;
const nodemailer_1 = require("nodemailer");
const logger_1 = require("../../shared/logger");
const config_1 = require("../config");
const EmailCredentialsNotFoundError_1 = require("../errors/EmailCredentialsNotFoundError");
const EmailFailedToSendError_1 = require("../errors/EmailFailedToSendError");
let emailTransport;
function getEmailTransport() {
    if (!emailTransport) {
        if (!config_1.config.emailServer ||
            !config_1.config.emailUser ||
            !config_1.config.emailPass ||
            !config_1.config.emailRecipient) {
            logger_1.logger.error('Failed to find email credentials');
            logger_1.logger.error('config.emailServer', !!config_1.config.emailServer);
            logger_1.logger.error('config.emailUser', !!config_1.config.emailUser);
            logger_1.logger.error('config.emailPass', !!config_1.config.emailPass);
            logger_1.logger.error('config.emailRecipient', !!config_1.config.emailRecipient);
            throw new EmailCredentialsNotFoundError_1.EmailCredentialsNotFoundError();
        }
        try {
            emailTransport = nodemailer_1.createTransport({
                host: config_1.config.emailServer,
                auth: {
                    type: 'login',
                    user: config_1.config.emailUser,
                    pass: config_1.config.emailPass,
                },
                from: {
                    name: 'Sound Color Notifier',
                    address: config_1.config.emailUser,
                },
            });
        }
        catch (e) {
            logger_1.logger.error('Failed to initialize email transport:', e);
            throw e;
        }
    }
    return emailTransport;
}
function sendSimpleEmail(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const { to = config_1.config.emailRecipient, subject, message, throwOnFailure = false, } = opts;
        const transport = getEmailTransport();
        try {
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
            yield transport.sendMail({
                to,
                subject,
                text: message,
            });
            logger_1.logger.debug('Successfully sent email!');
            return {
                success: true,
            };
        }
        catch (error) {
            logger_1.logger.warn('Failed to send email message:', error);
            if (throwOnFailure) {
                throw new EmailFailedToSendError_1.EmailFailedToSendError(error);
            }
            return {
                success: false,
                error,
            };
        }
        finally {
            delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
        }
    });
}
exports.sendSimpleEmail = sendSimpleEmail;
function sendSimpleEmailWithRetry(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const { retryCount = 3, throwOnFailure = false, } = opts;
        let failureCount = 0;
        let result = yield sendSimpleEmail(Object.assign(Object.assign({}, opts), { throwOnFailure: false }));
        while (!result.success && failureCount < retryCount) {
            failureCount++;
            logger_1.logger.warn('Retrying...');
            result = yield sendSimpleEmail(Object.assign(Object.assign({}, opts), { throwOnFailure: false }));
        }
        if (!result.success) {
            logger_1.logger.warn(`Failed to send email, even with ${retryCount} retries.`);
            if (throwOnFailure) {
                throw new EmailFailedToSendError_1.EmailFailedToSendError(result.error);
            }
        }
        return result;
    });
}
exports.sendSimpleEmailWithRetry = sendSimpleEmailWithRetry;
//# sourceMappingURL=email.js.map