import AbstractElement from './AbstractElement.js';

// { }, but immediately inside a class
class ClassBody extends AbstractElement {
	constructor() {
		super();
		this._type = "ClassBody";
		this._body = [];
	}
	addToBody(expr) {
		this._body.push(expr);
	}
	get body() {
		return this._body;
	}
}
export default ClassBody;