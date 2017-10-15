import FunctionExpression from './FunctionExpression.js';
import Log from './../../logger/Log.js';
import ThreadManager from './../runner/ThreadManager.js';
import Thread from './../runner/Thread.js';
import Environment from './../environment/Environment.js';

// thread { body }
// thread id: { body }
// thread id(params): { body }
class ThreadDeclaration extends FunctionExpression {
	constructor() {
		super();
		this._type = "ThreadDeclaration";
		this._stepIndex = 0;
	}
	step() {
		// this is a new thread, so get the threadmanager and add a new thread

		var tm = ThreadManager.getInstance();

		var newEnv = new Environment(this._environment);
		// add _params to newEnv
		var thread = new Thread(this._body, newEnv);
		tm.addThread(thread);
		this._stepIndex = 1;
	}
	isDone() {
		return this._stepIndex === 1;
	}
}
export default ThreadDeclaration;