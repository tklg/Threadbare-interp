import clone from 'clone';
import Log from './../../logger/Log.js';
import Eventify from './../../Eventify.js';

const event = Eventify.getInstance();
const TAG = "Thread";
function Thread(exp, env) {
	var expression = clone(exp, false, Infinity); // create a copy of the AST for the level the thread was created at
	var environment = env;

	this._id = Date.now().toString();

	expression.environment = environment;

	this.getId = function() {
		return this._id;
	}
	this.step = function() {
		//Log.d(TAG, 'step');
		try {
			if (!expression.isDone()) expression.step();
			else {
				event.emit('thread.done', this._id);
			}
		} catch (e) {
			//event.emit('thread.error', e);
			throw e;
		}
	}
	this.isDone = function() {
		return expression.isDone();
	}
	this.isBlocked = function() {
		return false;
	}
}

export default Thread;