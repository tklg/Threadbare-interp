import AbstractElement from './AbstractElement.js';

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
}
export default BinaryExpression;