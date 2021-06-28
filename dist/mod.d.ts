export declare type STONObject = {
    [key: string]: (STONObject | STONArray | string | number | boolean);
};
export declare type STONArray = (STONObject | STONArray | string | number | boolean)[];
export declare function parse(string: string): STONObject | STONArray | string | number | boolean | undefined;
declare type BeautifyTarget = 'none' | 'all' | 'array' | 'object' | 'arrayInObject' | 'arrayInObjectAndThis';
declare type AddComma = 'auto' | 'always' | 'inObject';
export declare function stringify(ston: STONObject | STONArray | string | number | boolean | undefined, beautify?: BeautifyTarget, addComma?: AddComma, level?: number): string;
export {};
