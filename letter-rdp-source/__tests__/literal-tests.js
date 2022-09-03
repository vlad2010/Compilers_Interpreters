

module.exports = test => {
	
	//Numeric literal
	test('42;', {
		type: 'Program',
		body: [{
			type:'ExpressionStatement',
			expression: {
				type:'NumericLiteral',
				value: 42,
			}
		}],
	});

	// double quotes string literal
	test(`"hello";`, {
		type: 'Program',
		body: [{
			type:'ExpressionStatement',
			expression: {
				type:'StringLiteral',
				value: 'hello',
			}
		}],
	});

	// single quotes string literal
	test(`'hello';`, {
		type: 'Program',
		body: [{
			type:'ExpressionStatement',
			expression: {
				type:'StringLiteral',
				value: 'hello',
			}
		}],
	});

};