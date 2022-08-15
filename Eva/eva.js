const Environment = require("./Environment");
const Transformer = require("./transform/Transformer");


/**
   Eva interpreter
*/

class Eva {
  //Create an Eva instance with the global environment
  constructor(global = GlobalEnvironment) {
    this.global = global;
    this._transformer = new Transformer();
  }

  // Evaluate expresson in the given environment
  eval(exp, env = this.global) {

    // console.log("Eval expression: " + exp);

    // Self evailation expressions
    if (this._isNumber(exp)) {
      return exp;
    }

    if (this._isString(exp)) {
      return exp.slice(1, -1);
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
    if (this._isVariableName(exp)) {
      //console.log("this is variable name");
      return env.lookup(exp);
    }

    //if expression
    if (exp[0] === "if") {
      const [_tag, condition, consequent, alternate] = exp;
      if (this.eval(condition, env)) {
        return this.eval(consequent, env);
      }
      return this.eval(alternate, env);
    }

    // while loop
    if (exp[0] === "while") {
      const [_tag, condition, body] = exp;
      let result;
      while (this.eval(condition, env)) {
        result = this.eval(body, env);
      }
      return result;
    }

    // Function declaration: (def square (x) (* x x))
    // Syntactic sugar for: (var square (lambda (x) (* x x)))
    if(exp[0]=== 'def') {
       // JIT transpile to a variable declaration
       const varExp = this._transformer.transformDefToLambda(exp);
       return this.eval(varExp, env);
    }
    
    if(exp[0]=== 'switch') {
       const ifExp = this._transformer.transformSwitchToIf(exp);
       return this.eval(ifExp, env);
    }

    if(exp[0]=== 'for') {
       const whileExp = this._transformer.transformForToWhile(exp);
       return this.eval(whileExp, env);
    }

    // Lambda functions: (lambda (x) (* x x))
    if(exp[0] === 'lambda') {
      const[_tag, params, body] = exp;

      return {
        params,
        body,
        env   //Closure
      }

    }


    // Function calls here:
    //
    // (print "Hello world")
    // (+ x 5)
    // (> foo bar)

    // console.log("!!! Is not array : ", exp);
    if (Array.isArray(exp)) {
      const fn = this.eval(exp[0], env);
      const args = exp.slice(1).map((arg) => this.eval(arg, env));

      // 1. native for interpreter function
      if (typeof fn === "function") {
        return fn(...args);
      }

      // 2. user defined function
      const activationRecord = {};

      fn.params.forEach((param, index) => {
        activationRecord[param] = args[index];
      });

      const activationEnv = new Environment(activationRecord, fn.env);

      // actual code execution
      return this._evalBody(fn.body, activationEnv);

    }

    throw `Unimplemented: ${JSON.stringify(exp)}`;
  }

  _evalBody(body, env) {
    if(body[0] == 'begin') {
      return this._evalBlock(body, env);
    }

    return this.eval(body, env);
  }

  _evalBlock(block, env) {
    let result;
    const [_tag, ...expressions] = block;
    expressions.forEach((exp) => {
      result = this.eval(exp, env);
    });

    return result;
  }

  _isNumber(exp) {
    return typeof exp === "number";
  }

  _isString(exp) {
    return typeof exp === "string" && exp[0] === '"' && exp.slice(-1) === '"';
  }

  _isVariableName(exp) {
    return typeof exp === "string" && /^[+\-*/<>=a-zA-Z0-9_]+$/.test(exp);
  }
}

// Default Global envirinment

const GlobalEnvironment = new Environment({
  null: null,
  true: true,
  false: false,
  VERSION: "0.1",

  "+"(op1, op2) {
    return op1 + op2;
  },
  "*"(op1, op2) {
    return op1 * op2;
  },
  "-"(op1, op2 = null) {
    if (op2 == null) {
      return -op1;
    }
    return op1 - op2;
  },
  "/"(op1, op2) {
    return op1 / op2;
  },
  ">"(op1, op2) {
    return op1 > op2;
  },
  "<"(op1, op2) {
    return op1 < op2;
  },
  ">="(op1, op2) {
    return op1 >= op2;
  },
  "<="(op1, op2) {
    return op1 <= op2;
  },
  "="(op1, op2) {
    return op1 === op2;
  },

  //Console output:
  print(...args) {
    console.log(...args);
  },
});

module.exports = Eva;
