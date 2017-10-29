import AbstractElement from './AbstractElement.js';
import Literal from './Literal.js';

// x += 2
class AssignmentExpression extends AbstractElement {
	constructor() {
		super();
		this._type = "AssignmentExpression";
		// string (=, +=, -=, etc)
		this._operator;
		// not a literal
		this._left;
		this._right;
		this._stepIndex = 0;
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
			if (this._stepIndex === 0) {
				this._lVal = left.eval(); // left side will be an identifier
				// or a memberexpression, but thats for later
				// lVal will be a literal from the env
				
				this._rVal = right.eval();
				this._stepIndex++;
			} else {

				var newVal = getResult(this._operator, this._lVal.value, this._rVal.value);

				var lit = new Literal();
				lit.value = newVal;
				lit.valueType = this._lVal.valueType;
				this._environment.updateEntry(left.name, lit);
				this._stepIndex++;
			}
		}
	}
	isDone() {
		return this._left.isDone() && this._right.isDone() && this._stepIndex === 2;
	}
}

function getResult(op, x, y) {
	switch(op) {
		case "=": return y;
		case "+=": return x + y;
		case "-=": return x - y;
		case "*=": return x * y;
		case "/=": return x / y;
		case "&=": return x & y;
		case "|=": return x | y;
		case "^=": return x ^ y;
		case "%=": return x % y;
		case '>>=': return x >> y;
		case '<<=': return x << y;
	}
}

export default AssignmentExpression;