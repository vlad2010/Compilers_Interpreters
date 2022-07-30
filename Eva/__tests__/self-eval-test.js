const assert = require("assert");

module.exports = (eva) => {
  // Self eval
  assert.strictEqual(eva.eval(1), 1);
  assert.strictEqual(eva.eval(42), 42);
  assert.strictEqual(eva.eval('"hello"'), "hello");
  assert.strictEqual(eva.eval('"hello world"'), "hello world");
};
