class AbstractElement {
	constructor() {
		// string matching its own class name
		this._type;
		// array of length 2
		// _range[0] is start token index, _range[1] is end token index
		//this._range = [];

		// the environment
		// this._environment = env;
	}
	get type() {
		return this._type;
	}
	get range() {
		return this._range;
	}
	set range(range) {
		this._range = range;
	}
	set environment(env) {
		this._environment = env;
	}
	get environment() {
		return this._environment;
	}
	step() {
		throw this._type + "::step() not implemented.";
	}
	isDone() {
		throw this._type + "::isDone() not implemented";
	}
}
export default AbstractElement;