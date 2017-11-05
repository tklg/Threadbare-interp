import Log from './../../../logger/Log.js';

const TAG = "ClassManager";
var instances = {};
class ClassManager {
	static getInstance(name) {
		if (!name) name = 'default';
		if (!instances[name]) instances[name] = new ClassManager();
		return instances[name];
	}
	constructor() {
		this._classes = {};
	}
	addClass(c) {
		// c instanceof ClassDeclaration
		this._classes[c.getName()] = c;
	}
	getClass(name) {
		return this._classes[name];
	}
}

export default ClassManager;