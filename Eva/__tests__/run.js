const Eva = require("../Eva");
const Environment = require("../Environment");

const tests = [
  require("./self-eval-test.js"),
  require("./math-test.js"),
  require("./variables-test.js"),
  require("./block-test.js"),
  require("./if-test.js"),
  require("./while-test.js"),
  require("./built-in-function-test.js"),
  require("./user-defined-function-test.js"),
  require("./lambda-function-test.js"),
  require("./switch-test.js"),
  require("./for-test.js"),
  require("./inc-test.js"),
  require("./dec-test.js"),
  require("./inc-val-test.js"),
  require("./dec-val-test.js"),
  require("./class-test.js"),
];

// -------------------
// Tests:
const eva = new Eva();
tests.forEach(test => test(eva));

res = eva.eval(["print", '"Hello"', '"World!"']);
console.log("All assertions passed!");
