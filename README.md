# STON
```js
const ston=require('ston')
console.log(ston.stringify(ston.parse(`{
    standalone-key
    // default val is true
    'default key' // is __
    /*
    - key must match \\w[\\w-]* and should not be quoted
    - str val can not be quoted with double quotes
    */
    unquoted-str is supported
}`)))
console.log(ston.stringify(ston.parse(`[
    -Infinity
    +2e-3
    .5
    0xFF
    0b11
    0o66
]`)))

/* output
{standalone-key,'default key'unquoted-str'is supported'}
[-Infinity,0.002,0.5,255,3,54]
*/
```