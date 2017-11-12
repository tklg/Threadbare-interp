import AbstractElement from './AbstractElement.js';
import Literal from './Literal.js';

// x = 0;
class VariableDeclarator extends AbstractElement {
	constructor() {
		super();
		this._type = "VariableDeclarator";
		// left side of =
		// instanceof Identifier
		this._id;
		// right side of =
		this._init;
	}
	get id() {
		return this._id;
	}
	set id(id) {
		this._id = id;
	}
	get init() {
		return this._init;
	}
	set init(init) {
		this._init = init;
	}
	set environment(env) {
		super.environment = env;
		if (this._init) this._init.environment = env;
		this._id.environment = env;
	}
	step() {
		if (this._init && !this._init.isDone()) {
			this._init.step();
		}
	}
	isDone() {
		return this._init ? this._init.isDone() : true;
	}
	eval() {
		if (this._init) {
			return this._init.eval();
		} else {
			var n = new Literal();
			n.value = null;
			n.raw = 'null';
			n.valueType = 'null';
			return n;
		}
	}
}
export default VariableDeclarator;