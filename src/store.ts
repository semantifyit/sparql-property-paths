import { TriplePattern } from "./graph";
import { Path } from "./paths";

type Entity = string;
export type Triple = [Entity, Entity, Entity];

function matchSingle(p1: Entity | Path, p2: Entity) {
  return p1 === undefined || p2 === undefined || p1 === p2;
}

function matchTriple([s1, p1, o1]: TriplePattern, [s2, p2, o2]: Triple) {
  return matchSingle(s1, s2) && matchSingle(p1, p2) && matchSingle(o1, o2);
}

export default class Store {
  _triples: Triple[] = [];

  add(t: Triple) {
    this._triples.push(t);
  }

  *triples(tIn: TriplePattern): Generator<Triple> {
    for (const t of this._triples) {
      if (matchTriple(tIn, t)) {
        yield t;
      }
    }
  }
}
