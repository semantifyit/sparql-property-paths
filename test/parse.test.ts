import * as spp from "../src";

describe("parsing", () => {
  it("turtle", async () => {
    const evalPP = await spp.SPPEvaluator(
      `
      prefix p: <http://ex.com/>
      p:a p:x p:b .
      p:a p:str "hi" .
      p:b p:y [ p:z p:d ] .`,
      "turtle",
    );

    expect(evalPP("http://ex.com/a", ":x/:y/:z", { "": "http://ex.com/" })).toEqual([
      "http://ex.com/d",
    ]);
  });

  it("jsonld", async () => {
    const evalPP = await spp.SPPEvaluator(
      {
        "@context": {
          p: "http://ex.com/",
        },
        "@graph": [
          {
            "@id": "p:a",
            "p:str": "hi",
            "p:x": {
              "p:y": {
                "p:z": { "@id": "p:d" },
              },
            },
          },
        ],
      },
      "jsonld",
    );

    expect(evalPP("http://ex.com/a", ":x/:y/:z", { "": "http://ex.com/" })).toEqual([
      "http://ex.com/d",
    ]);
  });
});
