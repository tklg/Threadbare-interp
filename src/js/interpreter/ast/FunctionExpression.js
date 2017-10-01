import AbstractElement from './AbstractElement.js';

// void id(params) { body }
class FunctionExpression extends AbstractElement {
	constructor() {
		super();
		this._type = "FunctionExpression";
		// instance of Identifier
		this._id;
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
}
export default FunctionExpression;