import AbstractElement from './AbstractElement.js';

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
}
export default ClassDeclaration;