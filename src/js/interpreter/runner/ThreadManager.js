var tm;

class ThreadManager {
	static getInstance(type) {
		if (!tm) tm = new ThreadManager(type || ThreadType.RANDOM);
		return tm;
	}
	constructor(type) { // random, queue
		this.type = type;
		this.current = null;
		this.threads = [];
	}
	addThread(t) {
		this.threads.push(t);
	}
	removeThread(t) {
		this.threads = this.threads.filter(x => x != t);
	}
	set(thread) {
		this.threads.push(this.current);
		this.current = thread;
	}
	next() {
		var i = this.threads.length;
		do {
			if (this.type === ThreadType.QUEUE) {
				this.threads.push(this.current);
				this.current = this.threads.shift();
			} else {
				this.current = this.threads[Math.floor(Math.random() * this.threads.length)];
			}
		} while (this.current.isBlocked() && i-- > 0);
	}
	current() {
		return this.current;
	}
	step() {
		if (this.current) this.current.step();
	}
}
const ThreadType = {
	QUEUE: 'queue',
	RANDOM: 'random',
};
export {
	ThreadManager as default,
	ThreadType,
};