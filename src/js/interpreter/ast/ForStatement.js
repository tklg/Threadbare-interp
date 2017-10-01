import AbstractElement from './AbstractElement.js';

// for (init; test; update) { body }
class ForStatement extends AbstractElement {
	constructor() {
		super();
		this._type = "ForStatement";
		// VariableDeclaration or AssignmentExpression
		this._init;
		// BinaryExpression
		this._test;
		// Expression
		this._update;
		// BlockStatement
		this._body;
	}
	get init() {
		return this._init;
	}
	set init(init) {
		this._init = init;
	}
	get test() {
		return this._test;
	}
	set test(test) {
		this._test = test;
	}
	get update() {
		return this._update;
	}
	set test(update) {
		this._update = update;
	}
	get body() {
		return this._body;
	}
	set body(body) {
		this._body = body;
	}
}
export default ForStatement;