import FunctionExpression from './FunctionExpression.js';

// thread { body }
// thread id: { body }
// thread id(params): { body }
class ThreadDeclaration extends FunctionExpression {
	constructor() {
		super();
		this._type = "ThreadDeclaration";
	}
}
export default ThreadDeclaration;