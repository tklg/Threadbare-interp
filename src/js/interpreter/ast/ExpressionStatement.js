import AbstractElement from './AbstractElement.js';

// x = x + 2;
// a line, ending with a ;
class ExpressionStatement extends AbstractElement {
	constructor() {
		super();
		this._type = "ExpressionStatement";
		// instanceof AbstractExpression
		this._expression;
	}
	get expression() {
		return this._expression;
	}
	set expression(exp) {
		this._expression = exp;
	}
}
export default ExpressionStatement;