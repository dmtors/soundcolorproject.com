"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.browserAnsi = void 0;
const brightColors = {
    black: '',
    red: '',
    green: '',
    yellow: '',
    blue: '',
    magenta: '',
    cyan: '',
    white: '',
};
const DEFAULT_STATE = { display: 'block' };
function buildAnsi(state = DEFAULT_STATE) {
    const output = {
        toString: () => {
            const keys = Object.keys(state);
            return keys.slice(1).reduce((str, key) => `${str}; ${key}: ${state[key]}`, `${keys[0]}: ${state[keys[0]]}`);
        },
    };
    function appendStyle(newState) {
        return { get: () => buildAnsi(Object.assign(Object.assign({}, state), newState)) };
    }
    function fg(color) {
        return { get: () => buildAnsi(Object.assign(Object.assign({}, state), { 'foreground-color': color })) };
    }
    function fgBright(name) {
        return fg(brightColors[name]);
    }
    function bg(color) {
        return { get: () => buildAnsi(Object.assign(Object.assign({}, state), { 'background-color': color })) };
    }
    function bgBright(name) {
        return bg(brightColors[name]);
    }
    const descriptors = {
        reset: { get() { return buildAnsi(); } },
        bold: appendStyle({ 'font-weignt': 'bold' }),
        dim: appendStyle({ 'opacity': '0.75' }),
        italic: appendStyle({ 'font-style': 'italic' }),
        underline: appendStyle({ 'text-decoration': 'underline' }),
        hidden: appendStyle({ 'opacity': '0' }),
        strikethrough: appendStyle({ 'text-decoration': 'line-through' }),
        inverse: {
            get() {
                return buildAnsi(Object.assign(Object.assign({}, state), { 'foreground-color': state['background-color'], 'background-color': state['foreground-color'] }));
            },
        },
        black: fg('black'),
        red: fg('red'),
        green: fg('green'),
        yellow: fg('yellow'),
        blue: fg('blue'),
        magenta: fg('magenta'),
        cyan: fg('cyan'),
        white: fg('white'),
        gray: fg('gray'),
        grey: fg('grey'),
        blackBright: fgBright('black'),
        redBright: fgBright('red'),
        greenBright: fgBright('green'),
        yellowBright: fgBright('yellow'),
        blueBright: fgBright('blue'),
        magentaBright: fgBright('magenta'),
        cyanBright: fgBright('cyan'),
        whiteBright: fgBright('white'),
        bgBlack: bg('black'),
        bgRed: bg('red'),
        bgGreen: bg('green'),
        bgYellow: bg('yellow'),
        bgBlue: bg('blue'),
        bgMagenta: bg('magenta'),
        bgCyan: bg('cyan'),
        bgWhite: bg('white'),
        bgBlackBright: bgBright('black'),
        bgRedBright: bgBright('red'),
        bgGreenBright: bgBright('green'),
        bgYellowBright: bgBright('yellow'),
        bgBlueBright: bgBright('blue'),
        bgMagentaBright: bgBright('magenta'),
        bgCyanBright: bgBright('cyan'),
        bgWhiteBright: bgBright('white'),
    };
    Object.defineProperties(output, descriptors);
    return output;
}
exports.browserAnsi = buildAnsi();
//# sourceMappingURL=browserAnsi.js.map