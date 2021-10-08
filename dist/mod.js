"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringify = exports.stringifyWithComment = exports.parse = exports.parseWithIndex = void 0;
function splitToTmpArrayWithIndex(string, index, keepKey = false) {
    let count = 0;
    let quote = false;
    let escape = false;
    let last = 0;
    let commentType = false;
    let comments = [];
    const array = [];
    for (let i = 0; i < string.length; i++) {
        if (escape === true) {
            escape = false;
            continue;
        }
        const char = string[i];
        if (commentType === 'line') {
            if (char === '\n') {
                commentType = false;
                comments.push(string.slice(last, i).trimEnd());
                last = i + 1;
            }
            continue;
        }
        if (commentType === 'block') {
            if (char === '*') {
                const next = string[i + 1];
                if (next === '/') {
                    i++;
                    commentType = false;
                    comments.push(string.slice(last, i + 1).replace(/\n[ ]*/g, '\n '));
                    last = i + 1;
                }
            }
            continue;
        }
        if (char === "'") {
            if (!quote) {
                quote = true;
                if (count === 0 && !keepKey) {
                    const tmp = string.slice(last, i).trimEnd();
                    if (tmp.length > 0) {
                        array.push({
                            value: tmp,
                            index: index + last,
                            comment: comments.join('\n')
                        });
                        comments = [];
                    }
                    last = i;
                }
                continue;
            }
            quote = false;
            if (count === 0) {
                array.push({
                    value: string.slice(last, i + 1),
                    index: index + last,
                    comment: comments.join('\n')
                });
                comments = [];
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
                const tmp = string.slice(last, i).trimEnd();
                if (tmp.length > 0) {
                    array.push({
                        value: tmp,
                        index: index + last,
                        comment: comments.join('\n')
                    });
                    comments = [];
                }
                last = i;
            }
            continue;
        }
        if (char === '}' || char === ']') {
            count--;
            if (count < 0) {
                const tmp = string.slice(last, i).trimEnd();
                if (tmp.length > 0) {
                    array.push({
                        value: tmp,
                        index: index + last,
                        comment: comments.join('\n')
                    });
                    comments = [];
                }
                break;
            }
            if (count === 0) {
                array.push({
                    value: string.slice(last, i + 1),
                    index: index + last,
                    comment: comments.join('\n')
                });
                comments = [];
                last = i + 1;
            }
            continue;
        }
        if (count > 0) {
            continue;
        }
        if (char === ',' || char === '\n') {
            const tmp = string.slice(last, i).trimEnd();
            if (tmp.length > 0) {
                array.push({
                    value: tmp,
                    index: index + last,
                    comment: comments.join('\n')
                });
                comments = [];
            }
            last = i + 1;
            continue;
        }
        if (last < i) {
            continue;
        }
        if (char.trimEnd().length === 0) {
            last = i + 1;
            continue;
        }
        if (char === '/') {
            const next = string[i + 1];
            if (next === '/') {
                last = i;
                i++;
                commentType = 'line';
                continue;
            }
            if (next === '*') {
                last = i;
                i++;
                commentType = 'block';
                continue;
            }
        }
    }
    if (!quote && count === 0 && commentType === false) {
        const tmp = string.slice(last).trimEnd();
        if (tmp.length > 0) {
            array.push({
                value: tmp,
                index: index + last,
                comment: comments.join('\n')
            });
        }
    }
    return array;
}
function splitToTmpArray(string, keepKey = false) {
    let count = 0;
    let quote = false;
    let escape = false;
    let last = 0;
    let commentType = false;
    const array = [];
    for (let i = 0; i < string.length; i++) {
        if (escape === true) {
            escape = false;
            continue;
        }
        const char = string[i];
        if (commentType === 'line') {
            if (char === '\n') {
                commentType = false;
            }
            last = i + 1;
            continue;
        }
        if (commentType === 'block') {
            if (char === '*') {
                const next = string[i + 1];
                if (next === '/') {
                    i++;
                    commentType = false;
                }
            }
            last = i + 1;
            continue;
        }
        if (char === "'") {
            if (!quote) {
                quote = true;
                if (count === 0 && !keepKey) {
                    const tmp = string.slice(last, i).trimEnd();
                    if (tmp.length > 0) {
                        array.push(tmp);
                    }
                    last = i;
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
                const tmp = string.slice(last, i).trimEnd();
                if (tmp.length > 0) {
                    array.push(tmp);
                }
                last = i;
            }
            continue;
        }
        if (char === '}' || char === ']') {
            count--;
            if (count < 0) {
                const tmp = string.slice(last, i).trimEnd();
                if (tmp.length > 0) {
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
            const tmp = string.slice(last, i).trimEnd();
            if (tmp.length > 0) {
                array.push(tmp);
            }
            last = i + 1;
            continue;
        }
        if (last < i) {
            continue;
        }
        if (char.trimEnd().length === 0) {
            last = i + 1;
            continue;
        }
        if (char === '/') {
            const next = string[i + 1];
            if (next === '/') {
                i++;
                commentType = 'line';
                last = i + 1;
                continue;
            }
            if (next === '*') {
                i++;
                commentType = 'block';
                last = i + 1;
                continue;
            }
        }
    }
    if (!quote && count === 0) {
        const tmp = string.slice(last).trimEnd();
        if (tmp.length > 0) {
            array.push(tmp);
        }
    }
    return array;
}
function tmpArrayToSTONArrayValueWithIndex(array) {
    const out = [];
    for (const { value, index, comment } of array) {
        const ston = parseWithIndex(value, index, comment);
        if (ston === undefined) {
            return undefined;
        }
        out.push(ston);
    }
    return out;
}
function tmpArrayToSTONArray(array) {
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
function tmpArrayToSTONObjectValueWithIndex(array) {
    const out = {};
    for (const { value, index, comment } of array) {
        const result = value.match(/^\s*([\w-]+)/);
        if (result === null) {
            const ston = parseWithIndex(value, index, comment);
            if (ston === undefined) {
                return undefined;
            }
            out.__ = ston;
            continue;
        }
        const key = result[1];
        const length = result[0].length;
        let valStr = value.slice(length).trimEnd();
        if (valStr.length === 0) {
            out[key] = {
                value: true,
                index: index + length,
                comment
            };
        }
        else {
            const value = parseWithIndex(valStr, index + length, comment);
            if (value === undefined) {
                return undefined;
            }
            out[key] = value;
        }
    }
    return out;
}
function tmpArrayToSTONObject(array) {
    const out = {};
    for (let i = 0; i < array.length; i++) {
        const string = array[i];
        const result = string.match(/^\s*([\w-]+)/);
        if (result === null) {
            const ston = parse(string);
            if (ston === undefined) {
                return undefined;
            }
            out.__ = ston;
            continue;
        }
        const key = result[1];
        const length = result[0].length;
        let valStr = string.slice(length).trimEnd();
        if (valStr.length === 0) {
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
function parseToArrayValueWithIndex(string, index) {
    return tmpArrayToSTONArrayValueWithIndex(splitToTmpArrayWithIndex(string, index));
}
function parseToArray(string) {
    return tmpArrayToSTONArray(splitToTmpArray(string));
}
function parseToObjectValueWithIndex(string, index) {
    return tmpArrayToSTONObjectValueWithIndex(splitToTmpArrayWithIndex(string, index, true));
}
function parseToObject(string) {
    return tmpArrayToSTONObject(splitToTmpArray(string, true));
}
function parseToValueWithIndex(string, index) {
    if (string.length === 0) {
        return undefined;
    }
    const start = string[0];
    if (start === "'") {
        return parseToString(string.slice(1));
    }
    if (start === '[') {
        return parseToArrayValueWithIndex(string.slice(1), index + 1);
    }
    if (start === '{') {
        return parseToObjectValueWithIndex(string.slice(1), index + 1);
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
function parseWithIndex(string, index = 0, comment = '') {
    index += string.length;
    string = string.trimStart();
    index -= string.length;
    const value = parseToValueWithIndex(string, index);
    if (value === undefined) {
        return undefined;
    }
    return {
        value: value,
        index,
        comment
    };
}
exports.parseWithIndex = parseWithIndex;
function parse(string) {
    string = string.trimStart();
    if (string.length === 0) {
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
function stringifyString(string, useUnquotedString) {
    if (useUnquotedString) {
        if (string.length > 0
            && string[0].trim().length > 0
            && (string.length === 1
                || string[string.length - 1].trim().length > 0)
            && !/[',{}\[\]\n\r]/.test(string)
            && string !== 'true'
            && string !== 'false'
            && !/^(?:[+-]?Infinity|NaN|0x[\da-fA-F]+|0o[0-7]+|0b[01]+|[+-]?(?:\d*\.?\d+|\d+\.)(?:e[+-]?\d+)?)$/.test(string)
            && !string.startsWith('//')
            && !string.startsWith('/*')) {
            return string;
        }
    }
    const array = ["'"];
    for (let i = 0; i < string.length; i++) {
        const char = string[i];
        if (char === '\\') {
            if (i === string.length - 1) {
                array.push('\\\\');
                break;
            }
            const next = string[i + 1];
            if (next === '\\' || next === "'") {
                array.push('\\\\');
                continue;
            }
            array.push(char);
            continue;
        }
        if (char === "'") {
            array.push("\\'");
            continue;
        }
        array.push(char);
    }
    array.push("'");
    return array.join('');
}
function stringifyArrayWithComment(array, { indentTarget, indentLevel, addDecorativeComma, addDecorativeSpace, useUnquotedString }) {
    indentTarget = indentTarget ?? 'none';
    indentLevel = indentLevel ?? 0;
    addDecorativeComma = addDecorativeComma ?? 'never';
    const out = [];
    const expand = array.length > 1
        && (indentTarget === 'all' || indentTarget === 'array' || indentTarget === 'arrayInObjectAndThis')
        || array.find(val => val.comment.length > 0) !== undefined;
    if (indentTarget === 'arrayInObjectAndThis') {
        indentTarget = 'arrayInObject';
    }
    const comma = addDecorativeSpace === 'always' || addDecorativeSpace === 'afterComma' ? ', ' : ',';
    for (let i = 0; i < array.length; i++) {
        const { value, comment } = array[i];
        const string = stringifyWithComment(value, {
            indentTarget,
            indentLevel: indentLevel + (expand ? 1 : 0),
            addDecorativeComma,
            addDecorativeSpace,
            useUnquotedString,
        });
        if ((string.endsWith("'") || string.endsWith('}') || string.endsWith(']')) && addDecorativeComma !== 'always'
            || i === (array.length - 1) || expand) {
            if (comment.length > 0) {
                out.push(...comment.split('\n'));
            }
            out.push(string);
        }
        else {
            out.push(string + comma);
        }
    }
    let footAdd = '\n';
    for (let i = 0; i < indentLevel; i++) {
        footAdd += '    ';
    }
    let bodyAdd = footAdd;
    if (indentLevel >= 0) {
        bodyAdd += '    ';
    }
    if (expand) {
        return '[' + bodyAdd + out.join(bodyAdd) + footAdd + ']';
    }
    return '[' + out.join('') + ']';
}
function stringifyArray(array, { indentTarget, indentLevel, addDecorativeComma, addDecorativeSpace, useUnquotedString }) {
    indentTarget = indentTarget ?? 'none';
    indentLevel = indentLevel ?? 0;
    addDecorativeComma = addDecorativeComma ?? 'never';
    const out = [];
    const expand = array.length > 1 && (indentTarget === 'all' || indentTarget === 'array' || indentTarget === 'arrayInObjectAndThis');
    if (indentTarget === 'arrayInObjectAndThis') {
        indentTarget = 'arrayInObject';
    }
    const comma = addDecorativeSpace === 'always' || addDecorativeSpace === 'afterComma' ? ', ' : ',';
    for (let i = 0; i < array.length; i++) {
        const string = stringify(array[i], {
            indentTarget,
            indentLevel: indentLevel + (expand ? 1 : 0),
            addDecorativeComma,
            addDecorativeSpace,
            useUnquotedString,
        });
        if ((string.endsWith("'") || string.endsWith('}') || string.endsWith(']')) && addDecorativeComma !== 'always'
            || i === (array.length - 1) || expand) {
            out.push(string);
        }
        else {
            out.push(string + comma);
        }
    }
    let footAdd = '\n';
    for (let i = 0; i < indentLevel; i++) {
        footAdd += '    ';
    }
    let bodyAdd = footAdd;
    if (indentLevel >= 0) {
        bodyAdd += '    ';
    }
    if (expand) {
        return '[' + bodyAdd + out.join(bodyAdd) + footAdd + ']';
    }
    return '[' + out.join('') + ']';
}
function stringifyObjectWithComment(object, { indentTarget, indentLevel, addDecorativeComma, addDecorativeSpace, useUnquotedString }) {
    indentTarget = indentTarget ?? 'none';
    indentLevel = indentLevel ?? 0;
    addDecorativeComma = addDecorativeComma ?? 'never';
    const out = [];
    const keys = Object.keys(object);
    let expand = keys.length > 1
        && (indentTarget === 'all' || indentTarget === 'object');
    if (!expand) {
        for (const key of keys) {
            const val = object[key];
            if (val === undefined) {
                continue;
            }
            if (val.comment.length > 0) {
                expand = true;
                break;
            }
        }
    }
    if (indentTarget === 'arrayInObject') {
        indentTarget = 'arrayInObjectAndThis';
    }
    const comma = addDecorativeSpace === 'always' || addDecorativeSpace === 'afterComma' ? ', ' : ',';
    const spaceAfterKey = addDecorativeSpace === 'always' || addDecorativeSpace === 'afterKey' ? ' ' : '';
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const result = key.match(/^[\w-]+$/);
        if (result === null) {
            continue;
        }
        const val = object[key];
        if (val === undefined) {
            continue;
        }
        const { value, comment } = val;
        const string = stringifyWithComment(value, {
            indentTarget,
            indentLevel: indentLevel + (expand ? 1 : 0),
            addDecorativeComma,
            addDecorativeSpace,
            useUnquotedString: key === '__' && (typeof value === 'string') ? undefined : useUnquotedString,
        });
        if (comment.length > 0) {
            out.push(...comment.split('\n'));
        }
        if (string.startsWith("'") || string.startsWith('[') || string.startsWith('{')) {
            if (addDecorativeComma !== 'always' && addDecorativeComma !== 'inObject' || i === (keys.length - 1) || expand) {
                out.push((key === '__' ? '' : key + spaceAfterKey) + string);
            }
            else {
                out.push((key === '__' ? '' : key + spaceAfterKey) + string + comma);
            }
        }
        else if (string === 'true') {
            if (i === (keys.length - 1) || expand) {
                out.push(key);
            }
            else {
                out.push(key + comma);
            }
        }
        else {
            if (i === (keys.length - 1) || expand) {
                out.push(key + ' ' + string);
            }
            else {
                out.push(key + ' ' + string + comma);
            }
        }
    }
    let footAdd = '\n';
    for (let i = 0; i < indentLevel; i++) {
        footAdd += '    ';
    }
    let bodyAdd = footAdd;
    if (indentLevel >= 0) {
        bodyAdd += '    ';
    }
    if (expand) {
        return '{' + bodyAdd + out.join(bodyAdd) + footAdd + '}';
    }
    return '{' + out.join('') + '}';
}
function stringifyObject(object, { indentTarget, indentLevel, addDecorativeComma, addDecorativeSpace, useUnquotedString }) {
    indentTarget = indentTarget ?? 'none';
    indentLevel = indentLevel ?? 0;
    addDecorativeComma = addDecorativeComma ?? 'never';
    const out = [];
    const keys = Object.keys(object);
    const expand = keys.length > 1 && (indentTarget === 'all' || indentTarget === 'object');
    if (indentTarget === 'arrayInObject') {
        indentTarget = 'arrayInObjectAndThis';
    }
    const comma = addDecorativeSpace === 'always' || addDecorativeSpace === 'afterComma' ? ', ' : ',';
    const spaceAfterKey = addDecorativeSpace === 'always' || addDecorativeSpace === 'afterKey' ? ' ' : '';
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const result = key.match(/^[\w-]+$/);
        if (result === null) {
            continue;
        }
        const value = object[key];
        if (value === undefined) {
            continue;
        }
        const string = stringify(value, {
            indentTarget,
            indentLevel: indentLevel + (expand ? 1 : 0),
            addDecorativeComma,
            addDecorativeSpace,
            useUnquotedString: key === '__' && (typeof value === 'string') ? undefined : useUnquotedString,
        });
        if (string.startsWith("'") || string.startsWith('[') || string.startsWith('{')) {
            if (addDecorativeComma !== 'always' && addDecorativeComma !== 'inObject' || i === (keys.length - 1) || expand) {
                out.push((key === '__' ? '' : key + spaceAfterKey) + string);
            }
            else {
                out.push((key === '__' ? '' : key + spaceAfterKey) + string + comma);
            }
        }
        else if (string === 'true') {
            if (i === (keys.length - 1) || expand) {
                out.push(key);
            }
            else {
                out.push(key + comma);
            }
        }
        else {
            if (i === (keys.length - 1) || expand) {
                out.push(key + ' ' + string);
            }
            else {
                out.push(key + ' ' + string + comma);
            }
        }
    }
    let footAdd = '\n';
    for (let i = 0; i < indentLevel; i++) {
        footAdd += '    ';
    }
    let bodyAdd = footAdd;
    if (indentLevel >= 0) {
        bodyAdd += '    ';
    }
    if (expand) {
        return '{' + bodyAdd + out.join(bodyAdd) + footAdd + '}';
    }
    return '{' + out.join('') + '}';
}
function stringifyWithComment(ston, beautifyOptions = {}) {
    if (ston === undefined) {
        return '';
    }
    if (typeof ston === 'number') {
        return ston.toString();
    }
    if (typeof ston === 'string') {
        return stringifyString(ston, beautifyOptions.useUnquotedString);
    }
    if (ston === true) {
        return 'true';
    }
    if (ston === false) {
        return 'false';
    }
    if (Array.isArray(ston)) {
        return stringifyArrayWithComment(ston, beautifyOptions);
    }
    return stringifyObjectWithComment(ston, beautifyOptions);
}
exports.stringifyWithComment = stringifyWithComment;
function stringify(ston, beautifyOptions = {}) {
    if (ston === undefined) {
        return '';
    }
    if (typeof ston === 'number') {
        return ston.toString();
    }
    if (typeof ston === 'string') {
        return stringifyString(ston, beautifyOptions.useUnquotedString);
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
