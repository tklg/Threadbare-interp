// class that goes through the token chain and marks matching {}, (), []
import BraceLeftToken from './token/BraceLeftToken.js';
import BraceRightToken from './token/BraceRightToken.js';
import ParenLeftToken from './token/ParenLeftToken.js';
import ParenRightToken from './token/ParenRightToken.js';
import BracketLeftToken from './token/BracketLeftToken.js';
import BracketRightToken from './token/BracketRightToken.js';
import CommentStartToken from './token/CommentStartToken.js';
import CommentEndToken from './token/CommentEndToken.js';

function TokenLinker() {
	this.link = function(tokens) {
		return new Promise((resolve, reject) => {
			try {
				linkTokens(tokens, 0, tokens.length);				
			} catch (e) {
				reject(e);
			}
			resolve(tokens);
		});
	}
	function linkTokens(tokens, startInd, stopInd) {
		for (var i = startInd; i < stopInd; i++) {
			if (tokens[i] instanceof BraceLeftToken && !tokens[i].matchingToken) {
				// find matching right token and link them both
				var balance = 0;
				for (var j = i + 1; j < tokens.length; j++) {
					if (balance < 0) { // unmatched }
						throw `Unmatched BraceRightToken at: Line ${tokens[i].pos.row}, Column ${tokens[i].pos.col}.`;
					}
					if (tokens[j] instanceof BraceRightToken) {
						if (balance === 0) { // balanced, link them
							var left = tokens[i];
							var right = tokens[j];
							left.matchingToken = right;
							right.matchingToken = left;
						} else {
							balance--;
						}
					} else if (tokens[j] instanceof BraceLeftToken) {
						balance++;
						// also start an entirely new loop for this new, unlinked left {
						linkTokens(tokens, j, stopInd);
					}
				}
			} else if (tokens[i] instanceof ParenLeftToken && !tokens[i].matchingToken) {
				var balance = 0;
				for (var j = i + 1; j < tokens.length; j++) {
					if (balance < 0) {
						throw `Unmatched ParenRightToken at: Line ${tokens[i].pos.row}, Column ${tokens[i].pos.col}.`;
					}
					if (tokens[j] instanceof ParenRightToken) {
						if (balance === 0) {
							var left = tokens[i];
							var right = tokens[j];
							left.matchingToken = right;
							right.matchingToken = left;
						} else {
							balance--;
						}
					} else if (tokens[j] instanceof ParenLeftToken) {
						balance++;
						linkTokens(tokens, j, stopInd);
					}
				}
			} else if (tokens[i] instanceof BracketLeftToken && !tokens[i].matchingToken) {
				var balance = 0;
				for (var j = i + 1; j < tokens.length; j++) {
					if (balance < 0) {
						throw `Unmatched BracketRightToken at: Line ${tokens[i].pos.row}, Column ${tokens[i].pos.col}.`;
					}
					if (tokens[j] instanceof BracketRightToken) {
						if (balance === 0) {
							var left = tokens[i];
							var right = tokens[j];
							left.matchingToken = right;
							right.matchingToken = left;
						} else {
							balance--;
						}
					} else if (tokens[j] instanceof BracketLeftToken) {
						balance++;
						linkTokens(tokens, j, stopInd);
					}
				}
			} else if (tokens[i] instanceof CommentStartToken && !tokens[i].matchingToken) {
				var balance = 0;
				for (var j = i + 1; j < tokens.length; j++) {
					if (balance < 0) {
						throw `Unmatched CommentEndToken at: Line ${tokens[i].pos.row}, Column ${tokens[i].pos.col}.`;
					}
					if (tokens[j] instanceof CommentEndToken) {
						if (balance === 0) {
							var left = tokens[i];
							var right = tokens[j];
							left.matchingToken = right;
							right.matchingToken = left;
						} else {
							balance--;
						}
					} else if (tokens[j] instanceof CommentStartToken) {
						balance++;
						linkTokens(tokens, j, stopInd);
					}
				}
			}
		}
	}
}
export default TokenLinker;