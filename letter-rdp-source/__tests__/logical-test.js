module.exports = test => {


	 test(`x > 5 && y < 10;`,
 		{  
			type: 'Program',
			body: [ 
				{
					type: 'ExpressionStatement',
					expression:
					{
						type: 'LogicalExpression',
						operator: '&&',
						left :{
							type: 'BinaryExpression',
							operator: '>',
							left :{
								type: 'Identifier',
								name: 'x',
							},
							right: {
								type: 'NumericLiteral',
								value: 5,
							}
						},
						right :{
							type: 'BinaryExpression',
							operator: '<',
							left :{
								type: 'Identifier',
								name: 'y',
							},
							right: {
								type: 'NumericLiteral',
								value: 10,
							}
						},
					}
				}
			]
		});

}

