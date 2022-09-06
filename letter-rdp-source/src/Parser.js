
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
	 *  ;
	 */
	 Statement() {
	 	switch(this._lookahead.type) {
	 		case ';':
	 			return this.EmptyStatement();
	 		case '{': 
	 			return this.BlockStatement();
	 		case 'let':
	 			return this.VariableStatement();
	 		default:
			 	return this.ExpressionStatement();
	 	}
	 }

	 /** VariableStatement
	 * 	: 'let' VariableDeclarationList ';'
	 *  ;
	 */
	 VariableStatement() {
	 	this._eat('let');
	 	const declaration = this.VariableDeclarationList();
	 	this._eat(';');
	 	return {
	 		type: 'VariableStatement',
	 		declaration,
	 	};
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

	/** ExpressionStatement
	 * 	: Expression ';'
	 *  ;
	 */
	 ExpressionStatement() {
	 	const expression = this.Expression();
	 	this._eat(';');

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
	 * 	: AdditiveExpression
	 *  | LeftHandSideExpression AssignmentExpression AssignmentExpression
	 *  ;
	 */ 
	 AssignmentExpression() {

	 	const left = this.AdditiveExpression();

	 	if(!this._isAssignmentExpression(this._lookahead.type))
	 	{
	 		return left;
	 	}

	 	return {
	 		type: 'AssignmentExpression',
	 		operator: this.AssignmentOperator(),
	 		left: this._checkValidAssignmentTarget(left),
	 		right: this.AssignmentExpression(),
	 	}
	 }

	 /** LeftHandSideExpression
	 * 	: Identifier
	 *  ;
	 */ 
	 LeftHandSideExpression() {
	 	return this.Identifier();
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
	 	if(node.type === 'Identifier') {
	 		return node;
	 	}

	 	throw new SyntaxError('Invalid left-hand side in assignment expression');
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
	 * 	: PrimaryExpression
	 *  | MultiplicativeExpression MULTIPLICATIVE_OPERATOR Literal -> Literal MULTIPLICATIVE_OPERATOR Literal MULTIPLICATIVE_OPERATOR
	 *  ;
	 */
	 MultiplicativeExpression() {
	 	return this._BinaryExpression('PrimaryExpression', 'MULTIPLICATIVE_OPERATOR');
	}
	
	/** 
	 *  Generic Binary Expression
	 */
	_BinaryExpression(builderName, operatorToken) {
	 	let left = this[builderName]();

	 	while(this._lookahead.type === operatorToken) {
	 		// operator *, / 
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

	/** PrimaryExpression
	 * 	: Literal
	 *  | ParenthesizedExpression
	 *  | LeftHandSideExpression
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
	 		default:
			 	return this.LeftHandSideExpression();
	 	}
	 }

	 // is this token Literal ?
	 _isLiteral(tokenType) {
	 	return tokenType === 'NUMBER' || tokenType === 'STRING';
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
	 *  ;
	 */
	 Literal() {
	 	switch(this._lookahead.type) {
	 		case 'NUMBER': return this.NumericLiteral();
	 		case 'STRING': return this.StringLiteral();
	 	}

	 	console.log("wrong lookahead :" + this._lookahead.type);
	 	throw new SyntaxError (`Literal: unexpected literal`);
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

