import Log from './../logger/Log.js';

import TypeModifierToken from './token/TypeModifierToken.js';
import PrimitiveToken from './token/PrimitiveToken.js';
import ObjectToken from './token/ObjectToken.js';
import VarNameToken from './token/VarNameToken.js';
import OpToken from './token/OpToken.js';
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
import CommentStartToken from './token/CommentStartToken.js';
import CommentEndToken from './token/CommentEndToken.js';
import FunctionToken from './token/FunctionToken.js';
import FunctionDecToken from './token/FunctionDecToken.js';
import ControlFlowToken from './token/ControlFlowToken.js';
import ClassToken from './token/ClassToken.js';
import NewClassToken from './token/NewClassToken.js';

const tokenRegex = {
	typeModifier: /^\s*(global|static|final|public|private|protected|atomic)/,
	class: /^\s*(class|extends)/,
	new: /^\s*(new)/,
	primitiveType: /^\s*(char|short|int|float|double|long|boolean)/,
	objectType: /^\s*([A-Z][a-zA-Z0-9_]+)/,
	variableName: /^\s*([a-z\$_][a-z0-9\$_\.]*)/i,
	operatorShorthand: /^\s*(\+\+|--|\+=|-=|\*=|\/=|%=|\^=|\|=|&=|>>=|<<=)/,
	operator: /^\s*(\+|-|\*|\/|%|==|!=|>>|<<|>=|<=|>|<|=|!|~)/,
	valueInteger: /^\s*(\d+)/,
	valueChar: /^\s*'(.)'/,
	valueString: /^\s*"(.+?)"/,
	valueBool: /^\s*(true|false)/,
	comma: /^\s*(,)/,
	semicolon: /^\s*(;)/,
	controlflow: /^\s*(while|for|if)/, // while ()
	controlflowNoCond: /^\s*(do|else)/, // do
	thread: /^\s*(thread)/,
	functionDeclaration: /^\s*(function)/,
	//atomic: /^\s*(atomic)\s*/,
	label: /^\s*([a-z\$_][a-z0-9\$_]*):/i,
	builtin: /^\s*(print|error|sleep) *\(/, // func(
	function: /^\s*([a-z\$_][a-z0-9\$_]*) *\(/i, // func(
	paramLabel: /^\s*((?:[a-z\$_][a-z0-9\$_]*)\s*\([a-z\$_][a-z0-9\$_, ]*\)):/i,
	braceLeft: /^\s*({)/,
	braceRight: /^\s*(})/,
	parenLeft: /^\s*(\()/,
	parenRight: /^\s*(\))/,
	bracketLeft: /^\s*(\[)/,
	bracketRight: /^\s*(\])/,
	commentStart: /^\s*(\/\*|\/\/)/,
	commentEnd: /^\s*(\*\/|\n)/,
};
const matchOrder = [
	'commentStart',
	'commentEnd',
	'typeModifier',
	'class',
	'new',
	'label',
	'paramLabel',
	'controlflow',
	'controlflowNoCond',
	'builtin',
	'function',
	'thread',
	'functionDeclaration',
	//'atomic',
	'operatorShorthand',
	'primitiveType',
	'objectType',
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
	'valueBool',
	'valueInteger',
	'variableName',
];

function Tokenizer(_str) {
	const TAG = "Tokenizer";
	var str = _str;
	var workingStr = str;
	var parsedStr = '';
	var linesArr = _str.split('\n')/*.map(ln => ln + '\n')*/;
	//Log.d("LNS", JSON.parse(JSON.stringify(linesArr)));
	var lineNo = 1;
	var index = 0;
	var tokens = [];
	var startedComment, commentType;

	this.parse = function() {
		return new Promise((resolve, reject) => {
			while (linesArr.length) {
				try {
					startedComment = false;
					matchLineToTokens(linesArr.shift(), lineNo++);
					if (startedComment && commentType === 'line') tokens.push(new CommentEndToken('commentEnd', '\n', {row: lineNo - 1, col: parsedStr.length, char: index}));
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
		//Log.d(workingStr);
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
				if (matched instanceof CommentStartToken) {
					startedComment = true;
					if (matched.value === '//') commentType = 'line';
					else commentType = 'block';
				}
				if (matched instanceof CommentEndToken) startedComment = false;
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
		//case 'commentLine': return new CommentLineToken(name, match, pos);
		case 'commentStart': return new CommentStartToken(name, match, pos);
		case 'commentEnd': return new CommentEndToken(name, match, pos);
		case 'typeModifier': return new TypeModifierToken(name, match, pos);
		case 'primitiveType': return new PrimitiveToken(name, match, pos);
		case 'objectType': return new ObjectToken(name, match, pos);
		case 'variableName': return new VarNameToken(name, match, pos);
		case 'operator': 
		case 'operatorShorthand':
			//return TokenUtil.getOperatorToken(name, match, pos);
			return new OpToken(name, match, pos);
		case 'valueInteger': return new ValueToken(name, parseInt(match), pos);
		case 'valueBool': return new ValueToken(name, match === 'true', pos);
		case 'valueChar':
		case 'valueString': return new ValueToken(name, match, pos);
		case 'comma': return new ComToken(name, match, pos);
		case 'semicolon': return new SemToken(name, match, pos);
		case 'thread': return new ThreadToken(name, match, pos);
		case 'functionDeclaration': return new FunctionDecToken(name, match, pos);
		case 'function': return new FunctionToken(name, match, pos);
		case 'label': return new LabelToken(name, match, pos);
		case 'paramLabel': return new ParamLabelToken(name, match, pos);
		case 'braceLeft': return new BraceLeftToken(name, match, pos);
		case 'braceRight': return new BraceRightToken(name, match, pos);
		case 'parenLeft': return new ParenLeftToken(name, match, pos);
		case 'parenRight': return new ParenRightToken(name, match, pos);
		case 'bracketLeft': return new BracketLeftToken(name, match, pos);
		case 'bracketRight': return new BracketRightToken(name, match, pos);
		case 'builtin': return new FunctionToken(name, match, pos);
		case 'controlflow':
		case 'controlflowNoCond': return new ControlFlowToken(name, match, pos);
		case 'class': return new ClassToken(name, match, pos);
		case 'new': return new NewClassToken(name, match, pos);
		default: throw "Invalid token type: " + name;
	}
}
export default Tokenizer;