import AbstractElement from './AbstractElement.js';

// x
class Identifier extends AbstractElement {
	constructor() {
		super();
		this._type = 'Identifier';
		// instance of string
		this._name;
	}
	get name() {
		return this._name;
	}
	set name(name) {
		this._name = name;
	}
	step() {

	}
	isDone() {
		return true;
	}
	eval() {
		//console.log(JSON.parse(JSON.stringify(this._environment)));
		var ee = this._environment.getEntry(this._name);
		if (ee) return ee.getValue();
		else throw this._name + " is not defined in the environment.";
	}
}
export default Identifier;