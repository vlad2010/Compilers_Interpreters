module.exports = test => {
	
	// list of statements
	test(`"hello";42;`, 
	{
		type: 'Program',
		body: [
		{
			type:'ExpressionStatement',
			expression: {
				type:'StringLiteral',
				value: 'hello',
			}
		}
		,
			{
				type:'ExpressionStatement',
				expression: {
					type:'NumericLiteral',
					value: 42,
				}
			}
		],
	});
};