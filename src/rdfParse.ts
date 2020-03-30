import jsonld from "jsonld";
import * as N3 from "n3";
import { Graph } from "./graph";

export const fromJsonLD = async (doc: object): Promise<Graph> => {
  const nquads = await jsonld.toRDF(doc);

  const g = new Graph();
  for (const quad of nquads) {
    g.add([quad.subject.value, quad.predicate.value, quad.object.value]);
  }
  return g;
};

export const fromTtl = async (str: string): Promise<Graph> => {
  const parser = new N3.Parser();
  const quads = parser.parse(str);

  const g = new Graph();
  for (const quad of quads) {
    g.add([quad.subject.id, quad.predicate.id, quad.object.id]);
  }
  return g;
};
