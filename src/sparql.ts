import { Parser as SparqlParser } from "sparqljs";
import { PathAlt, PathSeq, Path } from "./paths";
import { Prefixes } from "./graph";

interface NamedNode {
  termType: "NamedNode";
  value: string;
}

interface ParseResultPath {
  type: "path";
  pathType: "|" | "/";
  items: (NamedNode | ParseResultPath)[];
}

type PathResult = NamedNode | ParseResultPath;

export type PathObj = Path | string;

const toParseResult = (sppStr: string, prefixes?: Prefixes): PathResult => {
  const parser = new SparqlParser();
  const prefixStr = prefixes
    ? Object.entries(prefixes)
        .map(([prefix, uri]) => `PREFIX ${prefix}: <${uri}>`)
        .join("\n")
    : "";
  const parsedQuery = parser.parse(
    `${prefixStr}
        SELECT * { ?s ${sppStr} ?o. }`
  );
  return parsedQuery.where[0].triples[0].predicate;
};

const itemIsNamedNode = (item: PathResult): item is NamedNode =>
  "termType" in item && item.termType === "NamedNode";

const toPathObj = (parseResult: PathResult): PathObj => {
  if (itemIsNamedNode(parseResult)) {
    return parseResult.value;
  }
  switch (parseResult.pathType) {
    case "|":
      return new PathAlt(
        parseResult.items.map(i =>
          itemIsNamedNode(i) ? i.value : toPathObj(i)
        )
      );
    case "/":
      return new PathSeq(
        parseResult.items.map(i =>
          itemIsNamedNode(i) ? i.value : toPathObj(i)
        )
      );
    default:
      console.log(parseResult);
      throw new Error("PathType not implemented");
  }
};

export const parseSPP = (str: string, prefix?: Prefixes): PathObj =>
  toPathObj(toParseResult(str, prefix));
