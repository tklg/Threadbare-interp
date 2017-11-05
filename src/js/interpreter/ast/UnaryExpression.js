import AbstractElement from './AbstractElement.js';
import Literal from './Literal.js';
import Log from './../../logger/Log.js';

const TAG = "UnaryExpression";
// x + y
class UnaryExpression extends AbstractElement {
	constructor() {
		super();
		this._type = "UnaryExpression";
		// string (!, ~)
		this._operator;
		// argument evaluate to Literal
		this._argument;
	}
	get operator() {
		return this._operator;
	}
	set operator(op) {
		this._operator = op;
	}
	get argument() {
		return this._argument;
	}
	set argument(argument) {
		this._argument = argument;
	}
	set environment(env) {
		super.environment = env;
		this._argument.environment = env;
	}
	step() {
		var argument = this._argument;
		if (!argument.isDone()) {
			argument.step();
			return;
		} else {
			var n = new Literal();
			n.value = getResult(this._operator, argument.eval().value);
			n.valueType = argument.valueType;
			this._evaluated = n;
		}
	}
	isDone() {
		return this._argument.isDone() && this._evaluated !== undefined;
	}
	eval() {
		return this._evaluated;
	}
}

function getResult(op, x) {
	switch (op) {
		case '!': return !x;
		case '~': return ~x;
	}
}

export default UnaryExpression;