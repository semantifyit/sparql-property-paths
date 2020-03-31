import { Triple, TriplePattern, TermPattern, Term } from "./term";
import { areSameClass } from "./utils";

function matchSingle(p1: TermPattern, p2: Term) {
  return p1 === undefined || (areSameClass(p1, p2) && p1.value === p2.value);
}

function matchTriple([s1, p1, o1]: TriplePattern, [s2, p2, o2]: Triple) {
  return matchSingle(s1, s2) && matchSingle(p1, p2) && matchSingle(o1, o2);
}

export class Store {
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
