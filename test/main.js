const ston=require('../dist/mod')
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
console.log(ston.stringify(ston.parseWithIndex(example),{
    indentTarget:'all',
    addDecorativeSpace:'always',
}))
console.log(ston.stringifyWithComment(ston.parseWithIndex(example).value,{
    indentTarget:'all',
    useUnquotedString:true,
})===example)