import { Parser as SparqlParser } from "sparqljs";
import { PathAlt, PathSeq, Path } from "./paths";
import { Prefixes } from "./graph";
import { NamedNode } from "./term";

type ParseResult = ParseResultNamedNode | ParseResultPath;

interface ParseResultNamedNode {
  termType: "NamedNode";
  value: string;
}

interface ParseResultPath {
  type: "path";
  pathType: "|" | "/";
  items: (ParseResultNamedNode | ParseResultPath)[];
}

export type PathObj = Path | NamedNode;

const toParseResult = (sppStr: string, prefixes: Prefixes): ParseResult => {
  const parser = new SparqlParser();
  const prefixStr = Object.entries(prefixes)
    .map(([prefix, uri]) => `PREFIX ${prefix}: <${uri}>`)
    .join("\n");
  const parsedQuery = parser.parse(
    `${prefixStr}
        SELECT * { ?s ${sppStr} ?o. }`,
  );
  return parsedQuery.where[0].triples[0].predicate;
};

const itemIsNamedNode = (item: ParseResult): item is ParseResultNamedNode =>
  "termType" in item && item.termType === "NamedNode";

const toPathObj = (parseResult: ParseResult): PathObj => {
  if (itemIsNamedNode(parseResult)) {
    return new NamedNode(parseResult.value);
  }
  switch (parseResult.pathType) {
    case "|":
      return new PathAlt(
        parseResult.items.map((i) => (itemIsNamedNode(i) ? new NamedNode(i.value) : toPathObj(i))),
      );
    case "/":
      return new PathSeq(
        parseResult.items.map((i) => (itemIsNamedNode(i) ? new NamedNode(i.value) : toPathObj(i))),
      );
    default:
      console.log(parseResult);
      throw new Error("PathType not implemented");
  }
};

export const parseSPP = (str: string, prefix: Prefixes): PathObj =>
  toPathObj(toParseResult(str, prefix));
