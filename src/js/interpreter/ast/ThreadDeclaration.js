import FunctionExpression from './FunctionExpression.js';
import Log from './../../logger/Log.js';
import ThreadManager from './../runner/ThreadManager.js';
import Thread from './../runner/Thread.js';
import Environment from './../environment/Environment.js';
import EnvEntry from './../environment/EnvEntry.js';

// thread { body }
// thread id: { body }
// thread id(params): { body }
class ThreadDeclaration extends FunctionExpression {
	constructor() {
		super();
		this._type = "ThreadDeclaration";
		this._bodyFrom = 'definition';
		this._stepIndex = 0;
	}
	get bodyFrom() {
		return this._bodyFrom;
	}
	set bodyFrom(b) {
		this._bodyFrom = b;
	}
	step() {
		// this is a new thread, so get the threadmanager and add a new thread
		var tm = ThreadManager.getInstance();

		var newEnv = new Environment(this._environment);
		// add _params to newEnv
		for (var i = 0; i < this._params.length; i++) {
			var ee = new EnvEntry();
			ee.setName(this._params[i].name);
			ee.setValue(this._params[i]);
			newEnv.addEntry(ee);
		}

		var thread = new Thread(this._body, newEnv);
		thread.setId(this._id.name);
		tm.addThread(thread);
		this._stepIndex = 1;
	}
	isDone() {
		return this._stepIndex === 1;
	}
}
export default ThreadDeclaration;