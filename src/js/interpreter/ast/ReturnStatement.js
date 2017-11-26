import AbstractElement from './AbstractElement.js';

// return(x);
// return x;
class ReturnStatement extends AbstractElement {
	constructor() {
		super();
		this._type = "ReturnStatement";
		// single argument
		this._argument;
	}
	get argument() {
		return this._argument;
	}
	set argument(arg) {
		this._argument = arg;
	}
	step() {
		if (!this._argument.isDone()) {
			this._argument.step();
			return;
		} else {
			event.emit(this.runtimeID + ".return", this._argument.eval());
			this._hasRun = true;
		}
	}
	isDone() {
		return this._argument.isDone() && this._hasRun;
	}
}
export default ReturnStatement;