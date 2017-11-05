import AbstractElement from './AbstractElement.js';
import ClassManager from './class/ClassManager.js';

// x();
class CallExpression extends AbstractElement {
	constructor() {
		super();
		this._type = "CallExpression";
		// evaluates to Identifier
		this._callee;
		this._arguments = [];
		this._argsIndex = 0;
		this._hasRun = false;
		this._isConstructor = false;
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
	get isConstructor() {
		return this._isConstructor;
	}
	set isConstructor(b) {
		this._isConstructor = b;
	}
	set environment(env) {
		super.environment = env;
		for (var i of this._arguments) {
			i.environment = env;
		}
	}
	eval() {
		return this._callee;
	}
	step() {
		const man = ClassManager.getInstance();
		this._argsIndex++;
		this._hasRun = true;
	}
	isDone() {
		return this._argsIndex === this._arguments.length && this._hasRun;
	}
}
export default CallExpression;