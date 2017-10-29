import AbstractElement from './AbstractElement.js';
import Log from './../../logger/Log.js';

const TAG = 'IFStatement';

// if (test) { consequent } else { alternate }
class IFStatement {
	constructor() {
		super();
		this._type = "IFStatement";
		// evaluates to literal
		this._test;
		// instance of BlockStatement
		this._consequent;
		// instance of BlockStatement or IFStatememt or null
		this._alternate = null;
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
	set consequent(left) {
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
		this._alternate.environment = env;
	}
	step() {
		// evaluate the test, 
		// then enter and stay in either of conditions
	}
	isDone() {

	}
}

export default IFStatement;