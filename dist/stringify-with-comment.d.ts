import type { STONWithIndex, STONWithIndexValue } from './parse-with-index';
import type { BeautifyOptions } from './stringify';
export declare function stringifyWithComment(ston: STONWithIndex<STONWithIndexValue> | undefined, beautifyOptions?: BeautifyOptions): string;
