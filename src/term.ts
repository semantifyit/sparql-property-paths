import { Path } from "./paths";
import { areSameClass } from "./utils";
import { CustomSet } from "./CustomSet";

export type Triple = [NamedNode | BlankNode, NamedNode, NamedNode | BlankNode | Literal];

export type TermPattern = NamedNode | BlankNode | Literal | undefined;
export type TriplePattern = [TermPattern, TermPattern, TermPattern];
export type TriplePatternWithPath = [TermPattern, TermPattern | Path, TermPattern];

export abstract class Term {
  constructor(value: string) {
    this.value = value;
  }
  eq(t: Term): boolean {
    return areSameClass(this, t) && this.value === t.value;
  }
  id() {
    return this.constructor.name + "_" + this.value;
  }
  value: string;
  nt(): string {
    return this.value;
  }
}

export class NamedNode extends Term {
  nt(): string {
    return `<${this.value}>`;
  }
}
export class BlankNode extends Term {
  nt(): string {
    return this.value;
  }
}
export class Literal extends Term {
  datatype?: string;
  language?: string;
  constructor(value: string, datatype?: string, language?: string) {
    super(value);
    this.datatype = datatype;
    this.language = language;
  }
  nt(): string {
    return `"${this.value}"`;
  }
}

export class TermPatternSet extends CustomSet<TermPattern> {
  stringifyItem(t: TermPattern) {
    return t ? t.id() : "";
  }
}
