export interface STONObjectWithIndexValue {
    [key: string]: STONWithIndex<STONWithIndexValue> | undefined;
}
export declare type STONArrayWithIndexValue = STONWithIndex<STONWithIndexValue>[];
export declare type STONWithIndexValue = STONObjectWithIndexValue | STONArrayWithIndexValue | string | number | boolean;
export interface STONWithIndex<T extends STONWithIndexValue> {
    value: T;
    index: number;
    comment: string[];
}
export declare function parseWithIndex(string: string, index?: number, comment?: string[]): STONWithIndex<STONWithIndexValue> | undefined;
