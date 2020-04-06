# SPARQL Property Path Engine

Minimal engine to execture SPARQL property-paths (https://www.w3.org/TR/sparql11-query/#propertypaths) agains a turtle/jsonld document and a given starting node.

Implemented with help of https://github.com/RDFLib/rdflib .

## Example

```javascript
const SPPEvaluator = require("xlsxToRdfVocab");

(async () => {
  const evalPP = await SPPEvaluator(
    `
    prefix p: <http://ex.com/>
    p:a p:x p:b .
    p:b p:y p:c .
    p:c p:str "hello" .`,
    "turtle",
  );
  const ppathPrefixes = { p: "http://ex.com/" };

  const results = evalPP("http://ex.com/a", "p:x/p:y", ppathPrefixes);

  const str = evalPP(results[0], "p:str", ppathPrefixes);

  console.log(str);
})();
```

## Installation

Currently not on npm-registry, install with git:

`npm i git+https://github.com/semantifyit/sparql-property-paths`

Then simply require with

```javascript
const SPPEvaluator = require("xlsxToRdfVocab");
```

## API (Typescript signatures)

#### SPPEvaluator

```typescript
type OutFn = (base: string, spp: string, prefix?: Record<string, string>) => string[];

const SPPEvaluator = (str: string, type: "jsonld" | "ttl"): Promise<OutFn>;
```

## Known issues

- nested `* + ?` selectors might produce duplicates. (e.g. test case pp37)
- negated inverse property paths produce wrong results (e.g. `!^:p`)
