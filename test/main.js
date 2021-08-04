const ston=require('../dist/mod')
const example=`{
    standalone-key
    // default val is true
    'default key' // is __
    /*
    - key must match [a-zA-Z_-]+ and should not be quoted
    - str val can not be quoted with double quotes
    */
    unquoted-str is supported
    number[
        // supported number formats
        /* almost all number formats in js is supported */
        .5
        +2e-3
        [-Infinity,NaN]
        /*
        - 066 will be parsed as 66 rather than 54
        - 0o66 will be parsed as 54
        */
        [0xFF,0b11,0o66]
    ]
}`
console.log(ston.stringify(ston.parse(example),{indentTarget:'object'}))
console.log(ston.stringify(ston.parseWithIndex(example),{indentTarget:'object'}))
console.log(ston.stringifyWithComment(ston.parseWithIndex(example).value,{addDecorativeSpace:'always'}))