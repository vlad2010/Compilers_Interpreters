
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
	 StatementList() {
	 	const statementList = [this.Statement()];

	 	while(this._lookahead != null) {
	 		statementList.push(this.Statement());
	 	}

	 	return statementList;
	 }

	/** Statement
	 * 	: ExpressionStatement
	 *  ;
	 */
	 Statement() {
	 	return this.ExpressionStatement();
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
	 	return this.Literal();
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

