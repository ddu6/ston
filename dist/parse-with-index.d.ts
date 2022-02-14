export interface STONObjectWithIndexValue {
    [key: string]: STONWithIndex<STONWithIndexValue> | undefined;
}
export declare type STONArrayWithIndexValue = STONWithIndex<STONWithIndexValue>[];
export declare type STONWithIndexValue = STONObjectWithIndexValue | STONArrayWithIndexValue | string | number | boolean;
export interface STONWithIndex<T extends STONWithIndexValue> {
    value: T;
    index: number;
    comments: string[];
}
export declare function parseWithIndex(string: string, index?: number, comments?: string[]): STONWithIndex<STONWithIndexValue> | undefined;
