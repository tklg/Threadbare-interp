import AbstractElement from './AbstractElement.js';

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
}
export default UpdateExpression;