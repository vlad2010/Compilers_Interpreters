module.exports = test => {

	// assignment is to implement sequence expressions
	// for(let i = 0; i < 10; i += 1)

	// sequence expression is x = 5, t = 6 

	test(`
			x = 5;
	 	`, 
	 		{
			  "type": "Program",
			  "body": [
			    {
			      "type": "ExpressionStatement",
			      "expression": {
			        "type": "AssignmentExpression",
			        "operator": "=",
			        "left": {
			          "type": "Identifier",
			          "name": "x"
			        },
			        "right": {
			          "type": "NumericLiteral",
			          "value": 5
			        }
			      }
			    }
			  	]
			}
		);


	test(`
			x = 5, y = 10;
	 	`, 
	 		{
			  "type": "Program",
			  "body": [
			    {
			      "type": "SequenceExpressionStatement",
			      expressions: [
					    {
					      "type": "ExpressionStatement",
					      "expression": {
					        "type": "AssignmentExpression",
					        "operator": "=",
					        "left": {
					          "type": "Identifier",
					          "name": "x"
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
					          "name": "y"
					        },
					        "right": {
					          "type": "NumericLiteral",
					          "value": 10
					        },
					      },
         			   },
			      ],
			    },
			  ],
			},
		);


	test(`
			b < 5, c += 5, c > 4;
	 	`, 

{
  "type": "Program",
  "body": [
    {
      "type": "SequenceExpressionStatement",
      "expressions": [
        {
          "type": "ExpressionStatement",
          "expression": {
            "type": "BinaryExpression",
            "operator": "<",
            "left": {
              "type": "Identifier",
              "name": "b"
            },
            "right": {
              "type": "NumericLiteral",
              "value": 5
            }
          }
        },
        {
          "type": "ExpressionStatement",
          "expression": {
            "type": "AssignmentExpression",
            "operator": "+=",
            "left": {
              "type": "Identifier",
              "name": "c"
            },
            "right": {
              "type": "NumericLiteral",
              "value": 5
            }
          }
        },
        {
          "type": "ExpressionStatement",
          "expression": {
            "type": "BinaryExpression",
            "operator": ">",
            "left": {
              "type": "Identifier",
              "name": "c"
            },
            "right": {
              "type": "NumericLiteral",
              "value": 4
            }
          }
        }
      ]
    }
  ]
}


	);


};



