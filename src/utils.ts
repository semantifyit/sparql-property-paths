export const takeAll = <T>(iterator: Generator<T>): T[] => [...iterator];

export const areSameClass = (o1: any, o2: any) => o1.constructor === o2.constructor;
