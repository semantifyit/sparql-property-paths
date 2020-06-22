import jsonld from "jsonld";
import * as N3 from "n3";
import { Graph } from "./graph";
import { Term, NamedNode, BlankNode, Literal } from "./term";
import { getBNodeIssuer } from "./utils";

type JsonLdParseTerm = {
  termType: string;
  value: string;
  datatype?: JsonLdParseTerm;
  language?: string;
};
type JsonLDToRDFResult = {
  subject: JsonLdParseTerm;
  predicate: JsonLdParseTerm;
  object: JsonLdParseTerm;
}[];

const jsonLdParseTermToTerm = (t: JsonLdParseTerm, bNodeIssuer: (s: string) => string): Term => {
  switch (t.termType) {
    case "NamedNode":
      return new NamedNode(t.value);
    case "BlankNode":
      return new BlankNode(bNodeIssuer(t.value));
    case "Literal":
      return new Literal(t.value, t?.datatype?.value, t.language);
    default:
      throw new Error("JSONLD unknown term type: " + t.termType);
  }
};

export const fromJsonLD = async (doc: string | object, g: Graph = new Graph()): Promise<Graph> => {
  let obj = doc;
  if (typeof doc === "string") {
    obj = JSON.parse(doc);
  }
  const nquads: JsonLDToRDFResult = (await jsonld.toRDF(obj)) as JsonLDToRDFResult;

  const getBnode = getBNodeIssuer(g.bNodeIssuer);

  for (const quad of nquads) {
    g.add([
      jsonLdParseTermToTerm(quad.subject, getBnode),
      jsonLdParseTermToTerm(quad.predicate, getBnode),
      jsonLdParseTermToTerm(quad.object, getBnode),
    ]);
  }
  return g;
};

// eslint-disable-next-line  @typescript-eslint/camelcase
const n3TermToTriple = (t: N3.Quad_Subject | N3.Quad_Predicate | N3.Quad_Object): Term => {
  switch (t.termType) {
    case "NamedNode":
      return new NamedNode(t.value);
    case "BlankNode":
      return new BlankNode(`_:${t.value}`);
    case "Literal":
      return new Literal(t.value, t.datatype.value, t.language);
    default:
      throw new Error("JSONLD unknown term type: " + t.termType);
  }
};

export const fromTtl = async (str: string, g: Graph = new Graph()): Promise<Graph> => {
  const parser = new N3.Parser();
  const quads = parser.parse(str);

  for (const quad of quads) {
    g.add([
      n3TermToTriple(quad.subject),
      n3TermToTriple(quad.predicate),
      n3TermToTriple(quad.object),
    ]);
  }
  return g;
};

export type InputType = "jsonld" | "turtle";
export const getGraph = (doc: any, type: InputType): Promise<Graph> => {
  switch (type) {
    case "jsonld":
      return fromJsonLD(doc);
    case "turtle":
      return fromTtl(doc);
    default:
      throw new Error(`Unsupported input type: ${type}`);
  }
};
