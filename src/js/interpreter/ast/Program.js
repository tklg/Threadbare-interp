import AbstractElement from './AbstractElement.js';
import Log from './../../logger/Log.js';

const TAG = "Program";
// Program is similar to BlockStatement
class Program extends AbstractElement {
	constructor() {
		super();
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
	set environment(env) {
		super.environment = env;
		for (var i of this._body) {
			i.environment = env;
		}
	}
	step() {
		//Log.d(TAG, "STEP");
		var expr = this._body[this._stepIndex];
		if (!expr.isDone()) {
			expr.step();
		} else {
			this._stepIndex++;
		}
		//Log.d(this._environment);
	}
	isDone() {
		return this._stepIndex === this._body.length;
	}
}
export default Program;