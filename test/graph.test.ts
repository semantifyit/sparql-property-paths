import * as spp from "../src";
import { getGraph } from "../src/rdfParse";

describe("graph", () => {
  it("no refs", async () => {
    const graph = await getGraph(
      `
      prefix p: <http://ex.com/>
      p:a p:x p:b .
      p:b p:x p:c .`,
      "turtle",
    );
    const doc = await graph.serialize({ format: "jsonld", replaceNodes: true });
    console.log(doc);
  });
  it("with refs", async () => {
    const graph = await getGraph(
      `
      prefix p: <http://ex.com/>
      p:a p:x p:b .
      p:b p:x p:a .`,
      "turtle",
    );
    const doc = await graph.serialize({ format: "jsonld", replaceNodes: true });
    console.log(doc);
  });

  it("json", async () => {
    const graph = await getGraph(
      `
      prefix p: <http://ex.com/>
      p:a p:x p:b .
      p:b p:x p:a .`,
      "turtle",
    );
    const doc = await graph.serialize({ format: "json" });
    const expected = [
      ["http://ex.com/a", "http://ex.com/x", "http://ex.com/b"],
      ["http://ex.com/b", "http://ex.com/x", "http://ex.com/a"],
    ];
    expect(doc).toEqual(JSON.stringify(expected));
  });
});
