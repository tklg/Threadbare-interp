import AbstractElement from './AbstractElement.js';
import ClassManager from './class/ClassManager.js';
import Class from './class/Class.js';
import clone from 'clone';
import Log from './../../logger/Log.js';
import Environment from './../environment/Environment.js';
import EnvEntry from './../environment/EnvEntry.js';

//const man = ClassManager.getInstance();
const TAG = "ClassDeclaration";

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
		// Classes are defined atomically
		var ee = new EnvEntry();
		ee.setName(this._id.name);

		var c = new Class();

		for (var item of this._body.body) {
			if (item.type === 'VariableDeclaration') {
				// get the item to modify the class environment
				item.environment = c;
				while (!item.isDone()) {
					item.step();
				}
			} else if (item.type === 'MethodDefinition' && item.kind === 'constructor') {
				var ce = new EnvEntry();
				ce.setName(item.key.name);
				ce.setValue(item.value);
				c.addConstructor(ce);
			} else {
				var ce = new EnvEntry();
				ce.setName(item.key.name);
				ce.setValue(item.value);
				ce.addTag(item.kind);
				ce.addTag(item.visibility);
				c.addEntry(ce);
			}
		}

		// set the class env (and all nested items) to a blank env
		//c.environment = new Environment(null);
		c.spreadEnv(c);

		// add class definition to env
		ee.setValue(c);
		//Log.d(TAG, c);
		this.environment.addEntryToGlobal(ee);
		
		this._hasRun = true;
	}
	isDone() {
		return this._hasRun || false;
	}
}
export default ClassDeclaration;