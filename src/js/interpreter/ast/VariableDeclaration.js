import AbstractElement from './AbstractElement.js';

// var x;
class VariableDeclaration extends AbstractElement {
	constructor() {
		super();
		this._type = "VariableDeclaration";
		// array of VariableDeclarator
		this._declarations = [];
		// string (int, char, etc)
		this._kind;

		// string[] final, private, etc
		this._modifiers = [];
	}
	addDeclaration(dec) {
		this._declarations.push(dec);
	}
	get declarations() {
		return this._declarations;
	}
	set kind(kind) {
		this._kind = kind;
	}
	get kind() {
		return this._kind;
	}
	get modifiers() {
		return this._modifiers;
	}
	addModifier(mod) {
		this._modifiers.push(mod);
	}
}
export default VariableDeclaration;