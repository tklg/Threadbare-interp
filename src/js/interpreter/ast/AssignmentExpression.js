import AbstractElement from './AbstractElement.js';

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
}
export default AssignmentExpression;