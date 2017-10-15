import clone from 'clone';
import Log from './../../logger/Log.js';

const TAG = "Thread";
function Thread(exp, env) {
	var expression = clone(exp, false, Infinity); // create a copy of the AST for the level the thread was created at
	var environment = env;

	expression.environment = environment;

	this.step = function() {
		Log.d(TAG, 'step');
		if (!expression.isDone()) expression.step();
		else {
			// Emitter.emit('thread.done');
		}
	}
	this.isDone = function() {

	}
	this.isBlocked = function() {
		return false;
	}
}

export default Thread;