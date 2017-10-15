// class that goes through the token chain and marks matching {}, (), []
import BraceLeftToken from './token/BraceLeftToken.js';
import BraceRightToken from './token/BraceRightToken.js';
import ParenLeftToken from './token/ParenLeftToken.js';
import ParenRightToken from './token/ParenRightToken.js';
import BracketLeftToken from './token/BracketLeftToken.js';
import BracketRightToken from './token/BracketRightToken.js';
import CommentStartToken from './token/CommentStartToken.js';
import CommentEndToken from './token/CommentEndToken.js';
import FunctionToken from './token/FunctionToken.js';

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
				var sub = null;
				for (var j = i + 1; j < stopInd; j++) {
					if (balance < 0) { // unmatched }
						throw `Unmatched BraceRightToken at: Line ${tokens[i].pos.row}, Column ${tokens[i].pos.col}.`;
					}
					if (tokens[j] instanceof BraceRightToken) {
						if (balance === 0) { // balanced, link them
							var left = tokens[i];
							var right = tokens[j];
							left.matchingToken = right;
							right.matchingToken = left;
							
							// only link tokens between the previously linked tokens, 
							// because balanced brackets
							if (sub !== null) {
								sub.stop = +j;
								linkTokens(tokens, sub.start, sub.stop);
							}
						} else {
							balance--;
						}
					} else if (tokens[j] instanceof BraceLeftToken) {
						balance++;
						if (sub === null) sub = {start: +j, stop: null};
						// also start an entirely new loop for this new, unlinked left {
						//linkTokens(tokens, j, stopInd);
					}
				}
			} else if (tokens[i] instanceof ParenLeftToken && !tokens[i].matchingToken) {
				var balance = 0;
				var sub = null;
				for (var j = i + 1; j < stopInd; j++) {
					if (balance < 0) {
						throw `Unmatched ParenRightToken at: Line ${tokens[i].pos.row}, Column ${tokens[i].pos.col}.`;
					}
					if (tokens[j] instanceof ParenRightToken) {
						if (balance === 0) {
							var left = tokens[i];
							var right = tokens[j];
							left.matchingToken = right;
							right.matchingToken = left;

							if (sub !== null) {
								sub.stop = +j;
								linkTokens(tokens, sub.start, sub.stop);
							}
						} else {
							balance--;
						}
					} else if (tokens[j] instanceof ParenLeftToken) {
						balance++;
						if (sub === null) sub = {start: +j, stop: null};
						//linkTokens(tokens, j, stopInd);
					}
				}
			} else if (tokens[i] instanceof FunctionToken && !tokens[i].matchingToken) { // a function is matched by name( so it needs a closing )
				var balance = 0;
				var sub = null;
				for (var j = i + 1; j < stopInd; j++) {
					if (balance < 0) {
						throw `Unmatched FunctionToken at: Line ${tokens[i].pos.row}, Column ${tokens[i].pos.col}.`;
					}
					if (tokens[j] instanceof ParenRightToken) {
						if (balance === 0) {
							var left = tokens[i];
							var right = tokens[j];
							left.matchingToken = right;
							right.matchingToken = left;

							if (sub !== null) {
								sub.stop = +j;
								linkTokens(tokens, sub.start, sub.stop);
							}
						} else {
							balance--;
						}
					} else if (tokens[j] instanceof ParenLeftToken) {
						balance++;
						if (sub === null) sub = {start: +j, stop: null};
						//linkTokens(tokens, j, stopInd);
					}
				}
			} else if (tokens[i] instanceof BracketLeftToken && !tokens[i].matchingToken) {
				var balance = 0;
				var sub = null;
				for (var j = i + 1; j < stopInd; j++) {
					if (balance < 0) {
						throw `Unmatched BracketRightToken at: Line ${tokens[i].pos.row}, Column ${tokens[i].pos.col}.`;
					}
					if (tokens[j] instanceof BracketRightToken) {
						if (balance === 0) {
							var left = tokens[i];
							var right = tokens[j];
							left.matchingToken = right;
							right.matchingToken = left;

							if (sub !== null) {
								sub.stop = +j;
								linkTokens(tokens, sub.start, sub.stop);
							}
						} else {
							balance--;
						}
					} else if (tokens[j] instanceof BracketLeftToken) {
						balance++;
						if (sub === null) sub = {start: +j, stop: null};
						//linkTokens(tokens, j, stopInd);
					}
				}
			} else if (tokens[i] instanceof CommentStartToken && !tokens[i].matchingToken) {
				var balance = 0;
				var sub = null;
				for (var j = i + 1; j < stopInd; j++) {
					if (balance < 0) {
						throw `Unmatched CommentEndToken at: Line ${tokens[i].pos.row}, Column ${tokens[i].pos.col}.`;
					}
					if (tokens[j] instanceof CommentEndToken) {
						//if (balance === 0) {
							var left = tokens[i];
							var right = tokens[j];
							left.matchingToken = right;
							right.matchingToken = left;

							if (sub !== null) {
								sub.stop = +j;
								// dont bother linking tokens in comments
								//linkTokens(tokens, sub.start, sub.stop);
							}
						/*} else {
							balance--;
						}*/
					} else if (tokens[j] instanceof CommentStartToken) {
						//balance++;
						if (sub === null) sub = {start: +j, stop: null};
						//linkTokens(tokens, j, stopInd);
					}
				}
			}
		}
	}
}
export default TokenLinker;