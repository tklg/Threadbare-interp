import AbstractElement from './AbstractElement.js';
import Log from './../../logger/Log.js';
import Environment from './../environment/Environment.js';
import clone from 'clone';

const hiddenTest = Symbol('hiddenTest');
const hiddenBody = Symbol('hiddenBody');
const TAG = "ForStatement";
// for (init; test; update) { body }
class ForStatement extends AbstractElement {
	constructor() {
		super();
		this._type = "ForStatement";
		// VariableDeclaration or AssignmentExpression
		this._init;
		// BinaryExpression
		this._test;
		// Expression
		this._update;
		// BlockStatement
		this._body;
	}
	get init() {
		return this._init;
	}
	set init(init) {
		this._init = init;
	}
	get test() {
		return this._test;
	}
	set test(test) {
		this[hiddenTest] = test;
		this._test = clone(this[hiddenTest]);
	}
	get update() {
		return this._update;
	}
	set update(u) {
		this._update = u;
	}
	get body() {
		return this._body;
	}
	set body(body) {
		this[hiddenBody] = body;
		this._body = clone(this[hiddenBody]);
	}
	set environment(e) {
		this._nestedEnv = e;
		super.environment = this._nestedEnv;
		if (this._init.type === "VariableDeclaration") {
			// declaration creates a new env for the loop
			this._nestedEnv = new Environment(this._nestedEnv);
		}
		this._init.environment = this._nestedEnv;
		this._test.environment = this._nestedEnv;
		this._update.environment = this._nestedEnv;
		this._body.environment = this._nestedEnv;
	}
	step() {
		// for loop does not check the test on each step
		if (!this._init.isDone()) {
			Log.d('istep');
			this._init.step();
			return;
		} else if (this._test && !this._test.isDone()) {
			//Log.d(this._test);
			this._test.step();
			return;
		} else if (!this._body.isDone() && this._test && this._test.isDone() && !!this._test.eval()) {
			if (this._update.isPrefix && !this._body.hasRun) {
				this._update.step();
			}
			this._body.step();
			if (this._body.isDone()) {
				if (!this._update.isPrefix) this._update.step();
				delete this._test;
				this._test = clone(this[hiddenTest]);
				this._test.environment = this._nestedEnv;
				/*delete this._body;
				this._body = clone(this[hiddenBody]);
				this._body.environment = this._nestedEnv;*/
			}
		} else {
			delete this._test;
			this._test = clone(this[hiddenTest]);
			this._test.environment = this._nestedEnv;
			delete this._body;
			this._body = clone(this[hiddenBody]);
			this._body.environment = this._nestedEnv;
		}
	}
	isDone() {
		return this._break || this._test && this._test.isDone() && !this._test.eval().value && this._body.isDone();
	}
}
export default ForStatement;