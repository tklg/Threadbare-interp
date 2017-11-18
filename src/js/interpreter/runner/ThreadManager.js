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
		event.emit('threads.add', t.getId(), this.threads.length, (this.current ? 1 : 0));
		if (this.current === null) this.current = this.threads.shift();
	}
	removeThread(t) {
		var id = t.getId();
		//if (this.current === t) this.current = this.threads.shift();
		//Log.d(TAG, "Removed thread: " + id);
		event.emit('threads.remove', id);
		this.threads = this.threads.filter(x => x != t);
		//this.current = this.threads[0];
		this.current = this.threads.shift();
	}
	set(thread) {
		this.threads.push(this.current);
		this.current = thread;
		if (!this.threads.includes(thread)) this.addThread(thread);
	}
	pauseCurrent() {
		this.current.block();
		event.emit('threads.pause', this.current.getId());
		this.next();
	}
	resume(id) {
		if (id) { // resume a specific thread
			for (var t of this.threads) {
				if (t.getId() === id && t.isBlocked()) {
					t.unblock();
					event.emit('threads.resume', id);
					return;
				}
			}
			event.emit('threads.resume.warn', 'Thread ' + id + ' does not exist or is not paused.');
		} else { // resume a random paused thread
			var thr = this.threads.filter(t => t.isBlocked());
			if (!thr.length) event.emit('threads.resume.warn', 'There are no blocked threads to resume.');
			var t = thr[Math.floor(Math.random() * thr.length)];
			t.unblock();
			event.emit('threads.resume', t.getId());
		}
	}
	next() {
		if (this.allBlocked()) {
			event.emit("threads.error", `Deadlock encountered: all threads are blocked. (${this.threads.length + (this.current ? 1 : 0)})`);
			return;
		}
		var oid = this.current.getId();
		if (this.threads.length < 1) return;
		else if (this.threads.length === 1 && this.current !== null) {
			// swap, unless queue is blocked
			if (this.threads[0].isBlocked()) return;
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
		} else {
			do {
				if (this.type === ThreadType.QUEUE) {
					var tmp = this.threads.shift();
					this.threads.push(this.current);
					this.current = tmp;
				} else {
					this.threads.push(this.current);
					this.current = this.threads[Math.floor(Math.random() * this.threads.length)];
					this.threads = this.threads.filter(t => t !== this.current);
					//this.current = this.threads.splice(Math.floor(Math.random() * this.threads.length), 1);
				}
			} while (this.current.isBlocked());
		}
		//Log.d("CURRENT", this.current);
		if (oid !== this.current.getId()) event.emit("thread.switch", this.current.getId());
	}
	getCurrent() {
		//Log.d("GETCURRENT", this.current);
		return this.current;
	}
	step() {
		// check to see if all threads are blocked
		if (this.allBlocked()) {
			event.emit("threads.error", `Deadlock encountered: all threads are blocked. (${this.threads.length + (this.current ? 1 : 0)})`);
			return;
		}
		if (this.current) this.current.step();
		if (this.current && this.current.isDone()) this.removeThread(this.current);
	}
	isDone() {
		return this.current == null && this.threads.length === 0;
			/*&& this.threads.reduce((a, t) => {
				a && t.isDone();
			}, true);*/
	}
	allBlocked() {
		return this.current.isBlocked() && this.threads.reduce((a, t) => a && t.isBlocked(), true)
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