import AbstractElement from './AbstractElement.js';
import ClassManager from './class/ClassManager.js';
import Log from './../../logger/Log.js';
// x();
const TAG = "CallExpression";
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
		if (this._argsIndex < this._arguments.length) {
			if (!this._arguments[this._argsIndex].isDone()) {
				this._arguments[this._argsIndex].step();
				return;
			}
			//Log.d("finished arg: " + this._argsIndex);
			this._argsIndex++;
			return;
		} else if (!this._body) {
			if (this._isConstructor) {
				Log.d("NOT DONE");
				this._argsIndex++;
			} else {
				// get body from function, inject params into its env
				var fe = this._environment.getEntry(this._callee).getValue();
				this._body = fe.cloneBody(this._arguments);
				//Log.d("cloned body");
			}
			return;
		} else if (!this._body.isDone()) {
			//Log.d(this._body);
			this._body.step();
			//Log.d(this._body.isDone());
		}
	}
	isDone() {
		return this._argsIndex === this._arguments.length
			&& (this._body ? this._body.isDone() : true);
	}
}
export default CallExpression;