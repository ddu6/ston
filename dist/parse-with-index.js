import { parseToString } from './string';
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
function parseToArrayWithIndexValue(string, index) {
    const out = [];
    for (const { value, index: subIndex, comment } of splitToTmpArrayWithIndex(string, index)) {
        const ston = parseWithIndex(value, subIndex, comment);
        if (ston === undefined) {
            return undefined;
        }
        out.push(ston);
    }
    return out;
}
function parseToObjectWithIndexValue(string, index) {
    const out = {};
    for (const { value, index: subIndex, comment } of splitToTmpArrayWithIndex(string, index, true)) {
        const result = value.match(/^\s*([\w-]+)/);
        if (result === null) {
            const ston = parseWithIndex(value, subIndex, comment);
            if (ston === undefined) {
                return undefined;
            }
            out.__ = ston;
            continue;
        }
        const key = result[1];
        const length = result[0].length;
        let valueString = value.slice(length).trimEnd();
        if (valueString.length === 0) {
            out[key] = {
                value: true,
                index: subIndex + length,
                comment
            };
        }
        else {
            const value = parseWithIndex(valueString, subIndex + length, comment);
            if (value === undefined) {
                return undefined;
            }
            out[key] = value;
        }
    }
    return out;
}
function parseToWithIndexValue(string, index) {
    if (string.length === 0) {
        return undefined;
    }
    const start = string[0];
    if (start === "'") {
        return parseToString(string.slice(1));
    }
    if (start === '[') {
        return parseToArrayWithIndexValue(string.slice(1), index + 1);
    }
    if (start === '{') {
        return parseToObjectWithIndexValue(string.slice(1), index + 1);
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
export function parseWithIndex(string, index = 0, comment = '') {
    index += string.length;
    string = string.trimStart();
    index -= string.length;
    const value = parseToWithIndexValue(string, index);
    if (value === undefined) {
        return undefined;
    }
    return {
        value: value,
        index,
        comment
    };
}
