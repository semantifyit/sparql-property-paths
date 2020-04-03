export abstract class CustomSet<T> {
  map: Map<string, T>;
  constructor() {
    this.map = new Map<string, T>();
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this.values();
  }

  add(i: T) {
    this.map.set(this.stringifyItem(i), i);
  }

  values() {
    return this.map.values();
  }

  has(i: T): boolean {
    return this.map.has(this.stringifyItem(i));
  }

  abstract stringifyItem(i: T): string;
}
