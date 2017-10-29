import Log from './../../logger/Log.js';
import Eventify from './../../Eventify.js';

var tm;
const event = Eventify.getInstance();
const TAG = "ThreadManager";

class ThreadManager {
	static getInstance(type) {
		if (!tm) tm = new ThreadManager(type || ThreadType.RANDOM);
		return tm;
	}
	static reset() {
		tm = null;
	}
	constructor(type) { // random, queue
		this.type = type;
		this.current = null;
		this.threads = [];
	}
	addThread(t) {
		this.threads.push(t);
		//Log.d(TAG, "Added new thread: " + t.getId() + ", there are " + this.threads.length + " threads queued and " + (this.current ? 1 : 0) + " threads active.");
		event.emit('threads.add', 'tid:'+t.getId(), this.threads.length, (this.current ? 1 : 0));
		if (this.current === null) this.current = this.threads.shift();
	}
	removeThread(t) {
		var id = t.getId();
		//if (this.current === t) this.current = this.threads.shift();
		//Log.d(TAG, "Removed thread: " + id);
		event.emit('threads.remove', 'tid:'+id);
		this.threads = this.threads.filter(x => x != t);
		this.current = this.threads[0];
	}
	set(thread) {
		this.threads.push(this.current);
		this.current = thread;
		if (!this.threads.includes(thread)) this.addThread(thread);
	}
	next() {
		if (this.threads.length < 1) return;
		else if (this.threads.length === 1 && this.current !== null) {
			if (this.type === ThreadType.QUEUE) {
				var tmp = this.threads.shift();
				this.threads.push(this.current);
				this.current = tmp;
			} else {
				if (Math.random() > 0.5) {
					var tmp = this.threads.shift();
					this.threads.push(this.current);
					this.current = tmp;
				}
			}
			return;
		}
		var i = this.threads.length;
		do {
			if (this.type === ThreadType.QUEUE) {
				var tmp = this.threads.shift();
				this.threads.push(this.current);
				this.current = tmp;
			} else {
				this.threads.push(this.current);
				this.current = this.threads[Math.floor(Math.random() * this.threads.length)];
				this.threads = this.threads.filter(t => t !== this.current);
			}
			i--;
		} while (this.current.isBlocked() && i > 0);
		event.emit("thread.switch", "tid:"+this.current.getId());
	}
	current() {
		return this.current;
	}
	step() {
		if (this.current) this.current.step();
		if (this.current && this.current.isDone()) this.removeThread(this.current);
	}
	isDone() {
		return this.current == null && this.threads.length === 0;
			/*&& this.threads.reduce((a, t) => {
				a && t.isDone();
			}, true);*/
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