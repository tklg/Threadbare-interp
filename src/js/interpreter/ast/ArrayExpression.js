import AbstractElement from './AbstractElement.js';

// {1, 2, 3}
class ArrayExpression extends AbstractElement {
	constructor() {
		super();
		this._type = "ArrayExpression";
		this._elements = [];
	}
	get elements() {
		return this._elements;
	}
	addElement(el) {
		this._elements.push(el);
	}
	step() {
		
	}
	isDone() {
		return true;
	}
	eval() {
		return this;
	}
}
export default ArrayExpression;