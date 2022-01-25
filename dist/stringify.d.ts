import type { STON } from './parse';
export interface BeautifyOptions {
    addDecorativeComma?: 'never' | 'always' | 'inObject';
    addDecorativeSpace?: 'never' | 'always' | 'afterKey' | 'afterComma';
    indentLevel?: number;
    indentTarget?: 'none' | 'all' | 'array' | 'object' | 'arrayInObject' | 'arrayInObjectAndThis';
    useUnquotedString?: true;
}
export declare function stringify(ston: STON | undefined, beautifyOptions?: BeautifyOptions): string;
