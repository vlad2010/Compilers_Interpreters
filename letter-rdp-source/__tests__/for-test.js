module.exports = test => {

	// assignment is to implement sequence expressions
	// for(let i = 0; i < 10; i += 1)

	test(`

	 	for(let i = 0; i < 10; i += 1)
	 	{
			x += 1;
		}

	 	`, {  
			type: 'Program',
			body: [ 
				{
					type: 'ForStatement',
					init: {
						type: 'VariableStatement',
						declaration: [
						{
						type: 'VariableDeclaration',
						id: {
							type: 'Identifier',
							name: 'i',
						},
						init: {
							type: 'NumericLiteral',
							value: 0,	
						},
					    },
					    ],
					},
					test: {
						type: 'BinaryExpression',
						operator: '<',
						left: {
							type: 'Identifier',
							name: 'i',
						},
						right: {
							type: 'NumericLiteral',
							value: 10
						},

					},
					update: {
						type: 'AssignmentExpression',
						operator: '+=',
						left: {
							type: 'Identifier',
							name: 'i',
						},

						right: {
							type: 'NumericLiteral',
							value: 1,
						},
					},
				    body: {
				    	type: 'BlockStatement',
				    	body: [
				    	  {
				    		type: 'ExpressionStatement',
				    		expression: {
				    			type: 'AssignmentExpression',
				    			operator: '+=',
				    			left: {
				    				type: 'Identifier',
				    				name: 'x',
				    			},
				    			right: {
				    				type: 'NumericLiteral',
				    				value: 1,
				    			},
				    		},
				    	  },
				    	],
				    },

			

			},
		],
	});

		test(`

	 	for(; ;)
	 	{
			x += 1;
		}

	 	`, {  
			type: 'Program',
			body: [ 
				{
					type: 'ForStatement',
					init: null,
					test: null,
					update: null,
				    body: {
				    	type: 'BlockStatement',
				    	body: [
				    	  {
				    		type: 'ExpressionStatement',
				    		expression: {
				    			type: 'AssignmentExpression',
				    			operator: '+=',
				    			left: {
				    				type: 'Identifier',
				    				name: 'x',
				    			},
				    			right: {
				    				type: 'NumericLiteral',
				    				value: 1,
				    			},
				    		},
				    	  },
				       ],
				    },

			},
		],
	});


		test(`

	 	for(; ;)
	 	{
			
		}

	 	`, {  
			type: 'Program',
			body: [ 
				{
					type: 'ForStatement',
					init: null,
					test: null,
					update: null,
				    body: {
				    	type: 'BlockStatement',
				    	body: [ ],
				    },

			},
		],
	});


	test(`

	 	for(i = 0, c = 5, m = 4;; i < 10; i += 1)
	 	{
			x += 1;
		}

	 	`, {  
			type: 'Program',
			body: [ 
				{
					type: 'ForStatement',
					init: 
					    {
					      "type": "SequenceExpressionStatement",
					      "expressions": [
					        {
					          "type": "ExpressionStatement",
					          "expression": {
					            "type": "AssignmentExpression",
					            "operator": "=",
					            "left": {
					              "type": "Identifier",
					              "name": "i"
					            },
					            "right": {
					              "type": "NumericLiteral",
					              "value": 0
					            },
					          },
					        },
					        {
					          "type": "ExpressionStatement",
					          "expression": {
					            "type": "AssignmentExpression",
					            "operator": "=",
					            "left": {
					              "type": "Identifier",
					              "name": "c"
					            },
					            "right": {
					              "type": "NumericLiteral",
					              "value": 5
					            },
					          },
					        },
					        {
					          "type": "ExpressionStatement",
					          "expression": {
					            "type": "AssignmentExpression",
					            "operator": "=",
					            "left": {
					              "type": "Identifier",
					              "name": "m"
					            },
					            "right": {
					              "type": "NumericLiteral",
					              "value": 4
					            },
					          },
					        },
					      ],
					    },

					test: {
						type: 'BinaryExpression',
						operator: '<',
						left: {
							type: 'Identifier',
							name: 'i',
						},
						right: {
							type: 'NumericLiteral',
							value: 10
						},

					},
					update: {
						type: 'AssignmentExpression',
						operator: '+=',
						left: {
							type: 'Identifier',
							name: 'i',
						},

						right: {
							type: 'NumericLiteral',
							value: 1,
						},
					},
				    body: {
				    	type: 'BlockStatement',
				    	body: [
				    	  {
				    		type: 'ExpressionStatement',
				    		expression: {
				    			type: 'AssignmentExpression',
				    			operator: '+=',
				    			left: {
				    				type: 'Identifier',
				    				name: 'x',
				    			},
				    			right: {
				    				type: 'NumericLiteral',
				    				value: 1,
				    			},
				    		},
				    	  },
				    	],
				    },

			

			},
		],
	});


}