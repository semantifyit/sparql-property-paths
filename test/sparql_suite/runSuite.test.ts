import fs from "fs";
import path from "path";
import * as spp from "../../src";

const read = (filename: string, extension: string) =>
  fs.readFileSync(path.resolve(__dirname, "data", `${filename}.${extension}`), "utf-8");

const getTestResult = (caseNr) => {
  const result = read(caseNr, "srx");
  const matches = result.matchAll(/\<uri\>(.*)\<\/uri\>/g);
  const uris = [];
  for (const match of matches) {
    uris.push(match[1]);
  }
  return uris;
};

const prefixes1 = {
  ex: "http://www.example.org/schema#",
  in: "http://www.example.org/instance#",
};

const prefixes2 = {
  "": "http://example/",
};

const prefixes3 = {
  "": "http://www.example.org/",
};

const testCase = async (
  inFile: string,
  outFile: string,
  base: string,
  path: string,
  prefixes: any,
) => {
  const res = (await spp.SPPEvaluator(read(inFile, "ttl"), "turtle"))(base, path, prefixes);
  expect(res.sort()).toEqual(getTestResult(outFile));
};

describe("SPARQL PP Test Suite", () => {
  it("pp01", async () => await testCase("pp01", "pp01", "in:a", "ex:p1/ex:p2/ex:p3", prefixes1));

  it("pp02", async () => await testCase("pp01", "pp01", "in:a", "(ex:p1/ex:p2/ex:p3)*", prefixes1));

  it("pp03", async () =>
    await testCase("pp03", "pp03", "in:a", "ex:p1/ex:p2/ex:p3/ex:p4", prefixes1));

  it("pp08", async () => await testCase("pp08", "pp08", "in:b", "^ex:p", prefixes1));

  it("pp09", async () => await testCase("pp09", "pp09", "in:c", "^(ex:p1/ex:p2)", prefixes1));

  it("pp10", async () => await testCase("pp10", "pp10", "in:a", "!(ex:p1|ex:p2)", prefixes1));

  it("pp11", async () => await testCase("pp11", "pp11", "in:a", "ex:p1/ex:p2", prefixes1));

  it("pp12", async () => await testCase("pp11", "pp12", "in:a", "(ex:p1/ex:p2)+", prefixes1));

  it("pp21", async () => await testCase("data-diamond", "diamond-2", ":a", ":p+", prefixes2));

  it("pp23", async () =>
    await testCase("data-diamond-tail", "diamond-tail-2", ":a", ":p+", prefixes2));

  it("pp25", async () =>
    await testCase("data-diamond-loop", "diamond-loop-2", ":a", ":p+", prefixes2));

  it("pp28a", async () =>
    await testCase("data-diamond-loop", "diamond-loop-5a", ":a", "(:p/:p)?", prefixes2));

  it("pp30", async () => await testCase("path-p1", "path-p1", ":a", ":p1|:p2/:p3|:p4", prefixes3));

  it("pp31", async () =>
    await testCase("path-p1", "path-p2", ":a", "(:p1|:p2)/(:p3|:p4)", prefixes3));

  it("pp32", async () => await testCase("path-p3", "path-p3", ":a", ":p0|^:p1/:p2|:p3", prefixes3));

  it("pp33", async () =>
    await testCase("path-p3", "path-p4", ":a", "(:p0|^:p1)/:p2|:p3", prefixes3));

  it("pp36", async () => await testCase("clique3", "pp36", ":a0", "(:p)*", prefixes3));

  it("pp37", async () => await testCase("pp37", "pp37", ":A0", "((:P)*)*", prefixes3));
});
