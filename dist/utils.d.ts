export declare const first: <T>(arr: T[]) => T;
export declare const last: <T>(arr: T[]) => T;
export declare const allButFist: <T>(arr: T[]) => T[];
export declare const allButLast: <T>(arr: T[]) => T[];
export declare const takeAll: <T>(iterator: Generator<T, any, unknown>) => T[];
export declare const areSameClass: (o1: any, o2: any) => boolean;
export declare const isEmptyIterable: (iterable: Generator<unknown, any, unknown>) => boolean;
export declare const bNodeIssuer: (prefix?: string) => () => string;
export declare const getBNodeIssuer: (issuer: () => string) => (originBNodeVal: string) => string;
export declare const clone: <T>(o: T) => T;
export declare const withAtVocabPrefixes: (prefixes: Record<string, string>) => Record<string, string>;
export declare function map<T, U>(iter: Iterable<T>, fn: (t: T) => U): Generator<U>;
export declare function reduce<T, U>(iter: Iterable<T>, fn: (a: U, b: T) => U, initial: U): U;
