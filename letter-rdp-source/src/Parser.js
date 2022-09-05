
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
	 *  ;
	 */
	 Statement() {
	 	switch(this._lookahead.type) {
	 		case ';':
	 			return this.EmptyStatement();
	 		case '{': 
	 			return this.BlockStatement();
	 		default:
			 	return this.ExpressionStatement();
	 	}
	 }

	 /** EmptyStatement
	 * 	: ';'
	 *  ;
	 */
	 EmptyStatement() {
	 	this._eat(';');
	 	return {
	 		type: 'EmptyStatement',
	 	}
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
	 	return this.AdditiveExpression();
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

	/** Literal
	 * 	: PrimaryExpression
	 *  | ParenthesizedExpression
	 *  ;
	 */
	 PrimaryExpression() {
	 	switch(this._lookahead.type)
	 	{
	 		case '(':
	 			return this.ParenthesizedExpression();
	 		default:
			 	return this.Literal();	 			
	 	}
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

