import Log from './../logger/Log.js';
import Program from './ast/Program.js';
import VariableDeclaration from './ast/VariableDeclaration.js';
import ThreadDeclaration from './ast/ThreadDeclaration.js';
import VariableDeclarator from './ast/VariableDeclarator.js';
import Identifier from './ast/Identifier.js';
import Literal from './ast/Literal.js';
import BinaryExpression from './ast/BinaryExpression.js';
import UpdateExpression from './ast/UpdateExpression.js';
import AssignmentExpression from './ast/AssignmentExpression.js';
import BlockStatement from './ast/BlockStatement.js';
import ExpressionStatement from './ast/ExpressionStatement.js';
import BuiltinMethod from './ast/BuiltinMethod.js';

function ASTBuilder() {
	const TAG = "ASTBuilder";
	var root = null;
	this.parse = function(tokens) {
		return new Promise((resolve, reject) => {
			root = new Program();
			// Log.d(TAG, tokens);
			getExpressions(root, tokens);

			resolve(root);
		});
	}
	function getExpressions(block, tokens) {
		var i = 0;
		while (i < tokens.length) {
			var expression;
			//Log.d("N", i);
			//Log.d(TAG, tokens[i]);

			if (isCommentBlock(tokens, i)) {
				var x = i;
				while (tokens[x].type !== 'commentEnd') {
					//Log.d(tokens[x]);
					x++;
					if (!tokens[x]) throw "Unclosed comment block at position " + i;
				}
				i = x + 1;
				continue;
			}
			// global int x = ...
			// ends in a SemToken
			else if (isVariableDeclaration(tokens, i)) {
				var subTokens = tokens.slice(i, findDeclarationRange(tokens, i)[1]); // do not include the ;
				expression = new VariableDeclaration();
				i += subTokens.length;


				if (subTokens[0].type === 'typeModifier') {
					expression.addModifier(subTokens[0].value);
					subTokens.shift();
				}
				if (subTokens[0].type === 'primitiveType' || subTokens[0].type === 'objectType') {
					expression.kind = subTokens[0].value;
					subTokens.shift();
				}

				if (subTokens.length) {
					var decs = findVariableDeclarator(subTokens);
					//Log.d(decs);
					for (var d of decs) {
						expression.addDeclaration(d);
					}
				}

				block.addToBody(expression);

				continue;
			} else if (isThreadDeclaration(tokens, i)) {
				expression = new ThreadDeclaration();
				var id = new Identifier();
				var body = new BlockStatement();

				if (tokens[i + 1].value === '{') { // nameless thread
					id.name = "THREAD_" + i;
				} else { // find the name and opt. params
					var tok = tokens[i + 1];
					if (tok.type === 'label') {
						id.name = tok.value;
					} else { // type === 'paramLabel'
						// label(params):
						var name = tok.value.split('(')[0];
						var params = tok.value.substring(tok.value.indexOf('(') + 1, tok.value.lastIndexOf(')'));

						id.name = name;
						params = params.split(',');
						for (var p of params) {
							var iden = new Identifier();
							iden.name = p;
							expression.addParam(iden);
						}
					}
					i++;
				}

				expression.id = id;
				var indexes = findBlockIndexes(tokens, i, 'braceLeft');
				var subTokens = tokens.slice(indexes.start + 1, indexes.end);
				if (subTokens.length) {
					getExpressions(body, subTokens);
				}
				expression.body = body;
				i += subTokens.length + 2;
				block.addToBody(expression);

				continue;
			} else if (isExpressionStatement(tokens, i)) { // generic line
				var range = findDeclarationRange(tokens, i);

				var subTokens = tokens.slice(range[0], range[1]);
				expression = new ExpressionStatement();
				expression.expression = getSingleExpression(subTokens);
				block.addToBody(expression);

				i += subTokens.length;
			} else if (isBuiltinMethod(tokens, i)) {
				var expression = new BuiltinMethod();
				expression.callee = tokens[i].value;
				var indexes = findBlockIndexes(tokens, i, 'builtin');
				var subTokens = tokens.slice(indexes.start + 1, indexes.end);
				for (var j = 0; j < subTokens.length; j++) {
					expression.addArgument(getSingleExpression([subTokens[j]]));
				}
				i += subTokens.length + 2;
				block.addToBody(expression);
			}
			i++;
		}
		return block;
	}
	function getSingleExpression(tokens) {
		if (!tokens || !tokens.length) {
			var lit = new Literal();
			lit.value = null;
			lit.raw = "";
			return lit;
		}
		if (isLiteral(tokens)) {
			var lit = new Literal();
			lit.value = tokens[0].value;
			lit.raw = typeof tokens[0].value === 'string' ? '"'+tokens[0].value+'"' : ''+tokens[0].value;
			return lit;
		} else if (isIdentifier(tokens)) {
			var id = new Identifier();
			id.name = tokens[0].value;
			return id;
		} else if (isAssignmentExpression(tokens)) { // a = 1, a += 1
			var asn = new AssignmentExpression();
			asn.operator = tokens[1].value;
			asn.left = getSingleExpression([tokens[0]]);
			var subTokens = tokens.splice(2, tokens.length);
			//Log.d(subTokens);
			asn.right = getSingleExpression(subTokens);
			return asn;
		} else if (isBinaryExpression(tokens)) { // a + 1, must be after assignmentExpression
			var bex = getBinaryExpression(tokens);
			return bex;
		} else if (isUpdateExpression(tokens)) { // a++
			var upd = new UpdateExpression();
			var tok, op;
			if (tokens[0].type === 'operatorShorthand') {
				upd.argument = getSingleExpression([tokens[1]]);
				upd.operator = tokens[0].value;
				upd.isPrefix = true;
			} else {
				upd.argument = getSingleExpression([tokens[0]]);
				upd.operator = tokens[1].value;
			}
			return upd;
		}
	}
	function getBinaryExpression(tokens) {
		// 1 + 2
		// (1 + 2) + 3
		// 1 + (2 + 3)
		// (1 + 2) + (3 + 4)
		// pemdas not implemented
		var ops = tokens.filter(t => isOperator(t));
		var bex = new BinaryExpression();
		if (ops.length === 1) {
			// if there is only 1 operator
			tokens = tokens.filter(t => t.value !== '(' && t.value !== ')');
			var opInd = tokens.indexOf(ops[0]);
			bex.operator = ops[0].value;
			bex.left = getSingleExpression(tokens.slice(0, opInd));
			bex.right = getSingleExpression(tokens.slice(opInd + 1, tokens.length));
		} else {
			// find the leftmost shallowest operator
			// {token: token, depth: int}
			var depthLabels = [];
			var depth = 0;
			for (var t of tokens) {
				if (t.value === '(') depth++;
				if (t.value === ')') depth--;
				if (isOperator(t)) depthLabels.push({
					token: t, 
					depth: depth,
				});
			}
			var depths = depthLabels.map(x => x.depth);
			var min = Math.min(...depths);
			var centerOperatorToken = depthLabels.filter(x => x.depth === min).reverse()[0].token;
			var cind = tokens.indexOf(centerOperatorToken);

			bex.operator = centerOperatorToken.value;
			var lToks = tokens.slice(0, cind);
			if (lToks[0].value === '(' && lToks[lToks.length - 1].value === ')') {
				lToks.shift();
				lToks.pop();
			}
			var rToks = tokens.slice(cind + 1, tokens.length);
			if (rToks[0].value === '(' && rToks[rToks.length - 1].value === ')') {
				rToks.shift();
				rToks.pop();
			}
			bex.left = getSingleExpression(lToks);
			bex.right = getSingleExpression(rToks);
		}
		return bex;
	}
	function findVariableDeclarator(tokens) {
		var i = 0;
		var x = tokens.length;
		var decs = [];
		while (i < x && tokens.length > 0) {
			if (isVariableDeclarator(tokens)) {
				var decl = new VariableDeclarator();
				var leftIdent = new Identifier();
				leftIdent.name = tokens[0].value;
				decl.id = leftIdent;
				var cind = findCommaIndex(tokens);
				if (tokens[1].value === '=') {
					var init = getSingleExpression(tokens.slice(2, cind));
					decl.init = init;
				}
				tokens.splice(0, cind + 1); // x,
				decs.push(decl);
			} else {
				throw "Expected a declarator.";
			}
			i++;
		}
		return decs;
	}
	function isBuiltinMethod(tokens, i) {
		return tokens[i].type === 'builtin';
	}
	function isCommentBlock(tokens, i) {
		return tokens[i].type === 'commentStart';
	}
	function isLiteral(tokens) {
		return tokens.length === 1 && ['valueInteger'].includes(tokens[0].type);
	}
	function isBinaryExpression(tokens) {
		return tokens.length >= 3
			&& tokens.reduce((a, t) => {
				return a || isOperator(t);
			}, false);
	}
	function isOperator(token) {
		return ['+','-','*','/','%','^','&','|','&&','||'].includes(token.value)
	}
	function isIdentifier(tokens) {
		return tokens.length === 1 && ['variableName'].includes(tokens[0].type)
	}
	function isExpressionStatement(tokens, i) {
		return ['variableName'].includes(tokens[i].type) || ['++','--'].includes(tokens[i].value);
	}
	function isAssignmentExpression(tokens) {
		return ['=','+=','-=','*=','/=','&=','|=','^='].includes(tokens[1].value);
	}
	function isUpdateExpression(tokens) {
		var tok;
		if (tokens[0].type === 'operatorShorthand') tok = tokens[0];
		else tok = tokens[1];
		return ['++','--'].includes(tok.value);
	}
	function findDeclarationRange(tokens, _i) {
		var j = _i;
		var i = _i;
		while (i < tokens.length) {
			if (tokens[i].type === 'semicolon') return [j, i];
			else i++;
		}
	}
	function findCommaIndex(tokens) {
		var i = 0;
		while (i < tokens.length) {
			if (tokens[i].type === 'comma') break;
			else i++;
		}
		return i;
	}
	function findBlockIndexes(tokens, i, type) {
		var i = i;
		// thread TAG: { }
		// function name() { }
		// monitor label: { }
		while (i < tokens.length) {
			if (tokens[i].type === type) 
				return {
					start: i, 
					end: tokens.indexOf(tokens[i].matchingToken)
				};
			i++;
		}
		return {start: 0, end: 0};
	}
	function isVariableDeclaration(tokens, i) {
		if (tokens[i].type === 'typeModifier') { // global int x ...
			return true;
		} else if (tokens[i].type === 'primitiveType' || tokens[i].type === 'objectType') { // int x ...
			return true;
		}
		return false;
	}
	function isVariableDeclarator(tokens) {
		if (tokens[0].type === 'variableName' && tokens[1].value === '=') { // x = ...
			return true;
		}
		return false;
	}
	function isThreadDeclaration(tokens, i) {
		return tokens[i].type === 'thread';
	}
}
export default ASTBuilder;