import AbstractElement from './AbstractElement.js';
//import EventEmitter from './../../EventEmitter.js';
import Log from './../../logger/Log.js';
import Eventify from './../../Eventify.js';

const event = Eventify.getInstance();
const TAG = "BuiltinMethod";
// print(x)
class BuiltinMethod extends AbstractElement {
	constructor() {
		super();
		this._type = 'BuiltinMethod';
		// evaluates to Identifier
		this._callee;
		this._arguments = [];
		this._argsIndex = 0;
		this._hasRun = false;
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
	set environment(env) {
		super.environment = env;
		for (var i of this._arguments) {
			i.environment = env;
		}
	}
	step() {
		if (this._argsIndex < this._arguments.length) {
			this._arguments[this._argsIndex].step();
			if (this._arguments[this._argsIndex].isDone()) {
				// set argument to evaluated Identifier
				this._arguments[this._argsIndex] = this._arguments[this._argsIndex].eval();
				this._argsIndex++;
			}
			return;
		}
		// depending on callee, do something with arguments
		switch (this._callee) {
			case 'print':
				var res = '';
				for (var s of this._arguments) {
					res += s.value;
				}
				//Log.d("STDOUT", res);
				//Log.out("stdout", res);
				event.emit('stdout', res);
				// EventEmitter.emit('print', res);
				break;
		}
		this._hasRun = true;
	}
	isDone() {
		return this._argsIndex === this._arguments.length && this._hasRun;
	}
}
export default BuiltinMethod;