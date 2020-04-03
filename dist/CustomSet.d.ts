export declare abstract class CustomSet<T> {
    map: Map<string, T>;
    constructor();
    [Symbol.iterator](): IterableIterator<T>;
    add(i: T): void;
    values(): IterableIterator<T>;
    has(i: T): boolean;
    abstract stringifyItem(i: T): string;
}
