import Token from './Token.js';

class FunctionToken extends Token {
	get matchingToken() {
		return this.match;
	}
	set matchingToken(token) {
		this.match = token;
	}
}

export default FunctionToken;