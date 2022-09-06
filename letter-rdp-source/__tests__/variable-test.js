module.exports = test => {
   	 // Simple variable declaration
	 test(`let x = 42;`,
        {
     	type: 'Program',
     	body: [
     	 {  type: 'VariableStatement',
     		declarations: [
     			{
     				type: 'VariableDeclaration',
     				id: {
     					type: 'Identifier',
     					name: 'x',
     				},
     				init: {
     					type: 'NumericLiteral',
     					value: 42,
     				},
     			},
     		], 
     	  },
     	],
        },
     );  

   	 // Simple variable declaration, no initialization
	 test(`let x ;`,
     {
     	type: 'Program',
     	body: [
     	  {
     		type: 'VariableStatement',
     		declarations: [
     			{
     				type: 'VariableDeclaration',
     				id: {
     					type: 'Identifier',
     					name: 'x',
     				},
     				init: null,
     			},
     		], 
     	  },
     	],
     });  

     // Multiple variable declaration, no initialization
	 test(`let x, y ;`,
     {
     	type: 'Program',
     	body: [
     	  {
     		type: 'VariableStatement',
     		declarations: [
     			{
     				type: 'VariableDeclaration',
     				id: {
     					type: 'Identifier',
     					name: 'x',
     				},
     				init: null,
     			},
     			{
     				type: 'VariableDeclaration',
     				id: {
     					type: 'Identifier',
     					name: 'y',
     				},
     				init: null,
     			},
     		], 
     	  },
     	],
     });  

          // Multiple variable declaration, with initialization
	 test(`let x, y = 42 ;`,
     {
     	type: 'Program',
     	body: [
     	  {	
     		type: 'VariableStatement',
     		declarations: [
     			{
     				type: 'VariableDeclaration',
     				id: {
     					type: 'Identifier',
     					name: 'x',
     				},
     				init: null,
     			},
     			{
     				type: 'VariableDeclaration',
     				id: {
     					type: 'Identifier',
     					name: 'y',
     				},
     				init: {
     					type: 'NumericLiteral',
     					value: 42,
     				},
     			},
     		], 
     	  },
     	],
     });  



};