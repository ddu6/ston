export declare type STONObject = {
    [key: string]: (STONObject | STONArray | string | number | boolean);
};
export declare type STONArray = (STONObject | STONArray | string | number | boolean)[];
export declare function parse(string: string): STONObject | STONArray | string | number | boolean | undefined;
declare type BeautifyTarget = 'array' | 'object' | 'all' | 'none' | 'arrayInObject' | 'arrayInObjectAndThis';
export declare function stringify(ston: STONObject | STONArray | string | number | boolean | undefined, beautify?: BeautifyTarget, level?: number): string;
export {};
