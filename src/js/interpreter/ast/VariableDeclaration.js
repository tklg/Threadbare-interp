import AbstractElement from './AbstractElement.js';
import EnvEntry from './../environment/EnvEntry.js';
import Log from './../../logger/Log.js';

// var x;
class VariableDeclaration extends AbstractElement {
	constructor() {
		super();
		this._type = "VariableDeclaration";
		this._declIndex = 0;
		// array of VariableDeclarator
		this._declarations = [];
		// string (int, char, etc)
		this._kind;

		// string[] final, private, etc
		this._modifiers = [];
		this._hasRun = false;
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
	set environment(env) {
		super.environment = env;
		for (var i of this._declarations) {
			i.environment = env;
		}
	}
	step() {
		// step through the declarators first
		var dec = this._declarations[this._declIndex];

		if (!dec.isDone()) {
			dec.step();
			return;
		}


		var ee = new EnvEntry(dec.eval());
		ee.setName(dec.id.name);
		for (var m of this._modifiers) {
			ee.addTag(m);
		}
		var e = this._environment;
		if (e.canAddEntry(ee)) {
			e.addEntry(ee);
		}
		this._declIndex++;
		if (this._declIndex === this._declarations.length) this._hasRun = true;
	}
	isDone() {
		return this._declIndex === this._declarations.length && this._hasRun;
	}
}
export default VariableDeclaration;