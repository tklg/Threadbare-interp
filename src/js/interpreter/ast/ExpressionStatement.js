import AbstractElement from './AbstractElement.js';

// x = x + 2;
// a line, ending with a ;
class ExpressionStatement extends AbstractElement {
	constructor() {
		super();
		this._type = "ExpressionStatement";
		// instanceof AbstractExpression
		this._expression;
		this._hasRun = false;
	}
	get expression() {
		return this._expression;
	}
	set expression(exp) {
		this._expression = exp;
	}
	set environment(env) {
		super.environment = env;
		this._expression.environment = env;
	}
	step() {
		if (!this._expression.isDone()) {
			this._expression.step();
			return;
		} else {
			this._hasRun = true;
		}
	}
	isDone() {
		return this._expression.isDone() && this._hasRun;
	}
	eval() {
		return this._expression.eval();
	}

}
export default ExpressionStatement;