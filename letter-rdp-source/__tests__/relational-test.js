module.exports = test => {

   // Simple assignment 
	 test(`x > 42;`,
 		{  
			type: 'Program',
			body: [ 
				{
					type: 'ExpressionStatement',
					expression:
					{
						type: 'BinaryExpression',
						operator: '>',
						left :{
							type: 'Identifier',
							name: 'x',
						},
						right: {
							type: 'NumericLiteral',
							value: 42,
						}
					}
				}
			]
		});

};