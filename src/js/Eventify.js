var evntfy = [];

export default class Eventify {
	constructor() {
		this._events = [];
		this._always = [];
	}
	static getInstance(which) {
		if (!which) which = 'default';
		if (evntfy[which] === undefined) {
			evntfy[which] = new Eventify();
		}
		return evntfy[which];
	}
	static removeInstance(which) {
		if (!which) which = 'default';
		if (evntfy[which] !== undefined) {
			delete evntfy[which];
		}
	}
	on(event, func) {
		return this.listen(event, func);
	}
	listen(event, func) {
		if (event === 'any') {
			if (!this._always.includes(func))
				this._always.push(func);
			return;
		}
		if (this._events[event] === undefined) this._events[event] = [];
		if (this._events[event].includes(func)) return;

		this._events[event].push(func);
	}
	off(event, func) {
		return this.deafen(event, func);
	}
	deafen(event, func) {
		if (this._events == undefined) this._events = [];
		if (this._events[event] === undefined) {
			throw new Error("The event '" + event + "' is not registered");
		}
		if (func in this._events === false) return false;
		delete this._events[func];
		if (func in this._always) delete this._always[func];
	}
	emit(event) {
		var args = Array.prototype.slice.call(arguments, 1);
		for (var ev of this._always) {
			ev(event, args);
		}
		if (event in this._events === false) return;
		for (var i in this._events[event]) {
			this._events[event][i](args);
		}
	}
}