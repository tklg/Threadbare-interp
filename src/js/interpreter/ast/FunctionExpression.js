import AbstractElement from './AbstractElement.js';
import Environment from './../environment/Environment.js';
import EnvEntry from './../environment/EnvEntry.js';
import Log from './../../logger/Log.js';
import clone from 'clone';

const TAG = "FunctionExpression";
// void id(params) { body }
class FunctionExpression extends AbstractElement {
	constructor() {
		super();
		this._type = "FunctionExpression";
		// instance of Identifier
		this._id;
		// array of VariableDeclaration
		this._params = [];
		// instance of BlockStatement
		this._body;
	}
	get id() {
		return this._id;
	}
	set id(id) {
		this._id = id;
	}
	get params() {
		return this._params;
	}
	addParam(param) {
		this._params.push(param);
	}
	/*get body() {
		return this._body;
	}*/
	// params is an array of evaluated literals
	cloneBody(params, fakeClone) {
		// function body is copied and run
		// inject params into env
		var body = !fakeClone ? clone(this._body) : this._body;
		var declarations = this._params;
		//Log.d("DECL", declarations);
		if (!params || declarations.length !== params.length) throw `${this._id.name}/${declarations.length}: incorrect arity, got ${params ? params.length : 0}.`;
		var newEnv = new Environment(this._environment);
		// add _params to newEnv
		for (var i = 0; i < declarations.length; i++) {
			var ee = new EnvEntry();
			//Log.d(TAG, declarations[i].declarations[0]);
			ee.setName(declarations[i].declarations[0].id.name);
			ee.setValue(params[i]);
			newEnv.addEntry(ee);
		}
		body.environment = newEnv;
		//Log.d(TAG, newEnv);
		return body;
	}
	set body(body) {
		this._body = body;
	}
	set environment(env) {
		super.environment = env;
		//this._body.environment = env;
		//this._id.environment = env;
	}
	step() {
		// add declaration to environment
		var ee = new EnvEntry();
		ee.setName(this._id.name);
		ee.setValue(this);
		//Log.d(TAG, ee);
		if (this._environment.canAddEntry(ee)) {
			this._environment.addEntry(ee);
		} else {
			throw `${this._id.name}/${this._params.length} is already defined in the environment.`;
		}
		this._hasRun = true;
	}
	isDone() {
		return this._hasRun || false;;
	}
}
export default FunctionExpression;