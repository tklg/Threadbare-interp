import FunctionExpression from './FunctionExpression.js';

// public Test() { }
class ConstructorFunctionExpression extends FunctionExpression {
	constructor() {
		super();
		this._type = "ConstructorFunctionExpression";
		this._classType;
	}
	set classType(type) {
		this._classType = type;
	}
	get classType() {
		return this._classType;
	}
	
}
export default ConstructorFunctionExpression;