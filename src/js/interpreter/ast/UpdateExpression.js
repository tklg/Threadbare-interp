import AbstractElement from './AbstractElement.js';
import clone from 'clone';
// x--
// --x
class UpdateExpression extends AbstractElement {
	constructor() {
		super();
		this._type = "UpdateExpression";
		// string (++, --)
		this._operator;
		// Identifier
		this._argument;
		// bool ++ before or after operator
		this._prefix = false;
		this._hasRun = false;
	}
	get operator() {
		return this._operator;
	}
	set operator(operator) {
		this._operator = operator;
	}
	get argument() {
		return this._argument;
	}
	set argument(argument) {
		this._argument = argument;
	}
	get isPrefix() {
		return this._prefix;
	}
	set isPrefix(prefix) {
		this._prefix = prefix;
	}
	set environment(env) {
		super.environment = env;
		this._argument.environment = env;
	}
	step() {
		if (!this._argument.isDone()) {
			this._argument.step();
			return;
		}
		// this._arguemnt is always Identifier
		var id = this._argument.eval();
		this._orig = clone(id);

		if (this._operator === '++') id.value++;
		else id.value--;

		this._environment.updateEntry(this._argument.name, id);
		this._hasRun = true;
	}
	isDone() {
		return this._hasRun;
	}
	eval() {
		if (this._prefix) return this._argument.eval();
		else {
			var t = this._orig;
			delete this._orig;
			return t;
		}
	}
}
export default UpdateExpression;