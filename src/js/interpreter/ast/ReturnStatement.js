import AbstractElement from './AbstractElement.js';

// return(x);
// return x;
class ReturnStatement extends AbstractElement {
	constructor() {
		super();
		this._type = "ReturnStatement";
		// single argument
		this._argument;
	}
	get argument() {
		return this._argument;
	}
	set argument(arg) {
		this._argument = arg;
	}
}
export default ReturnStatement;