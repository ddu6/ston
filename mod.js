var e={d:(t,n)=>{for(var i in n)e.o(n,i)&&!e.o(t,i)&&Object.defineProperty(t,i,{enumerable:!0,get:n[i]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t)},t={};function n(e){const t=[];let n=!1;for(const i of e)if(!0!==n)if("\\"!==i){if("'"===i)break;t.push(i)}else n=!0;else n=!1,"\\"!==i&&"'"!==i&&t.push("\\"),t.push(i);return t.join("")}function i(e,t){if(t&&e.length>0&&e[0].trim().length>0&&(1===e.length||e[e.length-1].trim().length>0)&&!/[\n\r',\[\]{}]/.test(e)&&"true"!==e&&"false"!==e&&!/^(?:[+-]?Infinity|NaN|0x[\dA-Fa-f]+|0o[0-7]+|0b[01]+|[+-]?(?:\d*\.?\d+|\d+\.)(?:e[+-]?\d+)?)$/.test(e)&&!e.startsWith("//")&&!e.startsWith("/*"))return e;const n=["'"];for(let t=0;t<e.length;t++){const i=e[t];if("\\"!==i)"'"!==i?n.push(i):n.push("\\'");else{if(t===e.length-1){n.push("\\\\");break}const o=e[t+1];if("\\"===o||"'"===o){n.push("\\\\");continue}n.push(i)}}return n.push("'"),n.join("")}function o(e,t=!1){let n=0,i=!1,o=!1,s=0,r=!1;const c=[];for(let l=0;l<e.length;l++){if(!0===o){o=!1;continue}const a=e[l];if("line"!==r)if("block"!==r)if("'"!==a){if(i)"\\"===a&&(o=!0);else if("{"!==a&&"["!==a)if("}"!==a&&"]"!==a){if(!(n>0))if(","!==a&&"\n"!==a){if(!(s<l))if(0!==a.trimEnd().length){if("/"===a){const t=e[l+1];if("/"===t){l++,r="line",s=l+1;continue}if("*"===t){l++,r="block",s=l+1;continue}}}else s=l+1}else{const t=e.slice(s,l).trimEnd();t.length>0&&c.push(t),s=l+1}}else{if(n--,n<0){const t=e.slice(s,l).trimEnd();t.length>0&&c.push(t);break}0===n&&(c.push(e.slice(s,l+1)),s=l+1)}else if(n++,1===n&&!t){const t=e.slice(s,l).trimEnd();t.length>0&&c.push(t),s=l}}else{if(!i){if(i=!0,0===n&&!t){const t=e.slice(s,l).trimEnd();t.length>0&&c.push(t),s=l}continue}i=!1,0===n&&(c.push(e.slice(s,l+1)),s=l+1)}else"*"===a&&"/"===e[l+1]&&(l++,r=!1),s=l+1;else"\n"===a&&(r=!1),s=l+1}if(!i&&0===n){const t=e.slice(s).trimEnd();t.length>0&&c.push(t)}return c}function s(e){if(0===(e=e.trimStart()).length)return;const t=e[0];return"'"===t?n(e.slice(1)):"["===t?function(e){const t=[];for(const n of o(e)){const e=s(n);if(void 0===e)return;t.push(e)}return t}(e.slice(1)):"{"===t?function(e){const t={};for(const n of o(e,!0)){const e=n.match(/^\s*([\w-]+)/);if(null===e){const e=s(n);if(void 0===e)return;t.__=e;continue}const i=e[1],o=e[0].length;let r=n.slice(o).trimEnd();if(0===r.length)t[i]=!0;else{const e=s(r);if(void 0===e)return;t[i]=e}}return t}(e.slice(1)):"true"===(e=e.trimEnd())||"false"!==e&&(/^(?:[+-]?Infinity|NaN|0x[\dA-Fa-f]+|0o[0-7]+|0b[01]+|[+-]?(?:\d*\.?\d+|\d+\.)(?:e[+-]?\d+)?)$/.test(e)?Number(e):/[\n\r',\[\]{}]/.test(e)?void 0:e)}function r(e,t,n=!1){let i=0,o=!1,s=!1,r=0,c=!1,l=[];const a=[];for(let u=0;u<e.length;u++){if(!0===s){s=!1;continue}const d=e[u];if("line"!==c)if("block"!==c)if("'"!==d){if(o)"\\"===d&&(s=!0);else if("{"!==d&&"["!==d)if("}"!==d&&"]"!==d){if(!(i>0))if(","!==d&&"\n"!==d){if(!(r<u))if(0!==d.trimEnd().length){if("/"===d){const t=e[u+1];if("/"===t){r=u,u++,c="line";continue}if("*"===t){r=u,u++,c="block";continue}}}else r=u+1}else{const n=e.slice(r,u).trimEnd();n.length>0&&(a.push({value:n,index:t+r,comment:l}),l=[]),r=u+1}}else{if(i--,i<0){const n=e.slice(r,u).trimEnd();n.length>0&&(a.push({value:n,index:t+r,comment:l}),l=[]);break}0===i&&(a.push({value:e.slice(r,u+1),index:t+r,comment:l}),l=[],r=u+1)}else if(i++,1===i&&!n){const n=e.slice(r,u).trimEnd();n.length>0&&(a.push({value:n,index:t+r,comment:l}),l=[]),r=u}}else{if(!o){if(o=!0,0===i&&!n){const n=e.slice(r,u).trimEnd();n.length>0&&(a.push({value:n,index:t+r,comment:l}),l=[]),r=u}continue}o=!1,0===i&&(a.push({value:e.slice(r,u+1),index:t+r,comment:l}),l=[],r=u+1)}else"*"===d&&"/"===e[u+1]&&(u++,c=!1,l.push(...e.slice(r,u+1).replace(/\n[ ]*/g,"\n ").split("\n")),r=u+1);else"\n"===d&&(c=!1,l.push(e.slice(r,u).trimEnd()),r=u+1)}if(!o&&0===i&&!1===c){const n=e.slice(r).trimEnd();n.length>0&&a.push({value:n,index:t+r,comment:l})}return a}function c(e,t=0,i=[]){t+=e.length;const o=function(e,t){if(0===e.length)return;const i=e[0];return"'"===i?n(e.slice(1)):"["===i?function(e,t){const n=[];for(const{value:i,index:o,comment:s}of r(e,t)){const e=c(i,o,s);if(void 0===e)return;n.push(e)}return n}(e.slice(1),t+1):"{"===i?function(e,t){const n={};for(const{value:i,index:o,comment:s}of r(e,t,!0)){const e=i.match(/^\s*([\w-]+)/);if(null===e){const e=c(i,o,s);if(void 0===e)return;n.__=e;continue}const t=e[1],r=e[0].length;let l=i.slice(r).trimEnd();if(0===l.length)n[t]={value:!0,index:o+r,comment:s};else{const e=c(l,o+r,s);if(void 0===e)return;n[t]=e}}return n}(e.slice(1),t+1):"true"===(e=e.trimEnd())||"false"!==e&&(/^(?:[+-]?Infinity|NaN|0x[\dA-Fa-f]+|0o[0-7]+|0b[01]+|[+-]?(?:\d*\.?\d+|\d+\.)(?:e[+-]?\d+)?)$/.test(e)?Number(e):/[\n\r',\[\]{}]/.test(e)?void 0:e)}(e=e.trimStart(),t-=e.length);if(void 0!==o)return{value:o,index:t,comment:i}}function l(e,t={}){return Array.isArray(e)?function(e,{addDecorativeComma:t,addDecorativeSpace:n,indentLevel:i,indentTarget:o,useUnquotedString:s}){t=t??"never",o=o??"none",i=i??0;const r=[],c=e.length>1&&("all"===o||"array"===o||"arrayInObjectAndThis"===o),a=i+(c?1:0);"arrayInObjectAndThis"===o&&(o="arrayInObject");const u="always"===n||"afterComma"===n?", ":",";let d;for(let i=0;i<e.length;i++){let f;f=void 0===d?l(e[i],{addDecorativeComma:t,addDecorativeSpace:n,indentTarget:o,indentLevel:a,useUnquotedString:s}):d,i!==e.length-1&&(d=l(e[i+1],{addDecorativeComma:t,addDecorativeSpace:n,indentTarget:o,indentLevel:a,useUnquotedString:s})),c||i===e.length-1||"always"!==t&&(f.endsWith("'")||f.endsWith("}")||f.endsWith("]")||void 0!==d&&(d.endsWith("'")||d.endsWith("}")||d.endsWith("]")))?r.push(f):r.push(f+u)}if(c){let e="\n";for(let t=0;t<i;t++)e+="    ";let t=e;return i>=0&&(t+="    "),`[${t}${r.join(t)}${e}]`}return`[${r.join("")}]`}(e,t):"object"==typeof e?function(e,{addDecorativeComma:t,addDecorativeSpace:n,indentLevel:i,indentTarget:o,useUnquotedString:s}){t=t??"never",o=o??"none",i=i??0;const r=[],c=Object.keys(e),a=c.length>1&&("all"===o||"object"===o),u=i+(a?1:0);"arrayInObject"===o&&(o="arrayInObjectAndThis");const d="always"===n||"afterComma"===n?", ":",",f="always"===n||"afterKey"===n?" ":"";for(let i=0;i<c.length;i++){const h=c[i];if(null===h.match(/^[\w-]+$/))continue;const m=e[h];if(void 0===m)continue;const g=l(m,{addDecorativeComma:t,addDecorativeSpace:n,indentTarget:o,indentLevel:u,useUnquotedString:"__"===h&&"string"==typeof m?void 0:s});g.startsWith("'")||g.startsWith("[")||g.startsWith("{")?a||i===c.length-1||"always"!==t&&"inObject"!==t?r.push(("__"===h?"":h+f)+g):r.push(("__"===h?"":h+f)+g+d):"true"===g?a||i===c.length-1?r.push(h):r.push(h+d):a||i===c.length-1?r.push(`${h} ${g}`):r.push(`${h} ${g}${d}`)}if(a){let e="\n";for(let t=0;t<i;t++)e+="    ";let t=e;return i>=0&&(t+="    "),`{${t}${r.join(t)}${e}}`}return`{${r.join("")}}`}(e,t):"number"==typeof e?e.toString():"string"==typeof e?i(e,t.useUnquotedString):!0===e?"true":!1===e?"false":""}function a(e,t={}){if(void 0===e)return"";const{value:n}=e;return Array.isArray(n)?function(e,{addDecorativeComma:t,addDecorativeSpace:n,indentLevel:i,indentTarget:o,useUnquotedString:s}){t=t??"never",o=o??"none",i=i??0;const r=[],c=e.length>1&&("all"===o||"array"===o||"arrayInObjectAndThis"===o)||void 0!==e.find((e=>e.comment.length>0)),l=i+(c?1:0);"arrayInObjectAndThis"===o&&(o="arrayInObject");const u="always"===n||"afterComma"===n?", ":",";let d;for(let i=0;i<e.length;i++){const f=e[i],{comment:h}=f;let m;m=void 0===d?a(f,{addDecorativeComma:t,addDecorativeSpace:n,indentTarget:o,indentLevel:l,useUnquotedString:s}):d,i!==e.length-1&&(d=a(e[i+1],{addDecorativeComma:t,addDecorativeSpace:n,indentTarget:o,indentLevel:l,useUnquotedString:s})),c||i===e.length-1||"always"!==t&&(m.endsWith("'")||m.endsWith("}")||m.endsWith("]")||void 0!==d&&(d.endsWith("'")||d.endsWith("}")||d.endsWith("]")))?(h.length>0&&r.push(...h),r.push(m)):r.push(m+u)}if(c){let e="\n";for(let t=0;t<i;t++)e+="    ";let t=e;return i>=0&&(t+="    "),`[${t}${r.join(t)}${e}]`}return`[${r.join("")}]`}(n,t):"object"==typeof n?function(e,{addDecorativeComma:t,addDecorativeSpace:n,indentLevel:i,indentTarget:o,useUnquotedString:s}){t=t??"never",o=o??"none",i=i??0;const r=[],c=Object.keys(e);let l=c.length>1&&("all"===o||"object"===o);if(!l)for(const t of c){const n=e[t];if(void 0!==n&&n.comment.length>0){l=!0;break}}const u=i+(l?1:0);"arrayInObject"===o&&(o="arrayInObjectAndThis");const d="always"===n||"afterComma"===n?", ":",",f="always"===n||"afterKey"===n?" ":"";for(let i=0;i<c.length;i++){const h=c[i];if(null===h.match(/^[\w-]+$/))continue;const m=e[h];if(void 0===m)continue;const{value:g,comment:p}=m,v=a(m,{addDecorativeComma:t,addDecorativeSpace:n,indentTarget:o,indentLevel:u,useUnquotedString:"__"===h&&"string"==typeof g?void 0:s});p.length>0&&r.push(...p),v.startsWith("'")||v.startsWith("[")||v.startsWith("{")?l||i===c.length-1||"always"!==t&&"inObject"!==t?r.push(("__"===h?"":h+f)+v):r.push(("__"===h?"":h+f)+v+d):"true"===v?l||i===c.length-1?r.push(h):r.push(h+d):l||i===c.length-1?r.push(`${h} ${v}`):r.push(`${h} ${v}${d}`)}if(l){let e="\n";for(let t=0;t<i;t++)e+="    ";let t=e;return i>=0&&(t+="    "),`{${t}${r.join(t)}${e}}`}return`{${r.join("")}}`}(n,t):"string"==typeof n?i(n,t.useUnquotedString):"number"==typeof n?n.toString():!0===n?"true":!1===n?"false":""}e.d(t,{Qc:()=>s,Mo:()=>c,Pz:()=>l,kf:()=>a});var u=t.Qc,d=t.Mo,f=t.Pz,h=t.kf;export{u as parse,d as parseWithIndex,f as stringify,h as stringifyWithComment};