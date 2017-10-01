import FunctionExpression from './FunctionExpression.js';

// thread { body }
// thread id: { body }
// thread id(params): { body }
class ThreadExpression extends FunctionExpression {
	constructor() {
		super();
		this._type = "ThreadExpression";
	}
}
export default ThreadExpression;