export interface STONObject {
    [key: string]: STON | undefined;
}
export interface STONObjectValueWithIndex {
    [key: string]: STONWithIndex | undefined;
}
export declare type STONArray = STON[];
export declare type STONArrayValueWithIndex = STONWithIndex[];
export declare type STON = STONObject | STONArray | string | number | boolean;
export declare type STONValueWithIndex = STONObjectValueWithIndex | STONArrayValueWithIndex | string | number | boolean;
export interface STONWithIndex {
    value: STONValueWithIndex;
    index: number;
    comment: string;
}
export interface StringWithIndex {
    value: string;
    index: number;
    comment: string;
}
export declare function parseWithIndex(string: string, index?: number, comment?: string): STONWithIndex | undefined;
export declare function parse(string: string): STON | undefined;
export interface BeautifyOptions {
    indentTarget?: 'none' | 'all' | 'array' | 'object' | 'arrayInObject' | 'arrayInObjectAndThis';
    indentLevel?: number;
    addDecorativeComma?: 'never' | 'always' | 'inObject';
}
export declare function stringifyWithComment(ston: STONValueWithIndex | undefined, beautifyOptions?: BeautifyOptions): string;
export declare function stringify(ston: STON | undefined, beautifyOptions?: BeautifyOptions): string;
