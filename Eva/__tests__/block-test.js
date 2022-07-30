const assert = require("assert");

module.exports = (eva) => {
  // Blocks tests
  assert.strictEqual(
    eva.eval([
      "begin",
      ["var", "x", 10],
      ["var", "y", 20],
      ["+", ["*", "x", "y"], 30],
    ]),
    230
  );

  // nested environments
  assert.strictEqual(
    eva.eval([
      "begin",
      ["var", "x", 10],
      ["begin", ["var", "x", 20], "x"],
      "x",
    ]),
    10
  );

  //access to variable in outer environment
  assert.strictEqual(
    eva.eval([
      "begin",
      ["var", "value", 10],
      ["var", "result", ["begin", ["var", "x", ["+", "value", 20]], "x"]],
      "result",
    ]),
    30
  );

  //assignment variables
  assert.strictEqual(
    eva.eval([
      "begin",
      ["var", "data", 10],
      ["begin", ["set", "data", 100]],
      "data",
    ]),
    100
  );
};
