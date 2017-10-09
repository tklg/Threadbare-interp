import AbstractElement from './AbstractElement.js';
class Program extends AbstractElement {
	constructor(env) {
		super(env);
		this._type = "Program";
		this._body = [];
	}
	get body() {
		return this._body;
	}
	addToBody(expr) {
		this._body.push(expr);
	}
}
export default Program;