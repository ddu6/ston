const ston=require('../dist/mod')
console.log(ston.stringify(ston.parse(`{
    standalone-key
    // default val is true
    'default key' // is __
    /*
    - key must match [a-zA-Z_-]+ and should not be quoted
    - str val can not be quoted with double quotes
    */
    unquoted-str is supported
}`),'all'))
console.log(ston.stringify(ston.parse(`[
    -Infinity
    +2e-3
    .5
    0xFF
    0b11
    0o66
]`)))