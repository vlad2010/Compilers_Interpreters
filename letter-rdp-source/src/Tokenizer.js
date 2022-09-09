// Tokenizer specs

// set of regular expression rules
// order of these rules are important!
const Spec = [
	// Whitespaces:
	[/^\s+/, null], // skip this token

	// Comments: 
	// Single line comments:
	[/^\/\/.*/, null],

	// Multiline comment
	[/^\/\*[\s\S]*?\*\//, null],

	// Symbols, delimiters
	[/^;/, ';'],
	[/^{/, '{'],
	[/^}/, '}'],
	[/^\(/, '('],
	[/^\)/, ')'],
	[/^,/, ','],

	// Keywords 
	[/^\blet\b/, 'let'],
	[/^\bif\b/, 'if'],
	[/^\belse\b/, 'else'],
	[/^\btrue\b/, 'true'],
	[/^\bfalse\b/, 'false'],
	[/^\bnull\b/, 'null'],
	[/^\bwhile\b/, 'while'],
	[/^\bdo\b/, 'do'],
	[/^\bfor\b/, 'for'],

	// Numbers:
	[/^\d+/, 'NUMBER'],

	// Identifiers:
	[/^\w+/, 'IDENTIFIER'],

	// Equality operators
	[/^[=!]=/, 'EQUALITY_OPERATOR'],


	// Assigmnet operators: =, *=, /=, +=, -=
	[/^=/, 'SIMPLE_ASSIGN'],
	[/^[\*\/\+\-]=/, 'COMPLEX_ASSIGN'],

	// Strings:
	[/"[^"]*"/, 'STRING'],
	[/'[^']*'/, 'STRING'],

	// Math operators
	[/^[+\-]/, 'ADDITIVE_OPERATOR'],
	[/^[*\/]/, 'MULTIPLICATIVE_OPERATOR'],

	// Relational operators : >, <, >=, <=
	[/^[<>]=?/, 'RELATIONAL_OPERATOR'],

	// Logical operators: &&, ||
	[/^&&/, 'LOGICAL_AND'],
	[/^\|\|/, 'LOGICAL_OR'],
	[/^!/, 'LOGICAL_NOT'],

];


// Tokenizer class
// Lazily pulls a token from a stream
 
class Tokenizer {
		
	init(string) {
		this._string = string;
		this._cursor = 0;  //char position
	}

	// is tokenizer reached end of the input stream
	isEOF() {
		return this._cursor === this._string.length;
	}

	// do we have more tokens? 
	hasMoreTokens() {
		return this._cursor < this._string.length;
	}

	// main method, return token on demand
	getNextToken() {
		if(!this.hasMoreTokens()) {
			return null;
		}
		const string = this._string.slice(this._cursor);

		// generic get token implementaton using regexp specs
		for (const [regexp, tokenType] of Spec) {

			const tokenValue = this._match(regexp, string);
			// console.log("tokenValue: " + tokenValue);

			// == vs === in JavaScript 
			if(tokenValue === null) {
				continue;
			}

			// in case of whitespaces skip and get next token
			if(tokenType === null) {
				return this.getNextToken();
			}

			return {
				type: tokenType,
				value: tokenValue,
			}
		}

		throw new SyntaxError (`Unexpected token: "${string}"`);
	}

	// helper function to match regexp with string 
	_match(regexp, string) {
		const matched = regexp.exec(string);

		if(matched === null) {
			return null;
		}	

		this._cursor += matched[0].length;
		return matched[0];

	}

}

module.exports = {
	Tokenizer,
};