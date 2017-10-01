import AbstractElement from './AbstractElement.js';

// { }
class BlockStatement extends AbstractElement {
	constructor() {
		super();
		this._type = "BlockStatement";
		this._body = [];
	}
	addToBody(expr) {
		this._body.push(expr);
	}
	get body() {
		return this._body;
	}
}
export default BlockStatement;