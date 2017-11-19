import Log from './../logger/Log.js';
import Program from './ast/Program.js';
import VariableDeclaration from './ast/VariableDeclaration.js';
import ThreadDeclaration from './ast/ThreadDeclaration.js';
import VariableDeclarator from './ast/VariableDeclarator.js';
import Identifier from './ast/Identifier.js';
import Literal from './ast/Literal.js';
import BinaryExpression from './ast/BinaryExpression.js';
import UnaryExpression from './ast/UnaryExpression.js';
import UpdateExpression from './ast/UpdateExpression.js';
import AssignmentExpression from './ast/AssignmentExpression.js';
import MemberExpression from './ast/MemberExpression.js';
import CallExpression from './ast/CallExpression.js';
import BlockStatement from './ast/BlockStatement.js';
import ExpressionStatement from './ast/ExpressionStatement.js';
import BuiltinMethod from './ast/BuiltinMethod.js';
import FunctionExpression from './ast/FunctionExpression.js';
import ArrayExpression from './ast/ArrayExpression.js';
import ConstructorFunctionExpression from './ast/ConstructorFunctionExpression.js';
import IFStatement from './ast/IFStatement.js';
import ForStatement from './ast/ForStatement.js';
import WhileStatement from './ast/WhileStatement.js';
import MethodDefinition from './ast/MethodDefinition.js';
import ClassDeclaration from './ast/ClassDeclaration.js';
import ClassBody from './ast/ClassBody.js';

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
				if (isClassConstructorDeclaration(tokens, i)) {
					expression = new MethodDefinition();
					var definitionBody = new /*Constructor*/FunctionExpression();
					var body = new BlockStatement();

					var className = tokens[i + 1].value;
					var indexes = findBlockIndexes(tokens, i, 'function');
					var paramTokens = tokens.slice(indexes.start + 1, indexes.end);
					i += paramTokens.length + 2;

					indexes = findBlockIndexes(tokens, i, 'braceLeft');
					var subTokens = tokens.slice(indexes.start + 1, indexes.end);
					i += subTokens.length + 2;
					
					var iden = new Identifier();
					iden.name = className + "_";
					//expression.classType = className;
					// find params
					var len = 0;
					if (paramTokens.length >= 2) {
						var start = 0, end = 0;
						var subsub = [];
						for (var j = 0; j < paramTokens.length; j++) {
							//Log.d(TAG, subTokens[j]);
							if (paramTokens[j].type === 'comma') {
								end = j;
								subsub = paramTokens.slice(start, end);
								if (subsub.length > 1) {
									var param = new VariableDeclaration();
									param.kind = subsub[0].value;
									param.addDeclaration(findVariableDeclarator([subsub[1]])[0]);
									definitionBody.addParam(param);
									//iden.name += param.kind[0];
									len++;
								}
								start = j + 1;
							}
						}
						subsub = paramTokens.slice(start, paramTokens.length);
						var param = new VariableDeclaration();
						param.kind = subsub[0].value;
						param.addDeclaration(findVariableDeclarator([subsub[1]])[0]);
						definitionBody.addParam(param);
						//iden.name += param.kind[0];
						len++;
					}
					iden.name += ""+len;
					// find body
					if (subTokens.length) {
						getExpressions(body, subTokens);
					}
					definitionBody.body = body;
					expression.key = iden;
					expression.kind = 'constructor';
					expression.value = definitionBody;
				} else if (isClassMethodDeclaration(tokens, i)) {
					expression = new MethodDefinition();
					var definitionBody = new FunctionExpression();
					var body = new BlockStatement();
					var iden = new Identifier();
					while (tokens[i].type === 'typeModifier' || tokens[i].type === 'atomic') {
						switch (tokens[i].value) {
							case 'public':
							case 'private':
							case 'protected': 
								expression.visibility = tokens[i].value;
								break;
							case 'static':
								expression.isStatic = true;
								break;
							case 'atomic':
								body.atomic = true;
								break;
						}
						i++;
					}
					var indexes = findBlockIndexes(tokens, i, 'function');
					var paramTokens = tokens.slice(indexes.start + 1, indexes.end);
					iden.name = tokens[indexes.start].value + "_";
					i += paramTokens.length + 2;
					indexes = findBlockIndexes(tokens, i, 'braceLeft');
					var subTokens = tokens.slice(indexes.start + 1, indexes.end);
					i += subTokens.length + 2;
					
					// find params
					var len = 0;
					if (paramTokens.length >= 2) {
						var start = 0, end = 0;
						var subsub = [];
						for (var j = 0; j < paramTokens.length; j++) {
							//Log.d(TAG, subTokens[j]);
							if (paramTokens[j].type === 'comma') {
								end = j;
								subsub = paramTokens.slice(start, end);
								if (subsub.length > 1) {
									var param = new VariableDeclaration();
									param.kind = subsub[0].value;
									param.addDeclaration(findVariableDeclarator([subsub[1]])[0]);
									definitionBody.addParam(param);
									//iden.name += param.kind[0];
									len++;
								}
								start = j + 1;
							}
						}
						subsub = paramTokens.slice(start, paramTokens.length);
						var param = new VariableDeclaration();
						param.kind = subsub[0].value;
						param.addDeclaration(findVariableDeclarator([subsub[1]])[0]);
						definitionBody.addParam(param);
						//iden.name += param.kind[0];
						len++;
					}
					iden.name += ""+len;
					// find body
					if (subTokens.length) {
						getExpressions(body, subTokens);
					}
					definitionBody.body = body;
					expression.key = iden;
					expression.value = definitionBody;
				} else {
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
						//Log.d(JSON.parse(JSON.stringify(subTokens)));
						var decs = findVariableDeclarator(subTokens);
						//Log.d(decs);
						for (var d of decs) {
							expression.addDeclaration(d);
						}
					}
				}

				block.addToBody(expression);

				continue;
			} else if (isThreadDeclaration(tokens, i)) {
				expression = new ThreadDeclaration();
				var id = new Identifier();
				var body = new BlockStatement();
				var funcThread = false;
				if (tokens[i + 1].value === '{') { // nameless thread
					//id.name = "THREAD_" + i;
					id.name = "THREAD_" + Date.now();
				} else if (tokens[i + 1].type === 'label') { // find the name and opt. params
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
				} else if (tokens[i + 1].type === 'function') { // thread gets body from function declaration
					funcThread = true;
					//expression = new ThreadDeclaration();
					var idx = findBlockIndexes(tokens, i + 1, 'function');
					var callTokens = tokens.slice(idx.start, idx.end + 1);
					//Log.d(callTokens);
					body = getSingleExpression(callTokens);
					i += callTokens.length;
				}
				if (!funcThread) {
					expression.id = id;
					var indexes = findBlockIndexes(tokens, i, 'braceLeft');
					var subTokens = tokens.slice(indexes.start + 1, indexes.end);
					if (subTokens.length) {
						getExpressions(body, subTokens);
					}
					i += subTokens.length + 2;
				}
				expression.body = body;
				block.addToBody(expression);

				continue;
			} else if (isExpressionStatement(tokens, i)) { // generic line
				var range = findDeclarationRange(tokens, i);

				var subTokens = tokens.slice(range[0], range[1]);
				expression = new ExpressionStatement();
				expression.expression = getSingleExpression(subTokens);
				block.addToBody(expression);

				i += subTokens.length;
				continue;
			} else if (isBuiltinMethod(tokens, i)) {
				var expression = new BuiltinMethod();
				expression.callee = tokens[i].value;
				var indexes = findBlockIndexes(tokens, i, 'builtin');
				var subTokens = tokens.slice(indexes.start + 1, indexes.end);
				/*for (var j = 0; j < subTokens.length; j++) {
					expression.addArgument(getSingleExpression([subTokens[j]]));
				}*/
				// add args split by comma tokens
				var start = 0, end = 0;
				var subsub = [];
				for (var j = 0; j < subTokens.length; j++) {
					//Log.d(TAG, subTokens[j]);
					if (subTokens[j].type === 'comma') {
						end = j;
						subsub = subTokens.slice(start, end);
						expression.addArgument(getSingleExpression(subsub));
						start = j + 1;
					}
				}
				subsub = subTokens.slice(start, subTokens.length);
				if (subsub.length)
					expression.addArgument(getSingleExpression(subsub));
				i += subTokens.length + 2;
				block.addToBody(expression);
				continue;
			} else if (isFunctionDefinition(tokens, i)) {
				var expression = new FunctionExpression();
				var body = new BlockStatement();
				var iden = new Identifier();
				iden.name = tokens[i + 1].value;

				var indexes = findBlockIndexes(tokens, i, 'function');
				var paramTokens = tokens.slice(indexes.start + 1, indexes.end);
				iden.name = tokens[indexes.start].value + "_";
				i += paramTokens.length + 2;
				indexes = findBlockIndexes(tokens, i, 'braceLeft');
				var subTokens = tokens.slice(indexes.start + 1, indexes.end);
				i += subTokens.length + 2;
				
				var len = 0;
				// find params
				if (paramTokens.length >= 2) {
					var start = 0, end = 0;
					var subsub = [];
					for (var j = 0; j < paramTokens.length; j++) {
						//Log.d(TAG, subTokens[j]);
						if (paramTokens[j].type === 'comma') {
							end = j;
							subsub = paramTokens.slice(start, end);
							if (subsub.length > 1) {
								var param = new VariableDeclaration();
								param.kind = subsub[0].value;
								param.addDeclaration(findVariableDeclarator([subsub[1]])[0]);
								expression.addParam(param);
								//iden.name += param.kind[0];
							}
							start = j + 1;
							len++;
						}
					}
					subsub = paramTokens.slice(start, paramTokens.length);
					var param = new VariableDeclaration();
					param.kind = subsub[0].value;
					param.addDeclaration(findVariableDeclarator([subsub[1]])[0]);
					expression.addParam(param);
					len++;
					//iden.name += param.kind[0];
				}
				iden.name += ""+len;
				// find body
				if (subTokens.length) {
					getExpressions(body, subTokens);
				}
				expression.id = iden;
				expression.body = body;
				block.addToBody(expression);
				continue;
			} else if (isCallExpression(tokens, i)) {
				var indexes = findBlockIndexes(tokens, i, 'function');
				var subTokens = tokens.slice(indexes.start, indexes.end + 1);
				//Log.d(TAG, subTokens)
				block.addToBody(getSingleExpression(subTokens));
				i += subTokens.length;
				continue;
			} else if (isControlFlow(tokens, i)) {
				// match for if, while, for

				var expression;
				var testTokens;
				var cfBodyTokens, cfAlternateTokens;
				var cfBody = new BlockStatement();

				switch (tokens[i].value) {
					case 'if':
						expression = new IFStatement();
						break;
					case 'while':
						expression = new WhileStatement();
						break;
					case 'for':
						expression = new ForStatement();
						break;
				}
				i++;
				// find the tokens inside the test section ()
				if (tokens[i].type === 'parenLeft') {
					var indexes = findBlockIndexes(tokens, i, 'parenLeft');
					testTokens = tokens.slice(indexes.start + 1, indexes.end);
					//Log.d(TAG, testTokens);
					if (!(expression instanceof ForStatement)) {
						//Log.d(TAG, testTokens);
						expression.test = getSingleExpression(testTokens);
					} else {
						//separate into 3 sections for(;;){}
						//Log.d(TAG + "1", testTokens);
						var declaratorTokens = testTokens.slice(0, findDeclarationRange(testTokens, 0)[1]);
						var subTokens = testTokens.slice(declaratorTokens.length + 1, findDeclarationRange(testTokens, declaratorTokens.length + 1)[1]);
						var updateTokens = testTokens.slice(declaratorTokens.length + subTokens.length + 2);
						
						// first section
						if (declaratorTokens[0].type === 'primitiveType' || declaratorTokens[0].type === 'objectType') {
							var declarator = new VariableDeclaration();
							declarator.kind = declaratorTokens[0].value;
							declaratorTokens.shift();
							if (declaratorTokens.length) {
								var decs = findVariableDeclarator(declaratorTokens);
								for (var d of decs) {
									declarator.addDeclaration(d);
								}
							}
							expression.init = declarator;
						} else {
							var stmt = new ExpressionStatement();
							stmt.expression = getSingleExpression(declaratorTokens);
							expression.init = stmt;
						}

						// second section
						expression.test = getSingleExpression(subTokens);
						// third
						expression.update = getSingleExpression(updateTokens);

					}
				} else {
					throw "Expected ( at " + JSON.stringify(tokens[i].pos) + ", found " + tokens[i].value;
				}

				i += testTokens.length + 2;
				// find tokens inside the body {}
				if (tokens[i].type === 'braceLeft') {
					var indexes = findBlockIndexes(tokens, i, 'braceLeft');
					cfBodyTokens = tokens.slice(indexes.start + 1, indexes.end);
					//Log.d(TAG, cfBodyTokens);
					if (cfBodyTokens.length) getExpressions(cfBody, cfBodyTokens);
				} else {
					throw "Expected { at " + JSON.stringify(tokens[i].pos) + ", found " + tokens[i].value;
				}
				i += cfBodyTokens.length + 2;

				if (expression instanceof IFStatement) {
					expression.consequent = cfBody;
				} else {
					expression.body = cfBody;
				}

				// if IFStatement, check for an else
				if (expression instanceof IFStatement && tokens[i] && tokens[i].value === 'else') {
					var resAlt = getControlFlowAlternate(tokens.slice(i));
					expression.alternate = resAlt.body;
					i += resAlt.length;
				}

				block.addToBody(expression);
				continue;
			} else if (isClassDeclaration(tokens, i)) {
				var expression = new ClassDeclaration();
				var id = new Identifier();
				var body = new ClassBody();

				id.name = tokens[i + 1].value;
				expression.id = id;

				if (tokens[i + 2].value === 'extends') {
					if (tokens[i + 3].type !== 'objectType') throw "Expected Identifier, found " + tokens[i + 3].value;
					var iden = new Identifier();
					iden.name = tokens[i + 3].value;
					expression.superClass = iden;
				}
				var indexes = findBlockIndexes(tokens, i, 'braceLeft');
				var subTokens = tokens.slice(indexes.start + 1, indexes.end);
				if (subTokens.length) {
					getExpressions(body, subTokens);
				}
				expression.body = body;
				i += subTokens.length + 2;
				block.addToBody(expression);
				continue;
			} else if (isAtomicExpression(tokens, i)) {
				var expression = new BlockStatement();
				expression.atomic = true;
				var indexes = findBlockIndexes(tokens, i, 'braceLeft');
				var subTokens = tokens.slice(indexes.start + 1, indexes.end);
				if (subTokens.length) {
					getExpressions(expression, subTokens);
				}
				block.addToBody(expression);
				i += subTokens.length + 2 + 1;
				continue;
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
			lit.raw = (typeof tokens[0].value === 'number' ? tokens[0].value : '"'+tokens[0].value+'"');
			var vstr = ''+tokens[0].value;
			if (/^\d+$/.test(vstr) && !vstr.includes('.')) lit.valueType = "int";
			else if (/^\d+$/.test(vstr)) lit.valueType = "double";
			else if (/^.$/.test(vstr)) lit.valueType = "char";
			else if (/^(?:true|false)$/.test(vstr)) lit.valueType = "boolean";
			else if (/^.+$/.test(vstr)) lit.valueType = "string";
			return lit;
		} else if (isIdentifier(tokens)) {
			var id = new Identifier();
			id.name = tokens[0].value;
			return id;
		} else if (isNewExpression(tokens)) { // new x()
			var ce = new CallExpression();
			var name = tokens[1].value;
			ce.callee = name;
			ce.isConstructor = true;
			// find params
			var indexes = findBlockIndexes(tokens, 0, 'function');
			var paramTokens = tokens.slice(indexes.start + 1, indexes.end);
			var len = 0;
			if (paramTokens.length) {
				var start = 0, end = 0;
				var subsub = [];
				for (var j = 0; j < paramTokens.length; j++) {
					if (paramTokens[j].type === 'comma') {
						end = j;
						subsub = paramTokens.slice(start, end);
						ce.addArgument(getSingleExpression(subsub));
						start = j + 1;
						len++;
					}
				}
				subsub = paramTokens.slice(start, paramTokens.length);
				ce.addArgument(getSingleExpression(subsub));
				len++;
			}
			ce.callee += "_"+len;
			return ce;
		} else if (isAssignmentExpression(tokens)) { // a = 1, a += 1
			var asn = new AssignmentExpression();
			asn.operator = tokens[1].value;
			asn.left = getSingleExpression([tokens[0]]);
			var subTokens = tokens.splice(2, tokens.length);
			//Log.d(subTokens);
			asn.right = getSingleExpression(subTokens);
			return asn;
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
		} else if (isMemberExpression(tokens)) {
			//Log.d(tokens);
			var dot = 1; // last dot
			for (var i = 0; i < tokens.length; i++) {
				if (tokens[i].type === 'dot') dot = i;
			}
			var left = tokens.slice(0, dot);
			var right = tokens.slice(dot + 1);
			//Log.d("L", left);
			//Log.d("R", right);
			var me = new MemberExpression();
			me.object = getSingleExpression(left);
			me.property = getSingleExpression(right);

			return me;
		} else if (isArrayExpression(tokens)) {
			var ae = new ArrayExpression();
			var indexes = findBlockIndexes(tokens, 0, 'braceLeft');
			var subTokens = tokens.slice(indexes.start + 1, indexes.end);
			var start = 0, end = 0;
			var subsub = [];
			for (var j = 0; j < subTokens.length; j++) {
				if (subTokens[j].type === 'comma') {
					end = j;
					subsub = subTokens.slice(start, end);
					//Log.d(TAG, subsub);
					ae.addElement(getSingleExpression(subsub));
					start = j + 1;
				}
			}
			subsub = subTokens.slice(start, subTokens.length);
			ae.addElement(getSingleExpression(subsub));
			return ae;
		} else if (isUnaryExpression(tokens)) {
			return getUnaryExpression(tokens);
		} else if (isBinaryExpression(tokens) && !isCallExpression(tokens)) { // a + 1, must be after assignmentExpression
			var bex = getBinaryExpression(tokens);
			return bex;
		} else if (isBuiltinMethod(tokens, 0)) {
			var expression = new BuiltinMethod();
			expression.callee = tokens[0].value;
			var indexes = findBlockIndexes(tokens, 0, 'builtin');
			var subTokens = tokens.slice(indexes.start + 1, indexes.end);
			//Log.d(subTokens);
			// add args split by comma tokens
			var start = 0, end = 0;
			var subsub = [];
			for (var j = 0; j < subTokens.length; j++) {
				//Log.d(TAG, subTokens[j]);
				if (subTokens[j].type === 'comma') {
					end = j;
					subsub = subTokens.slice(start, end);
					expression.addArgument(getSingleExpression(subsub));
					start = j + 1;
				}
			}
			subsub = subTokens.slice(start, subTokens.length);
			if (subsub.length)
				expression.addArgument(getSingleExpression(subsub));
			return expression;
		} else if (isCallExpression(tokens)) {
			var ce = new CallExpression();
			var name = tokens[0].value;
			ce.callee = name;
			// find params
			var indexes = findBlockIndexes(tokens, 0, 'function');
			var paramTokens = tokens.slice(indexes.start + 1, indexes.end);
			var len = 0;
			if (paramTokens.length) {
				var start = 0, end = 0;
				var subsub = [];
				for (var j = 0; j < paramTokens.length; j++) {
					if (paramTokens[j].type === 'comma') {
						end = j;
						subsub = paramTokens.slice(start, end);
						ce.addArgument(getSingleExpression(subsub));
						start = j + 1;
						len++;
					}
				}
				subsub = paramTokens.slice(start, paramTokens.length);
				ce.addArgument(getSingleExpression(subsub));
				len++;
			}
			ce.callee += "_"+len;
			return ce;
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
	function getUnaryExpression(tokens) {
		var uex = new UnaryExpression();
		uex.operator = tokens[0].value;
		uex.argument = getSingleExpression(tokens.slice(1));
		return uex;
	}
	function getControlFlowAlternate(tokens) {
		var i = 1;
		var tokLen = 0;
		var body;
		if (tokens[i].type === 'braceLeft') { // } else {
			body = new BlockStatement();
			var indexes = findBlockIndexes(tokens, i, 'braceLeft');
			var subTokens = tokens.slice(indexes.start + 1, indexes.end);
			if (subTokens.length) {
				getExpressions(body, subTokens);
			}
			tokLen += subTokens.length + 2;
		} else { // } else if () {
			i++;
			body = new IFStatement();
			var testTokens, ifBodyTokens;
			var ifBody = new BlockStatement();
			// find the tokens inside the test section ()
			if (tokens[i].type === 'parenLeft') {
				var indexes = findBlockIndexes(tokens, i, 'parenLeft');
				testTokens = tokens.slice(indexes.start + 1, indexes.end);
				//Log.d(TAG, testTokens);
				body.test = getSingleExpression(testTokens);
			} else {
				throw "Expected ( at " + JSON.stringify(tokens[i].pos) + ", found " + tokens[i].value;
			}
			i += testTokens.length + 2;
			// find tokens inside the body {}
			if (tokens[i].type === 'braceLeft') {
				var indexes = findBlockIndexes(tokens, i, 'braceLeft');
				ifBodyTokens = tokens.slice(indexes.start + 1, indexes.end);
				//Log.d(TAG, ifBodyTokens);
				if (ifBodyTokens.length) getExpressions(ifBody, ifBodyTokens);
			} else {
				throw "Expected { at " + JSON.stringify(tokens[i].pos) + ", found " + tokens[i].value;
			}
			i += ifBodyTokens.length + 2;
			body.consequent = ifBody;
			if (tokens[i] && tokens[i].value === 'else') {
				var resAlt = getControlFlowAlternate(tokens.split(i));
				body.alternate = resAlt.body;
				tokLen += resAlt.length;
			}
		}
		tokLen += i;
		return {
			body: body,
			length: tokLen,
		};
	}
	function findVariableDeclarator(tokens) {
		var i = 0;
		var x = tokens.length;
		var decs = [];
		while (i < x && tokens.length > 0) {
			//Log.w(TAG, tokens);
			if (isVariableDeclarator(tokens)) {
				var decl = new VariableDeclarator();
				var leftIdent = new Identifier();
				leftIdent.name = tokens[0].value;
				decl.id = leftIdent;
				var cind = findCommaIndex(tokens);
				if (tokens[1] !== undefined && tokens[1].value === '=') {
					var init = getSingleExpression(tokens.slice(2, cind));
					//Log.d(tokens.slice(2, cind));
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
	function isFunctionDefinition(tokens, i) {
		return tokens[i].type === 'functionDeclaration';
	}
	function isCommentBlock(tokens, i) {
		return tokens[i].type === 'commentStart';
	}
	function isControlFlow(tokens, i) {
		return ['controlflow'].includes(tokens[i].type);
	}
	function isLiteral(tokens) {
		return tokens.length === 1 && ['valueInteger', 'valueChar', 'valueString', 'valueBool'].includes(tokens[0].type);
	}
	function isMemberExpression(tokens, i) {
		//return tokens.length === 1 && tokens[i || 0].value.indexOf('.') > -1;
		return tokens.reduce((a, t) => a || t.type === 'dot', false);
	}
	function isNewExpression(tokens) {
		return tokens.length >= 2
			&& tokens[0].type === 'new'
			&& tokens[1].type === 'function';
	}
	function isCallExpression(tokens, i) {
		return tokens.length >= 1
			&& tokens[i || 0].type === 'function';
	}
	function isArrayExpression(tokens) {
		return tokens[0].type === 'braceLeft'
			&& tokens.reduce((a, t) => a || t.type === 'comma', false);
	}
	function isBinaryExpression(tokens) {
		Log.d(TAG, tokens);
		return tokens.length >= 3
			&& tokens.reduce((a, t) => {
				return a || isOperator(t);
			}, false);
	}
	function isUnaryExpression(tokens) {
		return tokens.length >= 2
			&& isUnary(tokens[0]);
			/*&& tokens.reduce((a, t) => {
				return a || isUnary(t);
			}, false);*/
	}
	function isOperator(token) {
		return ['+','-','*','/','%','^','&','|','&&','||','==','!=','>','<','>=','<=','>>','<<'].includes(token.value);
	}
	function isUnary(token) {
		return ['!','~'].includes(token.value);
	}
	function isIdentifier(tokens) {
		return tokens.length === 1 && ['variableName'].includes(tokens[0].type);
	}
	function isExpressionStatement(tokens, i) {
		return ['variableName','function'].includes(tokens[i].type) || ['++','--'].includes(tokens[i].value);
	}
	function isAssignmentExpression(tokens) {
		return tokens[1] !== undefined && ['=','+=','-=','*=','/=','&=','|=','^=','>>=','<<='].includes(tokens[1].value);
	}
	function isUpdateExpression(tokens) {
		var tok;
		if (tokens[1] === undefined) return false;
		if (tokens[0].type === 'operatorShorthand') tok = tokens[0];
		else tok = tokens[1];
		return ['++','--'].includes(tok.value);
	}
	function isClassDeclaration(tokens, i) {
		return tokens[i].type === 'class' && tokens[i + 1].type === 'objectType';
	}
	function isAtomicExpression(tokens, i) {
		return tokens[i].type === 'atomic';
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
		var balanceBrace = 0;
		while (i < tokens.length) {
			if (tokens[i].type === 'braceLeft') balanceBrace++;
			if (tokens[i].type === 'braceRight') balanceBrace--;
			if (tokens[i].type === 'comma' && balanceBrace == 0) break;
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
	function isClassMethodDeclaration(tokens, i) {
		// return false;
		// public static int x( )
		var check = tokens.slice(i, i + 4);
		return check.reduce((a, t) => a || t.type === 'function', false);
	}
	function isClassConstructorDeclaration(tokens, i) {
		return tokens[i].value === 'public' && tokens[i + 1].type === 'function';
	}
	function isVariableDeclarator(tokens) {
		//Log.d(tokens);
		if (['variableName', 'braceLeft'/*, 'bracketLeft', 'bracketRight'*/, 'new', 'objectType'].includes(tokens[0].type)/* && tokens[1] !== undefined && tokens[1].value === '='*/) { // x = ...
			return true;
		}
		//Log.d(tokens[0]);
		//if (tokens[0].type === 'new' && tokens[1].type === 'objectType') return true;
		return false;
	}
	function isThreadDeclaration(tokens, i) {
		return tokens[i].type === 'thread';
	}
}
export default ASTBuilder;