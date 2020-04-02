export declare const first: <T>(arr: T[]) => T;
export declare const last: <T>(arr: T[]) => T;
export declare const allButFist: <T>(arr: T[]) => T[];
export declare const allButLast: <T>(arr: T[]) => T[];
export declare const takeAll: <T>(iterator: Generator<T, any, unknown>) => T[];
export declare const areSameClass: (o1: any, o2: any) => boolean;
export declare const isEmptyIterable: (iterable: Generator<unknown, any, unknown>) => boolean;
