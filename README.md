# STON
```js
const ston=require('ston/commonjs/dist/mod')
const example=`{
    key value
    // default value is true
    standalone-key
    /*
     default key is __
     */
    'standalone-value'
}`
console.log(ston.stringifyWithComment(ston.parseWithIndex(example).value,{
    indentTarget:'all',
    useUnquotedString:true,
})===example)
```