import ThreadManager from './runner/ThreadManager.js';
import Thread from './runner/Thread.js';
import Environment from './environment/Environment.js';
import Log from './../logger/Log.js';

const TAG = 'Runner';
class Runner {
	constructor(tree) {
		this.tm = ThreadManager.getInstance();

		var programThread = new Thread(tree, new Environment());
		this.tm.addThread(programThread); // root thread containing program expression
		
		this.delay = 1;
		this.interval = null;

		Log.d(this.tm);
	}
	step() {
		this.tm.next();
		this.tm.step();
	}
	start() {
		this.stop();
		this.interval = setInterval(this.step, this.delay);
	}
	stop() {
		clearInterval(this.interval);
	}
}
export default Runner;