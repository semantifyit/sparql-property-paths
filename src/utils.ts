export const takeAll = <T>(iterator: Generator<T>): T[] => [...iterator];
