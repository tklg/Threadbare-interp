import FunctionExpression from './FunctionExpression.js';

// monitor { body }
// monitor id: { body }
// monitor id(params): { body }
class MonitorExpression extends FunctionExpression {
	constructor() {
		super();
		this._type = "MonitorExpression";
	}
}
export default MonitorExpression;