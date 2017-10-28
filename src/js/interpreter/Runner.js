import ThreadManager, {ThreadType} from './runner/ThreadManager.js';
import Thread from './runner/Thread.js';
import Environment from './environment/Environment.js';
import Log from './../logger/Log.js';
import clone from 'clone';
import Eventify from './../Eventify.js';

const event = Eventify.getInstance();
const TAG = 'Runner';
class Runner {
	constructor(tree, type) {
		this.init(tree, type);
		this.isDone = false;
		event.on('thread.error', this.stop.bind(this));
	}
	init(tree, type) {
		ThreadManager.reset();
		this.tm = ThreadManager.getInstance(type);

		var programThread = new Thread(tree, new Environment());
		this.tm.addThread(programThread); // root thread containing program expression
		
		this.delay = 1;
		this.interval = null;

		Log.d(TAG, this.tm);
	}
	step() {
		//Log.d(TAG, "step");
		if (this.tm.isDone()) {
			//Log.d(TAG, "ThreadManager DONE");
			event.emit('threads.done');
			this.stop();
			this.isDone = true;
			return;
		}
		this.tm.next();
		this.tm.step();
	}
	start() {
		this.stop();
		this.interval = setInterval(this.step.bind(this), this.delay);
	}
	stop() {
		Log.d("DONE");
		clearInterval(this.interval);
		//this.init(this._tree);
	}
	done() {
		return this.isDone;
	}
}
export default Runner;