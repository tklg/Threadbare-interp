import AbstractElement from './AbstractElement.js';
import ClassManager from './class/ClassManager.js';
import Class from './class/Class.js';
import clone from 'clone';

const man = ClassManager.getInstance();

// class id
class ClassDeclaration extends AbstractElement {
	constructor() {
		super();
		this._type = "ClassDeclaration";
		// instance of Identifier (the class name)
		this._id;
		// instance of Identifier
		this._superClass = null;
		// instance of ClassBody (a block)
		this._body;
	}
	get body() {
		return this._body;
	}
	set body(body) {
		this._body = body;
	}
	get id() {
		return this._id;
	}
	set id(id) {
		this._id = id;
	}
	get superClass() {
		return this._superClass;
	}
	set superClass(superClass) {
		this._superClass = superClass;
	}
	getMethod(name) {
		// search Class for method called [name]
	}
	step() {
		// clone the body, evaluate it, add fields to Class object, 
		// add Class to classmanager
		this._hasRun = true;
	}
	isDone() {
		return this._hasRun || false;
	}
}
export default ClassDeclaration;