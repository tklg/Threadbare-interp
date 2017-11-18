import AbstractElement from './AbstractElement.js';
import Log from './../../logger/Log.js';

const TAG = "MemberExpression";
// x.y
class MemberExpression extends AbstractElement {
	constructor() {
		super();
		this._type = "MemberExpression";
		// left side, evaluates to identifier
		this._object;
		// right side, identifier
		this._property;
		this._hasRun = false;
	}
	get object() {
		return this._object;
	}
	set object(obj) {
		this._object = obj;
	}
	get property() {
		return this._property;
	}
	set property(prop) {
		this._property = prop;
	}
	set environment(env) {
		super.environment = env;
		this._object.environment = env;
		this._property.environment = env;
	}
	step() {
		if (!this._object.isDone()) {
			this._object.step();
			return;
		} else if (!this._evalObject) {
			this._evalObject = this._object.eval(); // returns EnvEntry.getValue()
			//Log.d('obj', this._evalObject);
			return;
		} else if (!this._evalProperty) {
			if (this._property.type === 'CallExpression') {
				this._property.environment = this._evalObject;
				// arguments of a callexpression use original env
				if (this._property.arguments) {
					for (var arg of this._property.arguments) {
						arg.environment = this._environment;
					}
				}
				this._evalProperty = this._property;
			} else {
				this._evalProperty = this._evalObject.getEntry(this._property.name).getValue();
			}
			//Log.d('ev', this._evalProperty);
			return;
		} else if (!this._evalProperty.isDone()) {
			this._evalProperty.step();
			return;
		} else {
			this._hasRun = true;
		}
	}
	isDone() {
		return this._hasRun || false;
	}
	eval() {
		if (this._object.type === 'Identifier') {
			return this._object;
		} else {
			return this._evalProperty.eval();
		}
	}
}
export default MemberExpression;