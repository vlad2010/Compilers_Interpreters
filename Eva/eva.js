const assert = require("assert");

const Environment = require("./Environment");

/**
   Eva interpreter
*/

class Eva {
  //Create an Eva instance with the global environment
  constructor(global = new Environment()) {
    this.global = global;
  }

  // Evaluate expresson in the given environment
  eval(exp, env = this.global) {
    // Self evailation expressions
    if (isNumber(exp)) {
      return exp;
    }

    if (isString(exp)) {
      return exp.slice(1, -1);
    }

    // Math operations
    if (exp[0] === "+") {
      return eva.eval(exp[1]) + eva.eval(exp[2]);
    }

    if (exp[0] === "-") {
      return eva.eval(exp[1]) - eva.eval(exp[2]);
    }

    if (exp[0] === "*") {
      return eva.eval(exp[1]) * eva.eval(exp[2]);
    }

    if (exp[0] === "/") {
      return eva.eval(exp[1]) / eva.eval(exp[2]);
    }

    // Variables ... add variable to current environment
    if (exp[0] === "var") {
      const [_, name, value] = exp; // what ?
      return env.define(name, this.eval(value));
    }

    //Variable access

    if (isVariableName(exp)) {
      //console.log("this is variable name");
      return env.lookup(exp);
    }

    //throw 'Unimplemented "${JSON.stringify(exp)}"';

    throw `Unimplemented: ${JSON.stringify(exp)}`;
  }
}

function isNumber(exp) {
  return typeof exp === "number";
}

function isString(exp) {
  return typeof exp === "string" && exp[0] === '"' && exp.slice(-1) === '"';
}

function isVariableName(exp) {
  return typeof exp === "string" && /^[+\-*/<>=a-zA-Z0-9_]+$/.test(exp);
}

// -------------------
// Tests:

const eva = new Eva(
  new Environment({
    null: null,
    true: true,
    false: false,
    VERSION: "0.1",
  })
);

// Self eval
assert.strictEqual(eva.eval(1), 1);
assert.strictEqual(eva.eval(42), 42);
assert.strictEqual(eva.eval('"hello"'), "hello");
assert.strictEqual(eva.eval('"hello world"'), "hello world");

// Math
assert.strictEqual(eva.eval(["+", 1, 5]), 6);
assert.strictEqual(eva.eval(["+", 3, 2]), 5);
assert.strictEqual(eva.eval(["+", ["+", 3, 2], 5]), 10);

assert.strictEqual(eva.eval(["-", 7, 3]), 4);

assert.strictEqual(eva.eval(["/", 20, 5]), 4);

assert.strictEqual(eva.eval(["*", 3, 2]), 6);
assert.strictEqual(eva.eval(["*", ["*", 3, 2], 5]), 30);

// Variables
assert.strictEqual(eva.eval(["var", "x", 10]), 10);
assert.strictEqual(eva.eval("x"), 10);

assert.strictEqual(eva.eval(["var", "y", 100]), 100);
assert.strictEqual(eva.eval("y"), 100);

assert.strictEqual(eva.eval("VERSION"), "0.1");

assert.strictEqual(eva.eval(["var", "z", ["*", 2, 2]]), 4);
assert.strictEqual(eva.eval("z"), 4);

assert.strictEqual(eva.eval(["var", "isUser", "true"]), true);

console.log("All assertions passed!");
