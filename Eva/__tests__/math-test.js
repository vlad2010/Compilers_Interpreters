const assert = require("assert");

module.exports = (eva) => {
  // Math
  assert.strictEqual(eva.eval(["+", 1, 5]), 6);
  assert.strictEqual(eva.eval(["+", 3, 2]), 5);
  assert.strictEqual(eva.eval(["+", ["+", 3, 2], 5]), 10);

  assert.strictEqual(eva.eval(["-", 7, 3]), 4);

  assert.strictEqual(eva.eval(["/", 20, 5]), 4);

  assert.strictEqual(eva.eval(["*", 3, 2]), 6);
  assert.strictEqual(eva.eval(["*", ["*", 3, 2], 5]), 30);
};
