# STON
```js
const ston=require('ston')
const example=`{
    key value
    // default value is true
    standalone-key
    /*
     default key is __
     */
    'standalone-value'
}`
console.log(ston.stringify(ston.parse(example),{
    indentTarget:'all',
    useUnquotedString:true,
}))

/* output
{
    key value
    standalone-key
    'standalone-value'
}
*/
```