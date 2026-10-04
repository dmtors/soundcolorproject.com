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
exports.randomString = exports.randomLetter = void 0;
const crypto_1 = require("crypto");
const util_1 = require("util");
const letters = 'abcdefghijklmnopqrstuvwxyz';
function randomLetter() {
    const num = Math.floor(Math.random() * letters.length);
    const capital = Math.random() < 0.5;
    const letter = letters[num];
    return capital ? letter.toUpperCase() : letter;
}
exports.randomLetter = randomLetter;
const randomBytesAsync = util_1.promisify(crypto_1.randomBytes);
function randomString(length) {
    return __awaiter(this, void 0, void 0, function* () {
        length = Math.max(1, length);
        const byteLength = Math.ceil(length * 6 / 8);
        const byteBuffer = yield randomBytesAsync(byteLength);
        return byteBuffer.toString('base64').substring(0, length);
    });
}
exports.randomString = randomString;
//# sourceMappingURL=random.js.map