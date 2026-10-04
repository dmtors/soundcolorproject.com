"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiCache = void 0;
const Cache = require("node-cache");
const localCache = new Cache({
    checkperiod: 30,
    useClones: false,
});
function makeAccessors(prefix, ttl) {
    const prefixer = (key) => `${prefix}:${key}`;
    const has = (key) => {
        return localCache.has(prefixer(key));
    };
    const set = (key, value) => {
        return localCache.set(prefixer(key), value, ttl);
    };
    const get = (key) => {
        const cacheKey = prefixer(key);
        if (!localCache.has(cacheKey)) {
            return undefined;
        }
        localCache.ttl(cacheKey, ttl);
        return localCache.get(cacheKey);
    };
    const del = (key) => {
        return localCache.del(prefixer(key));
    };
    const take = (key) => {
        const cacheKey = prefixer(key);
        if (!localCache.has(cacheKey)) {
            return undefined;
        }
        const value = localCache.get(cacheKey);
        localCache.del(cacheKey);
        return value;
    };
    function getOrExecute(key, cb) {
        let existingValue = get(key);
        if (existingValue !== undefined)
            return existingValue;
        const cbResult = cb();
        if (cbResult instanceof Promise || typeof cbResult.then === 'function') {
            return cbResult.then(value => {
                set(key, value);
                return value;
            });
        }
        else {
            set(key, cbResult);
            return cbResult;
        }
    }
    return {
        has,
        set,
        get,
        del,
        take,
        getOrExecute,
    };
}
const API_TTL = 60 * 15;
exports.apiCache = makeAccessors('api', API_TTL);
//# sourceMappingURL=cache.js.map