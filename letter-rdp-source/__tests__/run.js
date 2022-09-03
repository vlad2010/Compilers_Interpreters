const assert = require("assert");

const {Parser} = require('../src/Parser');

const parser = new Parser();

// const program = `'hello'`;
// const program = `"hello"`;
// const program = `"42"`;
// const program = `'42'`;  // also should be supported
// const program = `42`;  
// const program = `   42  `;  

// const program = `   "  42 "  `;  

// const program = `   
// //some comment
// 42 `;  

// const program = `   
// /**
// *
// *
// some comment 
// */
// "hello block comments"`;  // also should be supported


// for quick manual tests
function exec() {
	const program = `   
	/**
	* Documenation comment:
	*
	*/
	"hello block comments";
	// Number:
	42;

	`;  // also should be supported

	const ast = parser.parse(program);
	console.log(JSON.stringify(ast, null, 2));
}


// test function
function test(program, expected) {
	const ast = parser.parse(program);
	assert.deepEqual(ast, expected);
}

exec();

// List of tests  
const tests = [
	require('./literal-tests.js'),
	require('./statement-list-test.js'),
	require('./block-test.js'),
	require('./empty-statement-test.js'),
]

tests.forEach(testRun => testRun(test));

console.log('All test cases passed!')
