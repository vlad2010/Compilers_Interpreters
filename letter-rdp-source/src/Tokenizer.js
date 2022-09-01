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
		const string  = this._string.slice(this._cursor);

		// String tokens 
		if(string[0] === '"' || string[0] === '\'')  {

			let quote = string[0];

			let s = '';
			do {
				s += string[this._cursor++];
			} while (string[this._cursor] !== quote && !this.isEOF());
			s += this._cursor++; // skip closing "

			return {
				type: 'STRING',
				value: s,
			}
		}

		// Numbers :
		if(!Number.isNaN(string[0])) {
			let number = "";
			while(!Number.isNaN(Number(string[this._cursor]))) {
				number += string[this._cursor++];
			}
			return {
				type: 'NUMBER',
				value: number,
			}
		}

		return null;
	}
}

module.exports = {
	Tokenizer,
};