class AbstractElement {
	constructor(env) {
		// string matching its own class name
		this._type;
		// array of length 2
		// _range[0] is start token index, _range[1] is end token index
		this._range = [];

		// the environment
		this._environment = env;
	}
	get type() {
		return this._type;
	}
	get range() {
		return this._range;
	}
	set range(range, end) {
		if (arguments.length === 1 && typeof range === 'array')
			this._range = range;
		else if (arguments.length === 2)
			this._range = [
				arguments[0] !== undefined ? arguments[0] : this._range[0], 
				arguments[1] !== undefined ? arguments[1] : this._range[1]
			];
	}
	get environment() {
		return this._environment;
	}
	step() {
		throw "AbstractElement::step() not implemented.";
	}
}
export default AbstractElement;