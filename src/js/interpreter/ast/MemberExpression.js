import AbstractElement from './AbstractElement.js';

// x.y
class MemberExpression extends AbstractElement {
	constructor() {
		super();
		this._type = "MemberExpression";
		this._computed = false;
		// left side, evaluates to identifier
		this._object;
		// right side, identifier
		this._property;
	}
	get computed() {
		return this._computed;
	}
	set computed(com) {
		this._computed = com;
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
}
export default MemberExpression;