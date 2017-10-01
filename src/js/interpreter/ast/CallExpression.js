import AbstractElement from './AbstractElement.js';

// x();
class CallExpression extends AbstractElement {
	constructor() {
		super();
		this._type = "CallExpression";
		// evaluates to Identifier
		this._callee;
		this._arguments = [];
	}
	get callee() {
		return this._callee;
	}
	set callee(ce) {
		this._callee = ce;
	}
	get arguments() {
		return this._arguments;
	}
	addArgument(arg) {
		this._arguments.push(arg);
	}
}
export default CallExpression;