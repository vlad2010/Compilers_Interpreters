const assert = require("assert");
const evaParser = require("../parser/evaParser");

function test(eva, code, expected) {
  const exp = evaParser.parse(code);
  res = eva.eval(exp);
  assert.strictEqual(eva.eval(exp), expected);
}

module.exports = {
  test,
};
