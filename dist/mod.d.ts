export interface STONObject {
    [key: string]: STON | undefined;
}
export interface STONObjectWithIndexValue {
    [key: string]: STONWithIndex | undefined;
}
export declare type STONArray = STON[];
export declare type STONArrayWithIndexValue = STONWithIndex[];
export declare type STON = STONObject | STONArray | string | number | boolean;
export declare type STONWithIndexValue = STONObjectWithIndexValue | STONArrayWithIndexValue | string | number | boolean;
export interface STONWithIndex {
    value: STONWithIndexValue;
    index: number;
    comment: string;
}
export interface StringWithIndex {
    value: string;
    index: number;
    comment: string;
}
export declare function parse(string: string): STON | undefined;
export declare function parseWithIndex(string: string, index?: number, comment?: string): STONWithIndex | undefined;
export interface BeautifyOptions {
    addDecorativeComma?: 'never' | 'always' | 'inObject';
    addDecorativeSpace?: 'never' | 'always' | 'afterKey' | 'afterComma';
    indentLevel?: number;
    indentTarget?: 'none' | 'all' | 'array' | 'object' | 'arrayInObject' | 'arrayInObjectAndThis';
    useUnquotedString?: true;
}
export declare function stringify(ston: STON | undefined, beautifyOptions?: BeautifyOptions): string;
export declare function stringifyWithComment(ston: STONWithIndexValue | undefined, beautifyOptions?: BeautifyOptions): string;
