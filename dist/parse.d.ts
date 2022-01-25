export interface STONObject {
    [key: string]: STON | undefined;
}
export declare type STONArray = STON[];
export declare type STON = STONObject | STONArray | string | number | boolean;
export declare function parse(string: string): STON | undefined;
