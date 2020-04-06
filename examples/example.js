const { SPPEvaluator } = require("../");

(async () => {
  const evalPP = await SPPEvaluator(
    `
    prefix p: <http://ex.com/>
    p:a p:x p:b .
    p:b p:y [ p:str "hello" ] .`,
    "turtle",
  );
  const ppathPrefixes = { p: "http://ex.com/" };

  const results = evalPP("p:a", "p:x/p:y", ppathPrefixes);

  console.log(results); // ["http://ex.com/c"]

  const str = evalPP(results[0], "p:str", ppathPrefixes);

  console.log(str); // ["hello"]
})();
