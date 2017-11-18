import AbstractElement from './AbstractElement.js';

// { }
class BlockStatement extends AbstractElement {
	constructor() {
		super();
		this._type = "BlockStatement";
		this._body = [];
		this._stepIndex = 0;
		this._atomic = false;
	}
	addToBody(expr) {
		this._body.push(expr);
	}
	get body() {
		return this._body;
	}
	set environment(env) {
		super.environment = env;
		for (var i of this._body) {
			i.environment = env;
		}
	}
	get environment() {
		return this._environment;
	}
	get hasRun() {
		return this._hasRun || false;
	}
	set atomic(a) {
		this._atomic = a;
	}
	get atomic() {
		return this._atomic;
	}
	step() {
		var expr = this._body[this._stepIndex];
		this._hasRun = true;
		if (!expr.isDone()) {
			if (this._atomic) {
				while (this._stepIndex < this._body.length) {
					expr = this._body[this._stepIndex];
					while (!expr.isDone()) expr.step();
					this._stepIndex++;
				}
			} else expr.step();
		} else {
			this._stepIndex++;
		}
	}
	isDone() {
		return this._stepIndex === this._body.length && this._hasRun;
	}
}
export default BlockStatement;