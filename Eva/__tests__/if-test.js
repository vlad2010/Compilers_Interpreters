const assert = require("assert");

/*
   (if <condition>
    <consequent>
    <alternative>)

*/
module.exports = (eva) => {
  //  if confitions tyests

  assert.strictEqual(
    eva.eval([
      "begin",

      ["var", "x", 10],
      ["var", "y", 20],
      ["if", [">", "x", 10], ["set", "y", 20], ["set", "y", 30]],
      "y",
    ]),

    30
  );
};
