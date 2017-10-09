import AbstractElement from './AbstractElement.js';
//import EventEmitter from './../../EventEmitter.js';

// print(x)
class BuiltinMethod extends AbstractElement {
	constructor() {
		super();
		this._type = 'BuiltinMethod';
		// evaluates to Identifier
		this._callee;
		this._arguments = [];
	}
	get callee() {
		return this._callee;
	}
	set callee(ce) {
		this._callee = ce;
	}
	get arguments() {
		return this._arguments;
	}
	addArgument(arg) {
		this._arguments.push(arg);
	}
	step() {
		// depending on callee, do something with arguments
		switch (this._callee.value) {
			case 'print':
				var res = '';
				for (var s of this._arguments) {
					res += s;
				}
				console.log(res);
				// EventEmitter.emit('print', res);
				break;
		}
	}
}
export default BuiltinMethod;