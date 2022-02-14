import {stringifyString} from './string'
import type {STONArrayWithIndexValue, STONObjectWithIndexValue, STONWithIndex, STONWithIndexValue} from './parse-with-index'
import type {BeautifyOptions} from './stringify'
function stringifyArrayWithComment(array: STONArrayWithIndexValue, {addDecorativeComma, addDecorativeSpace, indentLevel, indentTarget, useUnquotedString}: BeautifyOptions) {
    addDecorativeComma = addDecorativeComma ?? 'never'
    indentTarget = indentTarget ?? 'none'
    indentLevel = indentLevel ?? 0
    const out: string[] = []
    const expand = array.length > 1
        && (indentTarget === 'all' || indentTarget === 'array' || indentTarget === 'arrayInObjectAndThis')
        || array.find(value => value.comment.length > 0) !== undefined
    const nextIndentLevel = indentLevel + (expand ? 1 : 0)
    if (indentTarget === 'arrayInObjectAndThis') {
        indentTarget = 'arrayInObject'
    }
    const comma = addDecorativeSpace === 'always' || addDecorativeSpace === 'afterComma' ? ', ' : ','
    let nextString: string | undefined
    for (let i = 0; i < array.length; i++) {
        const valueWithComment = array[i]
        const {comment} = valueWithComment
        let string: string
        if (nextString === undefined) {
            string = stringifyWithComment(valueWithComment, {
                addDecorativeComma,
                addDecorativeSpace,
                indentTarget,
                indentLevel: nextIndentLevel,
                useUnquotedString,
            })
        } else {
            string = nextString
        }
        if (i !== array.length - 1) {
            nextString = stringifyWithComment(array[i + 1], {
                addDecorativeComma,
                addDecorativeSpace,
                indentTarget,
                indentLevel: nextIndentLevel,
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
            if (comment.length > 0) {
                out.push(...comment.split('\n'))
            }
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
function stringifyObjectWithComment(object: STONObjectWithIndexValue, {addDecorativeComma, addDecorativeSpace, indentLevel, indentTarget, useUnquotedString}: BeautifyOptions) {
    addDecorativeComma = addDecorativeComma ?? 'never'
    indentTarget = indentTarget ?? 'none'
    indentLevel = indentLevel ?? 0
    const out: string[] = []
    const keys = Object.keys(object)
    let expand = keys.length > 1 && (indentTarget === 'all' || indentTarget === 'object')
    if (!expand) {
        for (const key of keys) {
            const value = object[key]
            if (value === undefined) {
                continue
            }
            if (value.comment.length > 0) {
                expand = true
                break
            }
        }
    }
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
        const valueWithComment = object[key]
        if (valueWithComment === undefined) {
            continue
        }
        const {value, comment} = valueWithComment
        const string = stringifyWithComment(valueWithComment, {
            addDecorativeComma,
            addDecorativeSpace,
            indentTarget,
            indentLevel: nextIndentLevel,
            useUnquotedString: key === '__' && (typeof value === 'string') ? undefined : useUnquotedString
        })
        if (comment.length > 0) {
            out.push(...comment.split('\n'))
        }
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
        return `{${bodyAdd}${out.join(bodyAdd)}${footAdd}}`
    }
    return `{${out.join('')}}`
}
export function stringifyWithComment(ston: STONWithIndex<STONWithIndexValue> | undefined, beautifyOptions: BeautifyOptions = {}) {
    if (ston === undefined) {
        return ''
    }
    const {value} = ston
    if (Array.isArray(value)) {
        return stringifyArrayWithComment(value, beautifyOptions)
    }
    if (typeof value === 'object') {
        return stringifyObjectWithComment(value, beautifyOptions)
    }
    if (typeof value === 'string') {
        return stringifyString(value, beautifyOptions.useUnquotedString)
    }
    if (typeof value === 'number') {
        return value.toString()
    }
    if (value === true) {
        return 'true'
    }
    if (value === false) {
        return 'false'
    }
    return ''
}