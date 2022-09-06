const assert = require("assert");
const {Parser} = require('../src/Parser');
const parser = new Parser();

// for quick manual tests
function exec() {
	const program = `   

	let y;

	let a, b;

	let c, d = 10;

	let x  = 42;

	r = 10;

	let foo = bar = 10;

	`;

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
	require('./math-test.js'),
	require('./variable-test.js'),
]

// tests.forEach(testRun => testRun(test));

console.log('All test cases passed!')
