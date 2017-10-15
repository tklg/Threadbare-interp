import AbstractElement from './AbstractElement.js';

// { }
class BlockStatement extends AbstractElement {
	constructor() {
		super();
		this._type = "BlockStatement";
		this._body = [];
		this._stepIndex = 0;
	}
	addToBody(expr) {
		this._body.push(expr);
	}
	get body() {
		return this._body;
	}
	step() {
		var expr = this._body[this._stepIndex];
		if (!expr.isDone()) {
			expr.step();
		} else {
			this._stepIndex++;
		}
	}
	isDone() {
		return this._stepIndex === this._body.length;
	}
}
export default BlockStatement;