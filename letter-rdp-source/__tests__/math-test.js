
module.exports = test => {

 // addition
 test(`2 + 3;`,
 		{  
			type: 'Program',
			body: [ 
				{
					type: 'ExpressionStatement',
					expression:
					{
						type:'BinaryExpression',
						operator: '+',
						left: {
							type: 'NumericLiteral',
							value: 2
						},
						right: {
							type: 'NumericLiteral',
							value: 3
						},
					}
				}
		]}
 	);

 	// more complex addition
    test(`4 + 2 - 3;`, 
 		{
			type: 'Program',
			body: [ 
				{
					type: 'ExpressionStatement',
					expression:
					{
						type:'BinaryExpression',
						operator: '-',
						left: {
							type: 'BinaryExpression',
							operator: '+',
							left: {
								type: 'NumericLiteral',
								value: 4
							},
							right: {
								type: 'NumericLiteral',
								value: 2
							},
						},
						right: {
							type: 'NumericLiteral',
							value: 3
						},
					}
				}
		]}
 	);

	// simple multiplication
	test(`2 * 3;`,
		{  
		type: 'Program',
		body: [ 
			{
				type: 'ExpressionStatement',
				expression:
				{
					type:'BinaryExpression',
					operator: '*',
					left: {
						type: 'NumericLiteral',
						value: 2
					},
					right: {
						type: 'NumericLiteral',
						value: 3
					},
				}
			}
	]}
	);

 	// more complex addition
    test(`2 + 2 * 2;`, 
 		{
			type: 'Program',
			body: [ 
				{
					type: 'ExpressionStatement',
					expression:
					{
						type:'BinaryExpression',
						operator: '+',
						left: {
							type: 'NumericLiteral',
							value: 2
						},
						right: {
							type: 'BinaryExpression',
							operator: '*',
							left: {
								type: 'NumericLiteral',
								value: 2
							},
							right: {
								type: 'NumericLiteral',
								value: 2
							},
						},
					}
				}
		]}
 	);

 	 	// more complex addition
    test(`4 * 2 * 3;`, 
 		{
			type: 'Program',
			body: [ 
				{
					type: 'ExpressionStatement',
					expression:
					{
						type:'BinaryExpression',
						operator: '*',
						left: {
							type: 'BinaryExpression',
							operator: '*',
							left: {
								type: 'NumericLiteral',
								value: 4
							},
							right: {
								type: 'NumericLiteral',
								value: 2
							},
						},
						right: {
							type: 'NumericLiteral',
							value: 3
						},
					}
				}
		]}
 	);


 	 	// more complex addition
    test(`(2 + 7) * 3;`, 
 		{
			type: 'Program',
			body: [ 
				{
					type: 'ExpressionStatement',
					expression:
					{
						type:'BinaryExpression',
						operator: '*',
						left: {
							type: 'BinaryExpression',
							operator: '+',
							left: {
								type: 'NumericLiteral',
								value: 2
							},
							right: {
								type: 'NumericLiteral',
								value: 7
							},
						},
						right: {
							type: 'NumericLiteral',
							value: 3
						},
					}
				}
		]}
 	);


}
