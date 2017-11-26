import Unique from './../Unique.js';

class AbstractElement {
	constructor() {
		// string matching its own class name
		this._type;
		this._runtimeIdentifier = Unique.get();
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
	set runtimeID(id) {
		this._runtimeIdentifier = id;
	}
	get runtimeID() {
		return this._runtimeIdentifier;
	}
	step() {
		throw this._type + "::step() not implemented.";
	}
	isDone() {
		throw this._type + "::isDone() not implemented";
	}
	eval() {
		throw this._type + "::eval() not implemented";
	}
}
export default AbstractElement;