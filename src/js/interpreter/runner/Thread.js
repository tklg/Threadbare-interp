import clone from 'clone';
import Log from './../../logger/Log.js';
import Eventify from './../../Eventify.js';

const event = Eventify.getInstance();
const TAG = "Thread";
function Thread(exp, env, c) {
	var expression;
	if (!c) {
		// create a copy of the AST for the level the thread was created at
		expression = clone(exp, false, Infinity);
	} else {
		expression = exp;
	}
	var environment = env;
	var blocked = false;

	this._id = 'noid';

	try {
		if (environment) expression.environment = environment;
	} catch (e) {
		event.emit("thread.error", "Could not bind the environment to an element in the execution tree.");
	}

	this.getId = function() {
		return this._id;
	}
	this.setId = function(id) {
		this._id = id + ":" + Date.now().toString();
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
		return blocked;
	}
	this.block = function() {
		blocked = true;
	}
	this.unblock = function() {
		blocked = false;
	}
}

export default Thread;