"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapGet = void 0;
const logger_1 = require("../../shared/logger");
const mapRgx = /^\s*\(((?:.|\n)*)\)\s*$/;
const mapItemRgx = /^(\w+):\s*([^ ](?:.|\n)*)$/;
function mapGet(map, name) {
    const mapMatch = mapRgx.exec(map);
    if (!mapMatch) {
        throw new Error(`Input to mapGet is not a valid map: ${map}`);
    }
    const mapItems = mapMatch[1].trim().split(',').map(item => {
        const itemMatch = mapItemRgx.exec(item.trim());
        if (!itemMatch) {
            logger_1.logger.warn(`Map item not valid: ${item}`);
            return undefined;
        }
        return itemMatch.slice(1);
    }).filter(m => m !== undefined);
    const matchedItem = mapItems.find(i => i[0] === name);
    if (!matchedItem) {
        logger_1.logger.warn(`No map item with the name ${name} found in ${map}`);
        return '';
    }
    else {
        return matchedItem[1];
    }
}
exports.mapGet = mapGet;
//# sourceMappingURL=mapGet.js.map