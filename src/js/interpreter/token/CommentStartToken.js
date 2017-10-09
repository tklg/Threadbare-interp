import Token from './Token.js';

class CommentStartToken extends Token {
	get matchingToken() {
		return this.match;
	}
	set matchingToken(token) {
		this.match = token;
	}
}

export default CommentStartToken;