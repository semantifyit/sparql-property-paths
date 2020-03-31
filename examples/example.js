const { SPPEvaluator } = require("../");

const start = async () => {
  const evalPP = await SPPEvaluator(
    `
    prefix p: <http://ex.com/>
    p:a p:x p:b .
    p:b p:y p:c .`,
    "turtle",
  );
  console.log(evalPP("http://ex.com/a", ":x/:y", { "": "http://ex.com/" }));
};
