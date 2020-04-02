export const first = <T>(arr: T[]): T => arr[0];
export const last = <T>(arr: T[]): T => arr.slice(-1)[0];

export const allButFist = <T>(arr: T[]): T[] => arr.slice(1);
export const allButLast = <T>(arr: T[]): T[] => arr.slice(0, -1);

export const takeAll = <T>(iterator: Generator<T>): T[] => [...iterator];

export const areSameClass = (o1: any, o2: any) => o1.constructor === o2.constructor;

export const isEmptyIterable = (iterable: Generator) => {
  for (const _ of iterable) {
    return false;
  }
  return true;
};
