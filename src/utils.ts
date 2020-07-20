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

export const bNodeIssuer = (prefix = "b") => {
  let counter = 0;
  return () => `_:${prefix}${++counter}`;
};

export const getBNodeIssuer = (issuer: () => string) => {
  const bNodeTable: Record<string, string> = {};

  return (originBNodeVal: string): string => {
    if (!bNodeTable[originBNodeVal]) {
      bNodeTable[originBNodeVal] = issuer();
    }
    return bNodeTable[originBNodeVal];
  };
};

export const clone = <T>(o: T): T => JSON.parse(JSON.stringify(o));

export const withAtVocabPrefixes = (prefixes: Record<string, string>): Record<string, string> => {
  const newPrefixes = clone(prefixes);
  if (newPrefixes[""]) {
    newPrefixes["@vocab"] = newPrefixes[""];
    delete newPrefixes[""];
  }
  return newPrefixes;
};

export function* map<T, U>(iter: Iterable<T>, fn: (t: T) => U): Generator<U>{
  for (let x of iter) {
    yield fn(x);
  }
}

export function reduce<T, U> (iter: Iterable<T>, fn: (a: U, b: T) => U, initial: U): U {
  let val: U = initial;

  for (let x of iter) {
    val = fn(val, x);
  }

  return val;
}