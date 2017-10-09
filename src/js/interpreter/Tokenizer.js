import Log from './../logger/Log.js';

import TypeModifierGlobalToken from './token/TypeModifierGlobalToken.js';
import PrimitiveIntToken from './token/PrimitiveIntToken.js';
import VarNameToken from './token/VarNameToken.js';
import OpAdditionToken from './token/OpAdditionToken.js';
import OpToken from './token/OpToken.js';
import OpAssignmentToken from './token/OpAssignmentToken.js';
import OpEqualityToken from './token/OpEqualityToken.js';
import ValueToken from './token/ValueToken.js';
import ComToken from './token/ComToken.js';
import SemToken from './token/SemToken.js';
import ThreadToken from './token/ThreadToken.js';
import LabelToken from './token/LabelToken.js';
import ParamLabelToken from './token/ParamLabelToken.js';
import BraceLeftToken from './token/BraceLeftToken.js';
import BraceRightToken from './token/BraceRightToken.js';
import ParenLeftToken from './token/ParenLeftToken.js';
import ParenRightToken from './token/ParenRightToken.js';
import BracketLeftToken from './token/BracketLeftToken.js';
import BracketRightToken from './token/BracketRightToken.js';
import CommentLineToken from './token/CommentLineToken.js';
import CommentStartToken from './token/CommentStartToken.js';
import CommentEndToken from './token/CommentEndToken.js';

const tokenRegex = {
	typeModifier: /^\s*(global|static|final|public|private|protected)\s*/,
	keyword: /^\s*(new|class)\s*/,
	primitiveType: /^\s*(char|short|int|float|double|long)\s*/,
	builtin: /^\s*(print|sleep)\s*/,
	objectType: /^\s*([A-Z][a-zA-Z_]+[a-zA-Z0-9_]*)\s*/,
	variableName: /^\s*([a-z\$_]+[a-z0-9\$_\.]*)\s*/i,
	operatorShorthand: /^\s*(\+\+|--|\+=|-=|\*=|\/=|%=|\^=|\|=|&=)\s*/,
	operator: /^\s*(\+|-|\*|\/|%|=|==|!=)\s*/,
	valueInteger: /^\s*(\d+)\s*/,
	valueChar: /^\s*'(.)'\s*/,
	valueString: /^\s*"(.+)"\s*/,
	comma: /^\s*(,)\s*/,
	semicolon: /^\s*(;)\s*/,
	thread: /^\s*(thread)\s*/,
	function: /^\s*(function)\s*/,
	atomic: /^\s*(atomic)\s*/,
	label: /^\s*([a-z\$_]+[a-z0-9\$_]*):\s*/i,
	paramLabel: /^\s*((?:[a-z\$_]+[a-z0-9\$_]*)\s*\([a-z\$_]+[a-z0-9\$_, ]*\)):\s*/i,
	braceLeft: /^\s*({)\s*/,
	braceRight: /^\s*(})\s*/,
	functionCall: /^\s*([a-z\$_]+[a-z0-9\$_]*) *\(\s*/, // func(
	parenLeft: /^\s*(\()\s*/,
	parenRight: /^\s*(\))\s*/,
	bracketLeft: /^\s*(\[)\s*/,
	bracketRight: /^\s*(\])\s*/,
	commentLine: /^\/\//,
	commentStart: /^\s*\/\*\s*/,
	commentEnd: /^\s*\*\/\s*/,
};
const matchOrder = [
	//'commentLine',
	'commentStart',
	'commentEnd',
	'typeModifier',
	'keyword',
	'primitiveType',
	'objectType',
	'functionCall',
	'thread',
	'function',
	'atomic',
	'paramLabel',
	'label',
	'operatorShorthand',
	'operator',
	'comma',
	'semicolon',
	'braceLeft',
	'braceRight',
	'parenLeft',
	'parenRight',
	'bracketLeft',
	'bracketRight',
	'valueChar',
	'valueString',
	'variableName',
	'valueInteger',
];

function Tokenizer(_str) {
	const TAG = "Tokenizer";
	var str = _str;
	var workingStr = str;
	var parsedStr = '';
	var linesArr = _str.split('\n');
	var lineNo = 1;
	var index = 0;
	var tokens = [];

	this.parse = function() {
		return new Promise((resolve, reject) => {
			while (linesArr.length) {
				try {
					matchLineToTokens(linesArr.shift(), lineNo++);
				} catch (e) {
					reject(e);
				}
			}
			resolve(tokens);
		});
	}
	this.getStr = function() {
		return str;
	}
	this.getWorkingStr = function() {
		return workingStr;
	}
	function matchLineToTokens(lineStr, lineNo) {
		workingStr = lineStr;
		parsedStr = '';
		while (workingStr.length) {
			matchStrToToken(lineNo);
		}
	}
	function matchStrToToken(line) {
		var matched;
		for (var i = 0; i < matchOrder.length; i++) {
			if (tokenRegex[matchOrder[i]].test(workingStr)) {
				var c = (parsedStr.match(/(\n|^).+$/) || []);
				var col = (c[0] ? c[0].length : 0) + 1;
				var match = tokenRegex[matchOrder[i]].exec(workingStr);
				
				index += match[0].length;
				parsedStr += workingStr.substr(0, match[0].length);
				workingStr = workingStr.substr(match[0].length);
				matched = TokenUtil.getFromNameAndMatch(matchOrder[i], match[1], {
					row: line,
					col: col,
					char: index,
				});
				break;
			}
		}
		if (match === undefined) {
			throw `Could not match to any token type on line ${line}`;
		} else {
			tokens.push(matched);
		}
	}
}

function TokenUtil() {}
TokenUtil.getFromNameAndMatch = function(name, match, pos) {
	switch (name) {
		case 'commentLine': return new CommentLineToken(name, match, pos);
		case 'commentStart': return new CommentStartToken(name, match, pos);
		case 'commentEnd': return new CommentEndToken(name, match, pos);
		case 'typeModifier': return TokenUtil.getTypeModifierToken(name, match, pos);
		case 'primitiveType': return TokenUtil.getPrimitiveTypeToken(name, match, pos);
		case 'variableName': return new VarNameToken(name, match, pos);
		case 'operator': 
		case 'operatorShorthand':
			//return TokenUtil.getOperatorToken(name, match, pos);
			return new OpToken(name, match, pos);
		case 'valueInteger': return new ValueToken(name, parseInt(match), pos);
		case 'comma': return new ComToken(name, match, pos);
		case 'semicolon': return new SemToken(name, match, pos);
		case 'thread': return new ThreadToken(name, match, pos);
		case 'label': return new LabelToken(name, match, pos);
		case 'paramLabel': return new ParamLabelToken(name, match, pos);
		case 'braceLeft': return new BraceLeftToken(name, match, pos);
		case 'braceRight': return new BraceRightToken(name, match, pos);
		case 'parenLeft': return new ParenLeftToken(name, match, pos);
		case 'parenRight': return new ParenRightToken(name, match, pos);
		case 'bracketLeft': return new BracketLeftToken(name, match, pos);
		case 'bracketRight': return new BracketRightToken(name, match, pos);
		default: throw "Invalid token type: " + name;
	}
}
TokenUtil.getTypeModifierToken = function(name, match, pos) {
	switch(match) {
		case 'global': return new TypeModifierGlobalToken(name, match, pos);
		default: throw "Invalid type modifier: " + match;
	}
}
TokenUtil.getPrimitiveTypeToken = function(name, match, pos) {
	switch(match) {
		case 'int': return new PrimitiveIntToken(name, match, pos);
		default: throw "Invalid primitive type: " + match;
	}
}
TokenUtil.getOperatorToken = function(name, match, pos) {
	switch (match) {
		case '+': return new OpAdditionToken(name, match, pos);
		case '=': return new OpAssignmentToken(name, match, pos);
		case '==': return new OpEqualityToken(name, match, pos);
		default: throw "Invalid operator: " + match;
	}
}

export default Tokenizer;