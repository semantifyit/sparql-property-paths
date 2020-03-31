import { evalPath } from "../src/paths";
import { takeAll } from "../src/utils";
import { getGraph } from "../src/";
import { parseSPP } from "../src/sparql";
import { NamedNode } from "../src/term";

describe("path", () => {
  it("subj or obj missing - simple path", async () => {
    const graph = await getGraph(
      `
      prefix p: <http://ex.com/>
      p:a p:x p:b .`,
      "turtle",
    );

    const path = parseSPP("<http://ex.com/x>");

    const res1 = takeAll(
      evalPath(graph, [new NamedNode("http://ex.com/a"), path, new NamedNode("http://ex.com/b")]),
    );

    const res2 = takeAll(evalPath(graph, [new NamedNode("http://ex.com/a"), path, undefined]));

    const res3 = takeAll(evalPath(graph, [undefined, path, new NamedNode("http://ex.com/b")]));

    const res4 = takeAll(evalPath(graph, [undefined, path, undefined]));

    const expected = [[new NamedNode("http://ex.com/a"), new NamedNode("http://ex.com/b")]];

    expect(res1).toEqual(expected);
    expect(res2).toEqual(expected);
    expect(res3).toEqual(expected);
    expect(res4).toEqual(expected);
  });

  it("subj or obj missing - path sequence", async () => {
    const graph = await getGraph(
      `
      prefix p: <http://ex.com/>
      p:a p:x p:b .
      p:b p:y p:c .`,
      "turtle",
    );

    const path = parseSPP("<http://ex.com/x>/<http://ex.com/y>");

    const res1 = takeAll(
      evalPath(graph, [new NamedNode("http://ex.com/a"), path, new NamedNode("http://ex.com/c")]),
    );

    const res2 = takeAll(evalPath(graph, [new NamedNode("http://ex.com/a"), path, undefined]));

    const res3 = takeAll(evalPath(graph, [undefined, path, new NamedNode("http://ex.com/c")]));

    const res4 = takeAll(evalPath(graph, [undefined, path, undefined]));

    const expected = [[new NamedNode("http://ex.com/a"), new NamedNode("http://ex.com/c")]];

    expect(res1).toEqual(expected);
    expect(res2).toEqual(expected);
    expect(res3).toEqual(expected);
    expect(res4).toEqual(expected);
  });

  it("inverse simple", async () => {
    const graph = await getGraph(
      `
      prefix p: <http://ex.com/>
      p:a p:x p:b .`,
      "turtle",
    );

    const path = parseSPP("^<http://ex.com/x>");

    const res1 = takeAll(
      evalPath(graph, [new NamedNode("http://ex.com/b"), path, new NamedNode("http://ex.com/a")]),
    );

    const res2 = takeAll(evalPath(graph, [new NamedNode("http://ex.com/b"), path, undefined]));

    const res3 = takeAll(evalPath(graph, [undefined, path, new NamedNode("http://ex.com/a")]));

    const res4 = takeAll(evalPath(graph, [undefined, path, undefined]));

    const expected = [[new NamedNode("http://ex.com/b"), new NamedNode("http://ex.com/a")]];

    expect(res1).toEqual(expected);
    expect(res2).toEqual(expected);
    expect(res3).toEqual(expected);
    expect(res4).toEqual(expected);
  });

  it("inverse seq", async () => {
    const graph = await getGraph(
      `
      prefix p: <http://ex.com/>
      p:a p:x p:b .
      p:b p:y p:c .`,
      "turtle",
    );

    const path = parseSPP("^(<http://ex.com/x>/<http://ex.com/y>)");

    const res1 = takeAll(
      evalPath(graph, [new NamedNode("http://ex.com/c"), path, new NamedNode("http://ex.com/a")]),
    );

    const res2 = takeAll(evalPath(graph, [new NamedNode("http://ex.com/c"), path, undefined]));

    const res3 = takeAll(evalPath(graph, [undefined, path, new NamedNode("http://ex.com/a")]));

    const res4 = takeAll(evalPath(graph, [undefined, path, undefined]));

    const expected = [[new NamedNode("http://ex.com/c"), new NamedNode("http://ex.com/a")]];

    expect(res1).toEqual(expected);
    expect(res2).toEqual(expected);
    expect(res3).toEqual(expected);
    expect(res4).toEqual(expected);
  });

  it("inverse seq 2", async () => {
    const graph = await getGraph(
      `
      prefix p: <http://ex.com/>
      p:a p:x p:b .
      p:b p:y p:c .`,
      "turtle",
    );

    const path = parseSPP("^<http://ex.com/y>/^<http://ex.com/x>");

    const res1 = takeAll(
      evalPath(graph, [new NamedNode("http://ex.com/c"), path, new NamedNode("http://ex.com/a")]),
    );

    const res2 = takeAll(evalPath(graph, [new NamedNode("http://ex.com/c"), path, undefined]));

    const res3 = takeAll(evalPath(graph, [undefined, path, new NamedNode("http://ex.com/a")]));

    const res4 = takeAll(evalPath(graph, [undefined, path, undefined]));

    const expected = [[new NamedNode("http://ex.com/c"), new NamedNode("http://ex.com/a")]];

    expect(res1).toEqual(expected);
    expect(res2).toEqual(expected);
    expect(res3).toEqual(expected);
    expect(res4).toEqual(expected);
  });
});
