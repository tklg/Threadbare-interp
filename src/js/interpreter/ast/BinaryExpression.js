import AbstractElement from './AbstractElement.js';
import Literal from './Literal.js';
import Log from './../../logger/Log.js';

const TAG = "BinaryExpression";
// x + y
class BinaryExpression extends AbstractElement {
	constructor() {
		super();
		this._type = "BinaryExpression";
		// string (+, -, *, etc)
		this._operator;
		// left, right evaluate to Literal
		this._left;
		this._right;
	}
	get operator() {
		return this._operator;
	}
	set operator(op) {
		this._operator = op;
	}
	get left() {
		return this._left;
	}
	set left(left) {
		this._left = left;
	}
	get right() {
		return this._right;
	}
	set right(right) {
		this._right = right;
	}
	set environment(env) {
		super.environment = env;
		this._left.environment = env;
		this._right.environment = env;
	}
	step() {
		var left = this._left;
		var right = this._right;
		if (!left.isDone()) {
			left.step();
			return;
		} else if (!right.isDone()) {
			right.step();
			return;
		} else {
			var n = new Literal();
			n.value = getResult(this._operator, left.eval().value, right.eval().value);
			n.valueType = this._operator === '/' ? 'double' : getType(left.valueType, right.valueType);
			this._evaluated = n;
		}
	}
	isDone() {
		return this._left.isDone() && this._right.isDone() && this._evaluated !== undefined;
	}
	eval() {
		return this._evaluated;
	}
}

function getResult(op, x, y) {
	switch (op) {
		case '+': return x + y;
		case '-': return x - y;
		case '*': return x * y;
		case '/': return x / y;
		case '%': return x % y;
		case '&': return x & y;
		case '|': return x | y;
		case '^': return x ^ y;
	}
}

function getType(t1, t2) {
	return t1;
}

export default BinaryExpression;