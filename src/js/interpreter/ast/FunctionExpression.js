import AbstractElement from './AbstractElement.js';

// void id(params) { body }
class FunctionExpression extends AbstractElement {
	constructor() {
		super();
		this._type = "FunctionExpression";
		// instance of Identifier
		this._id;
		// array of VariableDeclaration
		this._params = [];
		// instance of BlockStatement
		this._body;
	}
	get id() {
		return this._id;
	}
	set id(id) {
		this._id = id;
	}
	get params() {
		return this._params;
	}
	addParam(param) {
		this._params.push(param);
	}
	get body() {
		return this._body;
	}
	set body(body) {
		this._body = body;
	}
	set environment(env) {
		super.environment = env;
		this._body.environment = env;
	}
}
export default FunctionExpression;