import Token from './Token.js';

class ControlFlowToken extends Token {
	get matchingToken() {
		return this.match;
	}
	set matchingToken(token) {
		this.match = token;
	}
}

export default ControlFlowToken;