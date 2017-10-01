import Value from './Value.js';
class Operator extends Value {
	constructor(leftTokens, op, rightTokens, parent) {
		this.left = leftTokens;
		this.right = rightTokens;
		this.op = op;
	}
	eval() {
		switch (this.op.value) {
			case '+': return;
		}
	}
}
export default Operator;