import AbstractElement from './AbstractElement.js';

// kind key() { value: FunctionExpression }
class MethodDefinition extends AbstractElement {
	constructor() {
		super();
		this._type = "MethodDefinition";
		// instance of Identifier (method name)
		this._key;
		this._computed = false;
		// instance of FunctionExpression
		this._value;
		// 'constructor' or 'method'
		this._kind = "method";
		this._static = false;
	}
	get key() {
		return this._key;
	}
	set key(key) {
		this._key = key;
	}
	get isComputed() {
		return this._computed;
	}
	set isComputed(com) {
		this._computed = com;
	}
	get value() {
		return this._value;
	}
	set value(value) {
		this._value = value;
	}
	get kind() {
		return this._kind;
	}
	set kind(kind) {
		this._kind = kind;
	}
	get isStatic() {
		return this._static;
	}
	set isStatic(static) {
		this._static = static;
	}
}
export default MethodDefinition;