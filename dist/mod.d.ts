export declare type STONObject = {
    [key: string]: (STONObject | STONArray | string | number | boolean);
};
export declare type STONArray = (STONObject | STONArray | string | number | boolean)[];
export declare function parse(string: string): STONObject | STONArray | string | number | boolean | undefined;
interface BeautifyOptions {
    indentTarget?: 'none' | 'all' | 'array' | 'object' | 'arrayInObject' | 'arrayInObjectAndThis';
    indentLevel?: number;
    addDecorativeComma?: 'never' | 'always' | 'inObject';
}
export declare function stringify(ston: STONObject | STONArray | string | number | boolean | undefined, beautifyOptions?: BeautifyOptions): string;
export {};
