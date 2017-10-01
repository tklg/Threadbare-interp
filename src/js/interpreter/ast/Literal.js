import AbstractElement from './AbstractElement.js';

// 1, 'a', "a", null
class Literal extends AbstractElement {
	constructor() {
		super();
		this._type = "Literal";
		this._value = null;
		this._raw;
	}
	get value() {
		return this._value;
	}
	set value(value) {
		this._value = value;
	}
	get raw() {
		return this._raw;
	}
	set raw(raw) {
		this._raw = raw;
	}
}
export default Literal;