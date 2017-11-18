import AbstractElement from './AbstractElement.js';

// kind key() { value: FunctionExpression }
class MethodDefinition extends AbstractElement {
	// goes inside a class
	constructor() {
		super();
		this._type = "MethodDefinition";
		// instance of Identifier (method name)
		this._key;
		// instance of FunctionExpression
		this._value;
		// 'constructor' or 'method'
		this._kind = "method";
		this._isStatic = false;
		this._visibility = 'public';
	}
	get key() {
		return this._key;
	}
	set key(key) {
		this._key = key;
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
		return this._isStatic;
	}
	set isStatic(isStatic) {
		this._isStatic = isStatic;
	}
	get visibility() {
		return this._visibility;
	}
	set visibility(v) {
		this._visibility = v;
	}
	set environment(env) {
		super.environment = env;
		this._key.environment = env;
		this._value.environment = env;
	}
}
export default MethodDefinition;