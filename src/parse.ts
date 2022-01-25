import {parseToString} from './string'
export interface STONObject {
    [key: string]: STON | undefined
}
export type STONArray = STON[]
export type STON = STONObject | STONArray | string | number | boolean
function splitToTmpArray(string: string, keepKey = false) {
    let count = 0
    let quote = false
    let escape = false
    let last = 0
    let commentType: false | 'line' | 'block' = false
    const array: string[] = []
    for (let i = 0; i < string.length; i++) {
        if (escape === true) {
            escape = false
            continue
        }
        const char = string[i]
        if (commentType === 'line') {
            if (char === '\n') {
                commentType = false
            }
            last = i + 1
            continue
        }
        if (commentType === 'block') {
            if (char === '*') {
                const next = string[i + 1]
                if (next === '/') {
                    i++
                    commentType = false
                }
            }
            last = i + 1
            continue
        }
        if (char === "'") {
            if (!quote) {
                quote = true
                if (count === 0 && !keepKey) {
                    const tmp = string.slice(last, i).trimEnd()
                    if (tmp.length > 0) {
                        array.push(tmp)
                    }
                    last = i
                }
                continue
            }
            quote = false
            if (count === 0) {
                array.push(string.slice(last, i + 1))
                last = i + 1
            }
            continue
        }
        if (quote) {
            if (char === '\\') {
                escape = true
            }
            continue
        }
        if (char === '{' || char === '[') {
            count++
            if (count === 1 && !keepKey) {
                const tmp = string.slice(last, i).trimEnd()
                if (tmp.length > 0) {
                    array.push(tmp)
                }
                last = i
            }
            continue
        }
        if (char === '}' || char === ']') {
            count--
            if (count < 0) {
                const tmp = string.slice(last, i).trimEnd()
                if (tmp.length > 0) {
                    array.push(tmp)
                }
                break
            }
            if (count === 0) {
                array.push(string.slice(last, i + 1))
                last = i + 1
            }
            continue
        }
        if (count > 0) {
            continue
        }
        if (char === ',' || char === '\n') {
            const tmp = string.slice(last, i).trimEnd()
            if (tmp.length > 0) {
                array.push(tmp)
            }
            last = i + 1
            continue
        }
        if (last < i) {
            continue
        }
        if (char.trimEnd().length === 0) {
            last = i + 1
            continue
        }
        if (char === '/') {
            const next = string[i + 1]
            if (next === '/') {
                i++
                commentType = 'line'
                last = i + 1
                continue
            }
            if (next === '*') {
                i++
                commentType = 'block'
                last = i + 1
                continue
            }
        }
    }
    if (!quote && count === 0) {
        const tmp = string.slice(last).trimEnd()
        if (tmp.length > 0) {
            array.push(tmp)
        }
    }
    return array
}
function parseToArray(string: string) {
    const out: STONArray = []
    for (const item of splitToTmpArray(string)) {
        const ston = parse(item)
        if (ston === undefined) {
            return undefined
        }
        out.push(ston)
    }
    return out
}
function parseToObject(string: string) {
    const out: STONObject = {}
    for (const subString of splitToTmpArray(string, true)) {
        const result = subString.match(/^\s*([\w-]+)/)
        if (result === null) {
            const ston = parse(subString)
            if (ston === undefined) {
                return undefined
            }
            out.__ = ston
            continue
        }
        const key = result[1]
        const length = result[0].length
        let valueString = subString.slice(length).trimEnd()
        if (valueString.length === 0) {
            out[key] = true
        } else {
            const value = parse(valueString)
            if (value === undefined) {
                return undefined
            }
            out[key] = value
        }
    }
    return out
}
export function parse(string: string): STON | undefined {
    string = string.trimStart()
    if (string.length === 0) {
        return undefined
    }
    const start = string[0]
    if (start === "'") {
        return parseToString(string.slice(1))
    }
    if (start === '[') {
        return parseToArray(string.slice(1))
    }
    if (start === '{') {
        return parseToObject(string.slice(1))
    }
    string = string.trimEnd()
    if (string === 'true') {
        return true
    }
    if (string === 'false') {
        return false
    }
    if (/^(?:[+-]?Infinity|NaN|0x[\da-fA-F]+|0o[0-7]+|0b[01]+|[+-]?(?:\d*\.?\d+|\d+\.)(?:e[+-]?\d+)?)$/.test(string)) {
        return Number(string)
    }
    if (/[',{}\[\]\n\r]/.test(string)) {
        return undefined
    }
    return string
}