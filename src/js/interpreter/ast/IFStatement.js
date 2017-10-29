import AbstractElement from './AbstractElement.js';
import Log from './../../logger/Log.js';

const TAG = 'IFStatement';

// if (test) { consequent } else { alternate }
class IFStatement extends AbstractElement {
	constructor() {
		super();
		this._type = "IFStatement";
		// evaluates to literal
		this._test;
		// instance of BlockStatement
		this._consequent;
		// instance of BlockStatement or IFStatememt or null
		this._alternate = null;
		this._body = undefined;
	} 
	get test() {
		return this._test;
	}
	set test(test) {
		this._test = test;
	}
	get consequent() {
		return this._consequent;
	}
	set consequent(consequent) {
		this._consequent = consequent;
	}
	get alternate() {
		return this._alternate;
	}
	set alternate(alternate) {
		this._alternate = alternate;
	}
	set environment(env) {
		super.environment = env;
		this._test.environment = env;
		this._consequent.environment = env;
		if (this._alternate) this._alternate.environment = env;
	}
	step() {
		// evaluate the test, 
		// then enter and stay in either of conditions
		if (!this._test.isDone()) {
			this._test.step();
			return;
		} else if (!this._body) {
			var t = this._test.eval();
			if (t.value) this._body = this._consequent;
			else this._body = this._alternate;
			return;
		} else if (!this._body.isDone()) {
			this._body.step();
			return;
		}
	}
	isDone() {
		return this._body && this._body.isDone();
	}
}

export default IFStatement;