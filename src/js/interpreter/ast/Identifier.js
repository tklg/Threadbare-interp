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
}
export default Identifier;