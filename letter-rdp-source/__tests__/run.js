const {Parser} = require('../src/Parser');

const parser = new Parser();

// const program = `'hello'`;
// const program = `"hello"`;
// const program = `"42"`;
const program = `'42'`;  // also should be supported

const ast = parser.parse(program);

console.log(JSON.stringify(ast, null, 2));