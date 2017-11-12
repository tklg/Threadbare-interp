import AbstractElement from './AbstractElement.js';
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
		return this._returnValue || this._callee;
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
				var name = this._callee.split('_')[0];
				var classDef = this._environment.getEntry(name)
				if (!classDef) throw `Class ${name} is not defined.`;
				classDef = classDef.getValue();
				this._returnValue = classDef.clone();
				//Log.d(this._returnValue);
				// find the constructor method
				var constr = this._returnValue.getConstructor(this._callee)
				if (!constr) {
					this._hasRun = true;
					return;
				}
				constr = constr.getValue();
				//Log.d('constr', this._arguments);
				// constuctor is ony run once, so dont bother cloning it
				var args = this._arguments.map(a => a.eval());
				this._body = constr.cloneBody(args, true);
			} else {
				// get body from function, inject params into its env
				var fe = this._environment.getEntry(this._callee).getValue();
				var args = this._arguments.map(a => a.eval());
				this._body = fe.cloneBody(args);
				//Log.d("cloned body");
			}
			this._hasRun = true;
			return;
		} else if (!this._body.isDone()) {
			//Log.d(this._body);
			this._body.step();
			//Log.d(this._body.isDone());
		}
	}
	isDone() {
		return this._argsIndex === this._arguments.length
			&& this._hasRun
			&& (this._body ? this._body.isDone() : true);
	}
}
export default CallExpression;