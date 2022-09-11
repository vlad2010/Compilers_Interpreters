
// Letter parser : recursive descent implementation

const {Tokenizer} = require('./Tokenizer');

class Parser {

	// Initialize the parser 
	constructor() {
		this._string = '';
		this._tokenizer = new Tokenizer();
	} 

	// Parse string into an AST
	parse(string)
	{
		this._string = string;
		this._tokenizer.init(string);

		// We need to know next token for predictive parsing. 
		// Look ahead for 1 token
		this._lookahead = this._tokenizer.getNextToken();

		// Parse recursively starting from the main entry point, the Program
		return this.Program();
	}

   /** Main entry point 
	*
	*  Program
	*    : Literal
	*    ;
	*/
	Program()
	{
		return {
			type: 'Program',
			body: this.StatementList(),
		};
	}

	/** StatementList
	 * 	: Statement
	 *  | StatementList Statement -> Statement Statement Statement Statement
	 *  ;
	 */
	 StatementList(stopLookahead = null) {
	 	const statementList = [this.Statement()];

	 	while(this._lookahead != null && this._lookahead.type !== stopLookahead) {
	 		statementList.push(this.Statement());
	 	}

	 	return statementList;
	 }

	/** Statement
	 * 	: ExpressionStatement
	 *  | BlockStatement
	 *  | EmptyStatement
	 *  | VariableStatement
	 *  | IfStatement
	 *  | IterationStatement
	 *  | FunctionDeclaration
	 *  | ReturnStatement
	 *  | ClassDeclaration
	 *  ;
	 */
	 Statement() {
	 	switch(this._lookahead.type) {
	 		case ';':
	 			return this.EmptyStatement();
	 		case 'if':
	 			return this.IfStatement();
	 		case '{': 
	 			return this.BlockStatement();
	 		case 'let':
	 			return this.VariableStatement();
	 		case 'def':
	 			return this.FunctionDeclaration();
	 		case 'class':
	 			return this.ClassDeclaration();
	 		case 'return':
	 			return this.ReturnStatement();
	 		case 'while':
	 		case 'do':
	 		case 'for':
	 			return this.IterationStatement();
	 		default:
			 	return this.SequenceExpressionStatement();
	 	}
	 }

	/** ClassDeclaration
	 * 	: 'class' Identifier OptClassExtends BlockStatement
 	 *  ;
	 */
	ClassDeclaration() {
		this._eat('class')
		const id = this.Identifier();
		const superClass = this._lookahead.type === 'extends' ? this.ClassExtends() : null;
		const body = this.BlockStatement();

		return {
			type: 'ClassDeclaration',
			id,
			superClass,
			body
		};
	}

	/** ClassExtends
	 * 	: 'extends' Identifier
 	 *  ;
	 */
	ClassExtends() {
		this._eat('extends');
		return this.Identifier();
	}


	/** FunctionDeclaration
	 * 	: 'def' Identifier '(' OptFormalParameterList ')' BlockStatement
 	 *  ;
	 */
	FunctionDeclaration() {
		this._eat('def');
		const name = this.Identifier();

		this._eat('(');

		//OptFormalParameterList
		const params = this._lookahead.type !== ')' ? this.FormalParameterList() : [];
		this._eat(')');

		const body = this.BlockStatement();

		return {
			type: 'FunctionDeclaration',
			name,
			params,
			body,
		};

    }

    /** FormalParameterList
	 * 	: Identifier
	 *  | FormalParameterList ',' Identifier
 	 *  ;
	 */
	FormalParameterList() {

		const params = [];
		do {

			params.push(this.Identifier());
		} while (this._lookahead.type === ',' && this._eat(','));

		return params;
	}

	/** ReturnStatement
	 * 	: 'return' OptExpression 
 	 *  ;
	 */
	ReturnStatement() {
		this._eat('return');
		const argument = this._lookahead.type !== ';' ? this.Expression() : null;

		this._eat(';');
		return {
			type: 'ReturnStatement',
			argument,
		};

	}

	/** IterationStatement
	 * 	: WhileStatement
	 *  | DoWhileStatement
	 *  | ForStatement
	 *  ;
	 */
	IterationStatement() {

	 	switch (this._lookahead.type) {
	 		case 'while':
	 			return this.WhileStatement();
	 		case 'do':
	 			return this.DoWhileStatement();
	 		case 'for':
	 			return this.ForStatement();
	 	}
	}

	/** WhileStatement
	 * 	: 'while' '(' Expression ')' Statement
	 *  ;
	 */
	WhileStatement() {
		this._eat('while');

		this._eat('(');
		const test = this.Expression();
		this._eat(')');

		const body = this.Statement();

		return {
			type: 'WhileStatement',
			test, 
			body,
		};
	}

	/** DoWhileStatement
	 * 	: 'do' Statement 'while' (' Expression ')' ';'
	 *  ;
	 */
	DoWhileStatement() {
		this._eat('do');

		const body = this.Statement();
		this._eat('while');
		
		this._eat('(');
		const test = this.Expression();
		this._eat(')');
		this._eat(';');

		return {
			type: 'DoWhileStatement',
			body,
			test, 
		};
	}

	/** ForStatement
	 * 	: 'for' '(' OptStatementInit ';' OptExpression ';' OptExpression ')' Statement
	 *  ;
	 */
	ForStatement() {
		this._eat('for');
		this._eat('(');

		const init  = this._lookahead.type !== ';' ? this.ForStatementInit() : null;
		this._eat(';');

		const test  = this._lookahead.type !== ';' ? this.Expression() : null;
		this._eat(';');
		
		const update  = this._lookahead.type !== ')' ? this.Expression() : null;
		this._eat(')');

		const body = this.Statement();

		return {
			type: 'ForStatement',
			init,
			test,
			update,
			body,
		};

	}
	
	/** ForStatementInit
	 * 	: VariableStatementInit
	 *  | Expression
	 *  ;
	 */
	ForStatementInit() {

		if (this._lookahead.type === 'let') {
			return this.VariableStatementInit();
		}

		return this.SequenceExpressionStatement();
	}


	/** IfStatement
	 * 	: 'if' '(' Expression ')' Statement
	 *  | 'if' '(' Expression ')' Statement 'else' Statement
	 *  ;
	 */
	 IfStatement() {
	 	this._eat('if');
	 	this._eat('(');

	 	const test = this.Expression();
	 	this._eat(')');
	 	const consequent = this.Statement();

	 	const alternate = this._lookahead != null && this._lookahead.type === 'else'
	 		? this._eat('else') && this.Statement()
	 		: null;

	 	return {
	 		type: 'IfStatement',
	 		test, 
	 		consequent,
	 		alternate,
	 	};
	 }

	 /** VariableStatementInit
	 * 	: 'let' VariableDeclarationList
	 *  ;
	 */
	 VariableStatementInit() {
	 	this._eat('let');
	 	const declaration = this.VariableDeclarationList();

	 	return {
	 		type: 'VariableStatement',
	 		declaration,
	 	};
	 }

	 /** VariableStatement
	 * 	: VariableStatementInit ';'
	 *  ;
	 */
	 VariableStatement() {

	 	const variableStatement = this.VariableStatementInit();
	 	this._eat(';');

	 	return variableStatement;
	 }

	 /** VariableDeclarationList
	 * 	: VariableDeclaration
	 *  | VariableDeclarationList ',' VariableDeclaration
	 *  ;
	 */
	 VariableDeclarationList() {
	 	const declaration = [];

	 	do {
	 		declaration.push(this.VariableDeclaration());
	 	} while (this._lookahead.type === ',' && this._eat(','));

	 	return declaration;
	 }

	 /** VariableDeclaration
	 *  : Indentifier OptVariableInitializer
	 *  ;
	 */
	 VariableDeclaration() {
	 	const id = this.Identifier();

	 	//OptVariableInitializer
	 	const init = this._lookahead.type !== ';' && this._lookahead.type !== ',' 
	 	? this.VariableInitializer()
	 	: null;

	 	return {
	 		type: 'VariableDeclaration',
	 		id, 
	 		init,
	 	};
	 }

	 /** VariableInitializer
	 *  : SIMPLE_ASSIGN AssignmentExpression
	 *  ;
	 */
	 VariableInitializer() {
	 	this._eat('SIMPLE_ASSIGN');
	 	return this.AssignmentExpression();
	 }

	 /** EmptyStatement
	 * 	: ';'
	 *  ;
	 */
	 EmptyStatement() {
	 	this._eat(';');
	 	return {
	 		type: 'EmptyStatement',
	 	};
	 }


	 /** BlockStatement
	 * 	: '{' OptStatementList '}'
	 *  ;
	 */
	 BlockStatement() {
	 	this._eat('{');
	 	const body = this._lookahead.type !== '}' ? this.StatementList('}') : [];
	 	this._eat('}');

	 	return {
	 		type: 'BlockStatement',
	 		body,
	 	};
	 }

	/** SequenceExpressionStatement
	 * 	: Expression ',' Expression ;'
	 *  ;
	 */
	 SequenceExpressionStatement() {
	 	const expressions = this.SequenceExpressionList();
	 	this._eat(';');

	 	if (expressions.length > 1)
	 	{	
		 	return {
		 		type: 'SequenceExpressionStatement',
		 		expressions,
		 	};
		 }
		 else
		 {
	 		// let expression = expressions[0];
	 		// return expression;
	 		return expressions[0];
		 };

	 	
	}

	/** SequenceExpressionsList
	 * 	: Expression ',' Expression ;'
	 *  ;
	 */
	 SequenceExpressionList() {

	 	const declaration = [];

	 	do {
	 		declaration.push(this.ExpressionStatement());
	 	} while (this._lookahead.type === ',' && this._eat(','));

	 	return declaration;
	 }

	/** ExpressionStatement
	 * 	: Expression ';'
	 *  ;
	 */
	 ExpressionStatement() {
	 	const expression = this.Expression();
	 	// this._eat(';');

	 	return {
	 		type: 'ExpressionStatement',
	 		expression,
	 	};
	 }

	/** Expression
	 * 	: Literal
	 *  ;
	 */
	 Expression() {
	 	return this.AssignmentExpression();
	 }

	 /** AssignmentExpression
	 * 	: LogicalORExpression
	 *  | LeftHandSideExpression AssignmentExpression AssignmentExpression
	 *  ;
	 */ 
	 AssignmentExpression() {

	 	const left = this.LogicalORExpression();

	 	if(!this._isAssignmentExpression(this._lookahead.type))
	 	{
	 		return left;
	 	}

	 	return {
	 		type: 'AssignmentExpression',
	 		operator: this.AssignmentOperator().value,
	 		left: this._checkValidAssignmentTarget(left),
	 		right: this.AssignmentExpression(),
	 	}
	 }

	 /** 
	  * Relational operators : >, <, >=, <=  
	  * 
	  * RelationalExpression
	  * 	: AdditiveExpression
	  *  | AdditiveExpression RELATIONAL_OPERATOR RelationalExpression
	  *  ;
	  */ 
	 RelationalExpression() {
	 	return this._BinaryExpression('AdditiveExpression', 'RELATIONAL_OPERATOR');
	 }

	 /** Identifier
	 * 	: IDENTIFIER
	 *  ;
	 */ 
	 Identifier() {
	 	const name = this._eat('IDENTIFIER').value;
	 	return {
	 		type: 'Identifier',
	 		name,
	 	}
	 }

	 // Whether token is an assignment operator
	 _isAssignmentExpression(tokenType) {
	 	return tokenType === 'SIMPLE_ASSIGN' || tokenType === 'COMPLEX_ASSIGN';
	 }

	 // Extra check to see if it is valid assignment target
	 _checkValidAssignmentTarget(node) {
	 	if(node.type === 'Identifier' || node.type === 'MemberExpression' ) {
	 		return node;
	 	}

	 	throw new SyntaxError('Invalid left-hand side in assignment expression');
	 }

	 /**  Logical OR expression.
	  *
	  *      x || y
	  * 
	  *  LogicalORExpression
	  * 	: LogicalANDExpression EQUALITY_OPERATOR LogicalORExpression
	  *  | LogicalORExpression
	  *  ;
	  */ 
	 LogicalORExpression() {
	 	return this._LogicalExpression('LogicalANDExpression', 'LOGICAL_OR');
	 }


	 /**  Logical AND expression.
	  *
	  *      x && y
	  * 
	  *  LogicalANDExpression
	  * 	: EqualityExpression EQUALITY_OPERATOR LogicalANDExpression
	  *  | EqualityExpression
	  *  ;
	  */ 
	 LogicalANDExpression() {
	 	return this._LogicalExpression('EqualityExpression', 'LOGICAL_AND');
	 }

	 /**    EQUALITY_OPERATOR: ==, !=
	  *      x == y
	  *      x != y 
	  * 
	  *  EqualityExpression
	  * 	: RelationalExpression EQUALITY_OPERATOR EqualityExpression
	  *  | RelationalExpression
	  *  ;
	  */ 
	 EqualityExpression() {
	 	return this._BinaryExpression('RelationalExpression', 'EQUALITY_OPERATOR');
	 }

	 /** AssignmentOperator
	 * 	: SIMPLE_ASSIGN
	 *  | COMPLEX_ASSIGN
	 *  ;
	 */ 
	 AssignmentOperator() {
	 	if(this._lookahead.type === 'SIMPLE_ASSIGN') {
	 		return this._eat('SIMPLE_ASSIGN');
	 	}
 		return this._eat('COMPLEX_ASSIGN');
	 }

	/** AdditiveExpression
	 * 	: MultiplicativeExpression
	 *  | AdditiveExpression ADDITIVE_OPERATOR Literal -> Literal ADDITIVE_OPERATOR Literal ADDITIVE_OPERATOR
	 *  ;
	 */
	 AdditiveExpression() {
	    return this._BinaryExpression('MultiplicativeExpression', 'ADDITIVE_OPERATOR');
	 }

	 /** MultiplicativeExpression
	 * 	: UnaryExpression
	 *  | MultiplicativeExpression MULTIPLICATIVE_OPERATOR UnaryExpression
	 *  ;
	 */
	 MultiplicativeExpression() {
	 	return this._BinaryExpression('UnaryExpression', 'MULTIPLICATIVE_OPERATOR');
	}
	
	/** 
	 *  Helper for logical expression nodes
	 */
	_LogicalExpression(builderName, operatorToken) {
	 	let left = this[builderName]();

	 	while(this._lookahead.type === operatorToken) {
	 		const operator = this._eat(operatorToken).value;
	 		const right = this[builderName]();

	 		left = {
	 			type: 'LogicalExpression',
	 			operator,
	 			left,
	 			right
	 		};
	 	}

	 	return left;
	}

	/** 
	 *  Generic Binary Expression
	 */
	_BinaryExpression(builderName, operatorToken) {
	 	let left = this[builderName]();

	 	while(this._lookahead.type === operatorToken) {
	 		// operator *, / , +, -
	 		const operator = this._eat(operatorToken).value;
	 		const right = this[builderName]();

	 		left = {
	 			type: 'BinaryExpression',
	 			operator,
	 			left,
	 			right
	 		};
	 	}

	 	return left;
	}


	/** UnaryExpression
	 * 	: LeftHandSideExpression
	 *  | ADDITIVE_OPERATOR UnaryExpression
	 *  | LOGICAL_NOT UnaryExpression
	 *  ;
	 */
	UnaryExpression() {
		let operator;
		switch (this._lookahead.type) {
			case 'ADDITIVE_OPERATOR':
				operator = this._eat('ADDITIVE_OPERATOR').value;
				break;
			case 'LOGICAL_NOT':
				operator = this._eat('LOGICAL_NOT').value;
				break;
		}

		if(operator != null) {
			return {
				type: 'UnaryExpression',
				operator,
				argument: this.UnaryExpression(), // --> ----++x 
			};
		}
		return this.LeftHandSideExpression();
	}

	/** LeftHandSideExpression
	 * 	: CallMemberExpression
	 *  ;
	 */
	LeftHandSideExpression() {
		return this.CallMemberExpression();
	}

	/** CallMemberExpression
	 * 	: MemberExpression
	 *  | CallExpression
	 *  ;
	 */
	CallMemberExpression() {
		// Super call 
		if (this._lookahead.type === 'super') {
			return this._CallExpression(this.Super());
		}

		// Member part, might be part of a call
		const member = this.MemberExpression();

		// See if we have a call expression
		if (this._lookahead.type === '(') {
			return this._CallExpression(member);
		}

		// simple member expression
		return member;
	}

	/**  
	 *  Generic call expression helper.
	 *  
	 *  CallExpression
	 *    : Callee Arguments
	 *    ;
	 * 
	 *  Callee 
	 *    : MemberExpression
	 *    | CallExpression
	 *    ;
	 */
	_CallExpression(callee) {
	
		let callExpression = {
			type: 'CallExpression',
			callee,
			arguments: this.Arguments(),
		};

		if(this._lookahead.type === '(') {
			callExpression = this._CallExpression(callExpression);
		}

		return callExpression;
	}

	/**  
	 *  Arguments
	 *   : '(' OptArgumentList ')'
	 *  
	 */
	Arguments() {
		this._eat('(');

		const argumentList = this._lookahead.type !== ')' ? this.ArgumentList() : [];

		this._eat(')');

		return argumentList;
	}

	/**  
	 *  ArgumentList
	 *   : AssignmentExpression
	 *   | ArgumentList ',' AssignmentExpression 
	 *   ;
	 */
	ArgumentList() {
		const argumentList = [];

		do {
			argumentList.push(this.AssignmentExpression());
		} while( this._lookahead.type === ',' && this._eat(',') );

		return argumentList;
	}


	/** MemberExpression
	 * 	: PrimaryExpression
	 *  | MemberExpression '.' Identifier
	 *  | MemberExpression '[' Expression ']'
	 *  ;
	 */
	MemberExpression() {
		let object = this.PrimaryExpression();

		while( this._lookahead.type === '.' || this._lookahead.type === '[') {
			// MemberExpression '.' Identifier
			if(this._lookahead.type === '.') {
				this._eat('.');
				const property = this.Identifier();
				object = {
					type: 'MemberExpression',
					computed: false,
					object,
					property,
				};
			}

			// MemberExpression '[' Expression ']'
			if(this._lookahead.type === '[') {
				this._eat('[');
				const property = this.Expression();
				this._eat(']');
				object = {
					type: 'MemberExpression',
					computed: true,
					object,
					property,
				};
			}

		}

		return object;
	}

	/** PrimaryExpression
	 * 	: Literal
	 *  | ParenthesizedExpression
	 *  | Identifier
	 *  | ThisExpression
	 *  | NewExpression
	 *  ;
	 */
	 PrimaryExpression() {
	 	
	 	if(this._isLiteral(this._lookahead.type)) {
	 		return this.Literal();
	 	}

	 	switch(this._lookahead.type)
	 	{
	 		case '(':
	 			return this.ParenthesizedExpression();
	 		case 'IDENTIFIER':
	 			return this.Identifier();
	 		case 'this':
	 			return this.ThisExpression();
	 		case 'new':
	 			return this.NewExpression();
	 		default:
			 	return this.LeftHandSideExpression();
	 	}
	 }

	/** NewExpression
	 * 	: 'new' MemberExpression Arguments -> new MyNameSpace.MyClass()
	 *  ;
	 */
	 NewExpression() {
	 	this._eat('new');

	 	return {
	 		type: 'NewExpression',
	 		callee: this.MemberExpression(),
	 		arguments: this.Arguments(),
	 	};
	 }

	 /** ThisExpression
	 * 	: 'this'
	 *  ;
	 */
	 ThisExpression() {
	 	this._eat('this');
	 	return {
	 		type: 'ThisExpression',
	 	}
	 }

	 /** Super
	 * 	: 'super'
	 *  ;
	 */
	 Super() {
	 	this._eat('super');
	 	return {
	 		type: 'Super',
	 	}
	 }

	 // is this token Literal ?
	 _isLiteral(tokenType) {
	 	return tokenType === 'NUMBER' ||
	 	tokenType === 'STRING' ||
	 	tokenType === 'true' ||
	 	tokenType === 'false' ||
	 	tokenType === 'null';
	 }	

	 /** ParenthesizedExpression
	 * 	: '(' Expression ')'
	 *  ;
	 */
	 ParenthesizedExpression() {
	 	this._eat('(');
	 	const expression = this.Expression();
	 	this._eat(')');
	 	return expression;
	 }

	/** Literal
	 * 	: NumericLiteral
	 *  | StringLiteral
	 *  | BooleanLiteral
	 *  | NullLiteral
	 *  ;
	 */
	 Literal() {
	 	switch(this._lookahead.type) {
	 		case 'NUMBER': return this.NumericLiteral();
	 		case 'STRING': return this.StringLiteral();
	 		case 'true': return this.BooleanLiteral(true);
	 		case 'false': return this.BooleanLiteral(false);
	 		case 'null': return this.NullLiteral();
	 	}

	 	console.log("wrong lookahead :" + this._lookahead.type);
	 	throw new SyntaxError (`Literal: unexpected literal`);
	 }

	/**
	 * BooleanLiteral
	 *    : 'true'
	 * 	  | 'false' 
	 *    ;
	 */
	 BooleanLiteral(value) {
		this._eat(value ? 'true' : 'false');
	 	
	 	return {
	 		type: 'BooleanLiteral', 
	 		value,
	 	}; 
	 }


	/**
	 * NullLiteral
	 *    : 'null'
	 *    ;
	 */
	 NullLiteral() {
		this._eat('null');
	 	
	 	return {
	 		type: 'NullLiteral', 
	 		value: null,
	 	}; 
	 }


	/**
	 * StringLiteral
	 *    : STRING
	 *    ;
	 */
	 StringLiteral() {
		const token = this._eat('STRING');
	 	
	 	return {
	 		type: 'StringLiteral', 
	 		value: token.value.slice(1, -1), // remove string literal quites
	 	}; 
	 }

	/**
	 * NumbericLiteral
	 *    : NUMBER
	 *    ;
	 */
	 NumericLiteral() {
	 	const token = this._eat('NUMBER');
	 	
	 	return {
	 		type: 'NumericLiteral', 
	 		value: Number(token.value),
	 	};
	 }

	 // expects a token of a given type 
	 _eat(tokenType) {

	 	const token = this._lookahead;
	 	if(token == null) {
	 		throw new SyntaxError (`Unexpected end of input, expected: "${tokenType}"`);
	 	}

	 	if(token.type !== tokenType) {
	 		throw new SyntaxError (`Unexpected token: "${token.value}", expected: "${tokenType}"`);
	 	}

	 	// advance to the next token
	 	this._lookahead = this._tokenizer.getNextToken();

	 	return token;
	 }
}

module.exports = {
	Parser,
};

