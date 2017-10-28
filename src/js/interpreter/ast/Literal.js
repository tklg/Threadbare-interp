import AbstractElement from './AbstractElement.js';

// 1, 'a', "a", null
class Literal extends AbstractElement {
	constructor() {
		super();
		this._type = "Literal";
		this._valueType = "int";
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
	get valueType() {
		return this._valueType;
	}
	set valueType(t) {
		this._valueType = t;
	}
	step() {
		
	}
	isDone() {
		return true;
	}
	eval() {
		return this;
	}
}
export default Literal;