"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringify = exports.parse = void 0;
function splitToArray(string, keepKey = false) {
    let count = 0;
    let quote = false;
    let escape = false;
    let last = 0;
    let comment = false;
    const array = [];
    for (let i = 0; i < string.length; i++) {
        if (escape === true) {
            escape = false;
            continue;
        }
        const char = string[i];
        if (comment === 'line') {
            if (char === '\n') {
                comment = false;
            }
            last = i + 1;
            continue;
        }
        if (comment === 'block') {
            if (char === '*') {
                const next = string[i + 1];
                if (next === '/') {
                    i++;
                    comment = false;
                }
            }
            last = i + 1;
            continue;
        }
        if (char === "'") {
            if (!quote) {
                quote = true;
                if (count === 0 && !keepKey) {
                    const tmp = string.slice(last, i).trim();
                    last = i;
                    if (tmp !== '') {
                        array.push(tmp);
                    }
                }
                continue;
            }
            quote = false;
            if (count === 0) {
                array.push(string.slice(last, i + 1));
                last = i + 1;
            }
            continue;
        }
        if (quote) {
            if (char === '\\') {
                escape = true;
                continue;
            }
            continue;
        }
        if (char === '{' || char === '[') {
            count++;
            if (count === 1 && !keepKey) {
                const tmp = string.slice(last, i).trim();
                last = i;
                if (tmp !== '') {
                    array.push(tmp);
                }
            }
            continue;
        }
        if (char === '}' || char === ']') {
            count--;
            if (count < 0) {
                const tmp = string.slice(last, i).trim();
                if (tmp !== '') {
                    array.push(tmp);
                }
                break;
            }
            if (count === 0) {
                array.push(string.slice(last, i + 1));
                last = i + 1;
            }
            continue;
        }
        if (count > 0) {
            continue;
        }
        if (char === ',' || char === '\n') {
            const tmp = string.slice(last, i).trim();
            last = i + 1;
            if (tmp !== '') {
                array.push(tmp);
            }
            continue;
        }
        if (last < i) {
            continue;
        }
        if (char.trim() === '') {
            last = i + 1;
            continue;
        }
        if (char === '/') {
            const next = string[i + 1];
            if (next === '/') {
                i++;
                comment = 'line';
                last = i + 1;
                continue;
            }
            if (next === '*') {
                i++;
                comment = 'block';
                last = i + 1;
                continue;
            }
        }
    }
    if (!quote && count === 0) {
        const tmp = string.slice(last).trim();
        if (tmp !== '') {
            array.push(tmp);
        }
    }
    return array;
}
function tempArrayToSTONArray(array) {
    const out = [];
    for (let i = 0; i < array.length; i++) {
        const ston = parse(array[i]);
        if (ston === undefined) {
            return undefined;
        }
        out.push(ston);
    }
    return out;
}
function tempArrayToSTONObject(array) {
    const out = {};
    for (let i = 0; i < array.length; i++) {
        const string = array[i].trimStart();
        const result = string.match(/^[\w-]+/);
        if (result === null) {
            const ston = parse(string);
            if (ston === undefined) {
                return undefined;
            }
            out.__ = ston;
            continue;
        }
        const key = result[0];
        let valStr = string.slice(key.length).trimStart();
        if (valStr === '') {
            out[key] = true;
        }
        else {
            const value = parse(valStr);
            if (value === undefined) {
                return undefined;
            }
            out[key] = value;
        }
    }
    return out;
}
function parseToString(string) {
    const array = [];
    let escape = false;
    for (let i = 0; i < string.length; i++) {
        const char = string[i];
        if (escape === true) {
            escape = false;
            if (char !== '\\' && char !== "'") {
                array.push('\\');
            }
            array.push(char);
            continue;
        }
        if (char === '\\') {
            escape = true;
            continue;
        }
        if (char === "'") {
            break;
        }
        array.push(char);
    }
    return array.join('');
}
function parseToArray(string) {
    return tempArrayToSTONArray(splitToArray(string));
}
function parseToObject(string) {
    return tempArrayToSTONObject(splitToArray(string, true));
}
function parse(string) {
    string = string.trimStart();
    if (string === '') {
        return undefined;
    }
    const start = string[0];
    if (start === "'") {
        return parseToString(string.slice(1));
    }
    if (start === '[') {
        return parseToArray(string.slice(1));
    }
    if (start === '{') {
        return parseToObject(string.slice(1));
    }
    string = string.trimEnd();
    if (string === 'true') {
        return true;
    }
    if (string === 'false') {
        return false;
    }
    if (/^(?:[+-]?Infinity|NaN|0x[\da-fA-F]+|0o[0-7]+|0b[01]+|[+-]?(?:\d*\.?\d+|\d+\.)(?:e[+-]?\d+)?)$/.test(string)) {
        return Number(string);
    }
    if (/[',{}\[\]\n\r]/.test(string)) {
        return undefined;
    }
    return string;
}
exports.parse = parse;
function stringifyString(string) {
    return "'" + string.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/(^|[^\\])\\\\(?=[^\\"'])/g, '$1\\') + "'";
}
function stringifyArray(array, { indentTarget, indentLevel, addDecorativeComma }) {
    indentTarget = indentTarget !== null && indentTarget !== void 0 ? indentTarget : 'none';
    indentLevel = indentLevel !== null && indentLevel !== void 0 ? indentLevel : 1;
    addDecorativeComma = addDecorativeComma !== null && addDecorativeComma !== void 0 ? addDecorativeComma : 'never';
    const out = [];
    const expand = array.length > 1 && (indentTarget === 'all' || indentTarget === 'array' || indentTarget === 'arrayInObjectAndThis');
    if (indentTarget === 'arrayInObjectAndThis') {
        indentTarget = 'arrayInObject';
    }
    for (let i = 0; i < array.length; i++) {
        const string = stringify(array[i], { indentTarget, indentLevel: indentLevel + (expand ? 1 : 0), addDecorativeComma });
        if ((string.endsWith("'") || string.endsWith('}') || string.endsWith(']')) && addDecorativeComma !== 'always'
            || i === (array.length - 1) || expand) {
            out.push(string);
        }
        else {
            out.push(string + ',');
        }
    }
    let add = '';
    for (let i = 1; i < indentLevel; i++) {
        add += '    ';
    }
    if (expand) {
        return '[' + '\n    ' + add + out.join('\n    ' + add) + '\n' + add + ']';
    }
    else {
        return '[' + out.join('') + ']';
    }
}
function stringifyObject(object, { indentTarget, indentLevel, addDecorativeComma }) {
    indentTarget = indentTarget !== null && indentTarget !== void 0 ? indentTarget : 'none';
    indentLevel = indentLevel !== null && indentLevel !== void 0 ? indentLevel : 1;
    addDecorativeComma = addDecorativeComma !== null && addDecorativeComma !== void 0 ? addDecorativeComma : 'never';
    const out = [];
    const keys = Object.keys(object);
    const expand = keys.length > 1 && (indentTarget === 'all' || indentTarget === 'object');
    if (indentTarget === 'arrayInObject') {
        indentTarget = 'arrayInObjectAndThis';
    }
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const result = key.match(/^[\w-]+$/);
        if (result === null) {
            continue;
        }
        const value = object[key];
        const string = stringify(value, { indentTarget, indentLevel: indentLevel + (expand ? 1 : 0), addDecorativeComma });
        if (string.startsWith("'") || string.startsWith('[') || string.startsWith('{')) {
            if (addDecorativeComma !== 'always' && addDecorativeComma !== 'inObject' || i === (keys.length - 1) || expand) {
                out.push((key === '__' ? '' : key) + string);
            }
            else {
                out.push((key === '__' ? '' : key) + string + ',');
            }
        }
        else if (string === 'true') {
            if (i === (keys.length - 1) || expand) {
                out.push(key);
            }
            else {
                out.push(key + ',');
            }
        }
        else {
            if (i === (keys.length - 1) || expand) {
                out.push(key + ' ' + string);
            }
            else {
                out.push(key + ' ' + string + ',');
            }
        }
    }
    let add = '';
    for (let i = 1; i < indentLevel; i++) {
        add += '    ';
    }
    if (expand) {
        return '{' + '\n    ' + add + out.join('\n    ' + add) + '\n' + add + '}';
    }
    else {
        return '{' + out.join('') + '}';
    }
}
function stringify(ston, beautifyOptions = {}) {
    if (ston === undefined) {
        return '';
    }
    if (typeof ston === 'number') {
        return ston.toString();
    }
    if (typeof ston === 'string') {
        return stringifyString(ston);
    }
    if (ston === true) {
        return 'true';
    }
    if (ston === false) {
        return 'false';
    }
    if (Array.isArray(ston)) {
        return stringifyArray(ston, beautifyOptions);
    }
    return stringifyObject(ston, beautifyOptions);
}
exports.stringify = stringify;
