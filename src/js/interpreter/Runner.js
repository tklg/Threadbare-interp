import ThreadManager from './runner/ThreadManager.js';

class Runner {
	constructor(tree) {
		this.tm = new ThreadManager();
		this.tm.addThread(tree); // root ThreadBlock
		this.delay = 1;
		this.interval = null;
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