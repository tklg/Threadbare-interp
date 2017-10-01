import AbstractElement from './AbstractElement.js';

// while (test) { body }
class WhileStatement extends AbstractElement {
	constructor() {
		super();
		this._type = "WhileStatement";
		// BinaryExpression
		this._test;
		// BlockStatement
		this._body;
	}
	get test() {
		return this._test;
	}
	set test(test) {
		this._test = test;
	}
	get body() {
		return this._body;
	}
	set body(body) {
		this._body = body;
	}
}
export default WhileStatement;