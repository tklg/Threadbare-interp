import FunctionExpression from './FunctionExpression.js';
import Log from './../../logger/Log.js';
import ThreadManager from './../runner/ThreadManager.js';
import Thread from './../runner/Thread.js';
import Environment from './../environment/Environment.js';
import EnvEntry from './../environment/EnvEntry.js';
import Unique from './../Unique.js';

// thread { body }
// thread id: { body }
// thread id(params): { body }
class ThreadDeclaration extends FunctionExpression {
	constructor() {
		super();
		this._type = "ThreadDeclaration";
		this._stepIndex = 0;
		this._funcArgIndex = 0;
	}
	get bodyFrom() {
		return this._bodyFrom;
	}
	set bodyFrom(b) {
		this._bodyFrom = b;
	}
	set environment(env) {
		super.environment = env;
		if (this._body.type === 'CallExpression') {
			for (var arg of this._body.arguments) {
				arg.environment = env;
			}
		} else {
			for (var arg of this._params) {
				arg.environment = env;
			}
		}
	}
	step() {
		// this is a new thread, so get the threadmanager and add a new thread
		var tm = ThreadManager.getInstance();

		var thread;
		if (this._body.type === 'BlockStatement') {
			var newEnv = new Environment(this._environment);
			// add _params to newEnv
			for (var i = 0; i < this._params.length; i++) {
				var ee = new EnvEntry();
				ee.setName(this._params[i].name);
				ee.setValue(this._params[i]);
				newEnv.addEntry(ee);
			}
			thread = new Thread(this._body, newEnv);
			thread.setId(this._id.name);
			tm.addThread(thread);
			this._stepIndex = 1;
		} else {
			if (this._funcArgIndex < this._body.arguments.length) {
				if (!this._body.arguments[this._funcArgIndex].isDone()) {
					this._body.arguments[this._funcArgIndex].step();
					return;
				}
				this._funcArgIndex++;
				return;
			}
			var args = this._body.arguments.map(arg => arg.eval());
			var body = this._environment
						   .getEntry(this._body.callee)
						   .getValue()
						   .cloneBody(args);
			//Log.d(body);
			thread = new Thread(body, null, true);
			thread.setId(this._body.callee + Unique.get());
			tm.addThread(thread);
			this._stepIndex = 1;
		}
	}
	isDone() {
		return this._stepIndex === 1;
	}
}
export default ThreadDeclaration;