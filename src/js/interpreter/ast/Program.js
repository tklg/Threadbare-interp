import AbstractElement from './AbstractElement.js';

// Program is similar to BlockStatement
class Program extends AbstractElement {
	constructor(env) {
		super(env);
		this._type = "Program";
		this._body = [];
		this._stepIndex = 0;
	}
	get body() {
		return this._body;
	}
	addToBody(expr) {
		this._body.push(expr);
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
export default Program;