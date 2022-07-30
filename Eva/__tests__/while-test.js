const assert = require("assert");

/*
   (while <condition>
    <consequent>
    <alternative>)

*/
module.exports = (eva) => {
  //  if confitions tyests

  assert.strictEqual(
    eva.eval([
      "begin",

      ["var", "counter", 0],
      ["var", "result", 0],
      [
        "while",
        ["<", "counter", 10],
        // result ++
        // TODO: implement ['++', <Exp>]
        [
          "begin",
          ["set", "result", ["+", "result", 1]],
          ["set", "counter", ["+", "counter", 1]],
        ],
      ],
      "result",
    ]),

    10
  );
};
