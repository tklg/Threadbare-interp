import AbstractElement from './AbstractElement.js';

// { }
class BlockStatement extends AbstractElement {
	constructor() {
		super();
		this._type = "BlockStatement";
		this._body = [];
		this._stepIndex = 0;
		this._atomic = false;
	}
	addToBody(expr) {
		this._body.push(expr);
	}
	get body() {
		return this._body;
	}
	set environment(env) {
		super.environment = env;
		for (var i of this._body) {
			i.environment = env;
		}

		var thisID = Unique.get();
		super.runtimeID = thisID;
		this._body.runtimeID = thisID;
		event.on(thisID + ".return", (x) => {
			this._returnValue = x;
		});
	}
	get environment() {
		return this._environment;
	}
	set runtimeID(id) {
		super.runtimeID = id;
		for (var i of this._body) {
			t.runtimeID = id;
		}
	}
	get hasRun() {
		return this._hasRun || false;
	}
	set atomic(a) {
		this._atomic = a;
	}
	get atomic() {
		return this._atomic;
	}
	addMonitorRestriction() {
		this._isMonitorContent = true;
		// store monitor thread state in monitor/class env
		// like builtin method does
	}
	step() {
		var expr = this._body[this._stepIndex];
		this._hasRun = true;
		if (!expr.isDone()) {
			if (this._atomic) {
				while (this._stepIndex < this._body.length) {
					expr = this._body[this._stepIndex];
					while (!expr.isDone()) expr.step();
					this._stepIndex++;
				}
			} else expr.step();
		} else {
			this._stepIndex++;
		}
	}
	isDone() {
		return this._returnValue || this._stepIndex === this._body.length && this._hasRun;
	}
	eval() {
		var nil = new Literal();
		nil.value = null;
		nil.valueType = 'null'
		nil.raw = '"null"';
		return this._returnValue || nil;
	}
}
export default BlockStatement;