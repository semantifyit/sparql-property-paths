import { Path } from "./paths";

export type Triple = [NamedNode | BlankNode, NamedNode, NamedNode | BlankNode | Literal];

export type TermPattern = NamedNode | BlankNode | Literal | undefined;
export type TriplePattern = [TermPattern, TermPattern, TermPattern];
export type TriplePatternWithPath = [TermPattern, TermPattern | Path, TermPattern];

export abstract class Term {
  constructor(value: string) {
    this.value = value;
  }
  value: string;
}

export class NamedNode extends Term {}
export class BlankNode extends Term {}
export class Literal extends Term {
  datatype?: string;
  language?: string;
  constructor(value: string, datatype?: string, language?: string) {
    super(value);
    this.datatype = datatype;
    this.language = language;
  }
}
