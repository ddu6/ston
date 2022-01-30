export function parseToString(string: string) {
    const array: string[] = []
    let escape: boolean = false
    for (const char of string) {
        if (escape === true) {
            escape = false
            if (char !== '\\' && char !== "'") {
                array.push('\\')
            }
            array.push(char)
            continue
        }
        if (char === '\\') {
            escape = true
            continue
        }
        if (char === "'") {
            break
        }
        array.push(char)
    }
    return array.join('')
}
export function stringifyString(string: string, useUnquotedString?: true) {
    if (useUnquotedString) {
        if (
            string.length > 0
            && string[0].trim().length > 0
            && (
                string.length === 1
                || string[string.length - 1].trim().length > 0
            )
            && !/[\n\r',\[\]{}]/.test(string)
            && string !== 'true'
            && string !== 'false'
            && !/^(?:[+-]?Infinity|NaN|0x[\dA-Fa-f]+|0o[0-7]+|0b[01]+|[+-]?(?:\d*\.?\d+|\d+\.)(?:e[+-]?\d+)?)$/.test(string)
            && !string.startsWith('//')
            && !string.startsWith('/*')
        ) {
            return string
        }
    }
    const array = ["'"]
    for (let i = 0; i < string.length; i++) {
        const char = string[i]
        if (char === '\\') {
            if (i === string.length - 1) {
                array.push('\\\\')
                break
            }
            const next = string[i + 1]
            if (next === '\\' || next === "'") {
                array.push('\\\\')
                continue
            }
            array.push(char)
            continue
        }
        if (char === "'") {
            array.push("\\'")
            continue
        }
        array.push(char)
    }
    array.push("'")
    return array.join('')
}