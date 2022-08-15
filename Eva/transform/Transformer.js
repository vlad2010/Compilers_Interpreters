// AST transformer for syntax sugar like for, switch, i++, i--

class Transformer 
{
	/*
        Translate def expression (function declaration) into variable
        declaration with lambda expression.
	*/
	transformDefToLambda(defExp) {
       // JIT transpile to a variable declaration
	    const [_tag, name, params, body] = defExp;
        return ['var', name, ['lambda', params, body]];
	}

	// transform switch to if
	transformSwitchToIf(switchExp) {
		const [_tag, ...cases] = switchExp;
		const ifExpr = ['if', null, null, null];

		let current = ifExpr;
		for(let i=0; i < cases.length - 1; i++)
		{
			const [currentCond, currentBlock] = cases[i];
			current[1] = currentCond;
			current[2] = currentBlock;

			const next = cases[i + 1];
			const [nextCond, nextBlock] = next;

			current[3] = nextCond === 'else'
			   ? nextBlock : ['if'];

			current = current[3];
		}

		return ifExpr;
	}
}

module.exports = Transformer;