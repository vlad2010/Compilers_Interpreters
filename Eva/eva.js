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
      return this.eval(exp[1], env) + this.eval(exp[2], env);
    }

    if (exp[0] === "-") {
      return this.eval(exp[1], env) - this.eval(exp[2], env);
    }

    if (exp[0] === "*") {
      return this.eval(exp[1], env) * this.eval(exp[2], env);
    }

    if (exp[0] === "/") {
      return this.eval(exp[1], env) / this.eval(exp[2], env);
    }

    //Blocks operations : sequence of expressions
    if (exp[0] === "begin") {
      const blockEnv = new Environment({}, env); // parent env is current env
      return this._evalBlock(exp, blockEnv);
    }

    // Variable declaration:  ... add variable to current environment
    if (exp[0] === "var") {
      const [_, name, value] = exp; // what ?
      return env.define(name, this.eval(value, env));
    }

    //variables assignment
    if (exp[0] === "set") {
      const [_, name, value] = exp;
      return env.assign(name, this.eval(value, env));
    }

    //Variable access
    if (isVariableName(exp)) {
      //console.log("this is variable name");
      return env.lookup(exp);
    }

    //throw 'Unimplemented "${JSON.stringify(exp)}"';

    throw `Unimplemented: ${JSON.stringify(exp)}`;
  }

  _evalBlock(block, env) {
    let result;
    const [_tag, ...expressions] = block;
    expressions.forEach((exp) => {
      result = this.eval(exp, env);
    });
    return result;
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

module.exports = Eva;
