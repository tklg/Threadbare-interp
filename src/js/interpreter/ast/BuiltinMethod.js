import CallExpression from './CallExpression.js';
//import EventEmitter from './../../EventEmitter.js';
import Log from './../../logger/Log.js';
import Eventify from './../../Eventify.js';

const event = Eventify.getInstance();
const TAG = "BuiltinMethod";
// print(x)
class BuiltinMethod extends CallExpression {
	constructor() {
		super();
		this._type = 'BuiltinMethod';
	}
	step() {
		if (this._argsIndex < this._arguments.length || (this._arguments[this._argsIndex] !== undefined && !this._arguments[this._argsIndex].isDone())) {
			if (!this._arguments[this._argsIndex].isDone())
				this._arguments[this._argsIndex].step();
			/*if (this._arguments[this._argsIndex].isDone()) {
				// set argument to evaluated Identifier
				this._arguments[this._argsIndex] = this._arguments[this._argsIndex].eval();
				this._argsIndex++;
			}*/
			// do not modify the actual arguments
			if (this._arguments[this._argsIndex].isDone()) {
				this._argsIndex++;
			}
			return;
		}
		// depending on callee, do something with arguments
		switch (this._callee) {
			case 'print':
				var res = '';
				for (var s of this._arguments) {
					res += s.eval().value;
				}
				//Log.d("STDOUT", res);
				//Log.out("stdout", res);
				event.emit('stdout', res);
				break;
			case 'error':
				var res = '';
				for (var s of this._arguments) {
					res += s.eval().value;
				}
				event.emit('stderr', res);
				break;
		}
		this._hasRun = true;
	}
	isDone() {
		return this._argsIndex === this._arguments.length
			&& this._hasRun;
	}
}
export default BuiltinMethod;