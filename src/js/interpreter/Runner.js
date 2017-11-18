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
		//this.init(tree, type);
		this.isDone = false;
		this._started = false;
		this._tree = tree;
		this._type = type;
		this.delay = 3;
		this.interval = null;
		event.on('thread.error', this.stop.bind(this));
		event.on('threads.error', this.stop.bind(this));
	}
	step() {
		if (!this._started) {
			ThreadManager.reset();
			this.tm = ThreadManager.getInstance(this._type);

			var programThread = new Thread(this._tree, new Environment(), true);
			programThread.setId("MAINTHREAD");
			this.tm.addThread(programThread); // root thread containing program expression
			
			this._started = true;
		} else {
			//Log.d(TAG, "step");
			if (this.tm.isDone()) {
				//Log.d(TAG, "ThreadManager DONE");
				event.emit('threads.done');
				this.stop();
				this.isDone = true;
				return;
			}
			this.tm.next();
			try {
				if (this.interval) this.tm.step();
			} catch (e) {
				Log.e(TAG, e);
				this.stop();
			}
		}
	}
	start() {
		event.emit('runner.start');
		clearInterval(this.interval);
		this.interval = setInterval(this.step.bind(this), this.delay);
	}
	stop() {
		event.emit('runner.stop');
		clearInterval(this.interval);
		this.interval = null;
		//this.init(this._tree);
	}
	done() {
		return this.isDone;
	}
}
export default Runner;