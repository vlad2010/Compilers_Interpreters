const assert = require("assert");
const {Parser} = require('../src/Parser');
const parser = new Parser();

// for quick manual tests
function exec() {
	const program = `   

	// let x = 42;
	
	// if (x >= 10) {
	// 	x = 0;
	// } else {
	// 	x += 1;
	// };

	// if(x) x = 0;
	// if(x) if(x) {} else {};

	// if(x> 10)

	x + 5 > 10;


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
	require('./assignment-test.js'),
	require('./if-test.js'),
	require('./relational-test.js'),
]

tests.forEach(testRun => testRun(test));

console.log('All test cases passed!')
