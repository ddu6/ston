import {stringifyString} from './string'
import type {STON, STONArray, STONObject} from './parse'
export interface BeautifyOptions {
    addDecorativeComma?: 'never' | 'always' | 'inObject'
    addDecorativeSpace?: 'never' | 'always' | 'afterKey' | 'afterComma'
    indentLevel?: number
    indentTarget?: 'none' | 'all' | 'array' | 'object' | 'arrayInObject' | 'arrayInObjectAndThis'
    useUnquotedString?: true
}
function stringifyArray(array: STONArray, {addDecorativeComma, addDecorativeSpace, indentLevel, indentTarget, useUnquotedString}: BeautifyOptions) {
    indentTarget = indentTarget ?? 'none'
    indentLevel = indentLevel ?? 0
    addDecorativeComma = addDecorativeComma ?? 'never'
    const out: string[] = []
    const expand = array.length > 1 && (indentTarget === 'all' || indentTarget === 'array' || indentTarget === 'arrayInObjectAndThis')
    const nextIndentLevel = indentLevel + (expand ? 1 : 0)
    if (indentTarget === 'arrayInObjectAndThis') {
        indentTarget = 'arrayInObject'
    }
    const comma = addDecorativeSpace === 'always' || addDecorativeSpace === 'afterComma' ? ', ' : ','
    let nextString: string | undefined
    for (let i = 0; i < array.length; i++) {
        let string: string
        if (nextString === undefined) {
            string = stringify(array[i], {
                indentTarget,
                indentLevel: nextIndentLevel,
                addDecorativeComma,
                addDecorativeSpace,
                useUnquotedString,
            })
        } else {
            string = nextString
        }
        if (i !== array.length - 1) {
            nextString = stringify(array[i + 1], {
                indentTarget,
                indentLevel: nextIndentLevel,
                addDecorativeComma,
                addDecorativeSpace,
                useUnquotedString,
            })
        }
        if (
            expand || i === array.length - 1
            || addDecorativeComma !== 'always' && (
                string.endsWith("'") || string.endsWith('}') || string.endsWith(']')
                || nextString !== undefined && (
                    nextString.endsWith("'") || nextString.endsWith('}') || nextString.endsWith(']')
                )
            )
        ) {
            out.push(string)
        } else {
            out.push(string + comma)
        }
    }
    if (expand) {
        let footAdd = '\n'
        for (let i = 0; i < indentLevel; i++) {
            footAdd += '    '
        }
        let bodyAdd = footAdd
        if (indentLevel >= 0) {
            bodyAdd += '    '
        }
        return `[${bodyAdd}${out.join(bodyAdd)}${footAdd}]`
    }
    return `[${out.join('')}]`
}
function stringifyObject(object: STONObject, {addDecorativeComma, addDecorativeSpace, indentLevel, indentTarget, useUnquotedString}: BeautifyOptions) {
    indentTarget = indentTarget ?? 'none'
    indentLevel = indentLevel ?? 0
    addDecorativeComma = addDecorativeComma ?? 'never'
    const out: string[] = []
    const keys = Object.keys(object)
    const expand = keys.length > 1 && (indentTarget === 'all' || indentTarget === 'object')
    const nextIndentLevel = indentLevel + (expand ? 1 : 0)
    if (indentTarget === 'arrayInObject') {
        indentTarget = 'arrayInObjectAndThis'
    }
    const comma = addDecorativeSpace === 'always' || addDecorativeSpace === 'afterComma' ? ', ' : ','
    const spaceAfterKey = addDecorativeSpace === 'always' || addDecorativeSpace === 'afterKey' ? ' ' : ''
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        const result = key.match(/^[\w-]+$/)
        if (result === null) {
            continue
        }
        const value = object[key]
        if (value === undefined) {
            continue
        }
        const string = stringify(value, {
            indentTarget,
            indentLevel: nextIndentLevel,
            addDecorativeComma,
            addDecorativeSpace,
            useUnquotedString: key === '__' && (typeof value === 'string') ? undefined : useUnquotedString,
        })
        if (string.startsWith("'") || string.startsWith('[') || string.startsWith('{')) {
            if (expand || i === keys.length - 1 || addDecorativeComma !== 'always' && addDecorativeComma !== 'inObject') {
                out.push((key === '__' ? '' : key + spaceAfterKey) + string)
            } else {
                out.push((key === '__' ? '' : key + spaceAfterKey) + string + comma)
            }
        } else if (string === 'true') {
            if (expand || i === keys.length - 1) {
                out.push(key)
            } else {
                out.push(key + comma)
            }
        } else {
            if (expand || i === keys.length - 1) {
                out.push(`${key} ${string}`)
            } else {
                out.push(`${key} ${string}${comma}`)
            }
        }
    }
    if (expand) {
        let footAdd = '\n'
        for (let i = 0; i < indentLevel; i++) {
            footAdd += '    '
        }
        let bodyAdd = footAdd
        if (indentLevel >= 0) {
            bodyAdd += '    '
        }
        return `{${bodyAdd}${out.join(bodyAdd)}${footAdd}}'`
    }
    return `{${out.join('')}}`
}
export function stringify(ston: STON | undefined, beautifyOptions: BeautifyOptions = {}) {
    if (Array.isArray(ston)) {
        return stringifyArray(ston, beautifyOptions)
    }
    if (typeof ston === 'object') {
        return stringifyObject(ston, beautifyOptions)
    }
    if (typeof ston === 'number') {
        return ston.toString()
    }
    if (typeof ston === 'string') {
        return stringifyString(ston, beautifyOptions.useUnquotedString)
    }
    if (ston === true) {
        return 'true'
    }
    if (ston === false) {
        return 'false'
    }
    return ''
}