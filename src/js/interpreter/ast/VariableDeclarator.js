import AbstractElement from './AbstractElement.js';

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
	}
	step() {
		if (!this._init.isDone()) {
			this._init.step();
		}
	}
	isDone() {
		return this._init.isDone();
	}
	eval() {
		return this._init.eval();
	}
}
export default VariableDeclarator;