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
];

// -------------------
// Tests:
const eva = new Eva();
tests.forEach(test => test(eva));

eva.eval(["print", '"Hello"', '"World!"']);

console.log("All assertions passed!");
