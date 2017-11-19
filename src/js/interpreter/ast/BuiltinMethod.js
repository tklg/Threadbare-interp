import CallExpression from './CallExpression.js';
import Literal from './Literal.js';
import Log from './../../logger/Log.js';
import Eventify from './../../Eventify.js';
import EnvEntry from './../environment/EnvEntry.js';
import ThreadManager from './../runner/ThreadManager.js';
import Unique from './../Unique.js';

const event = Eventify.getInstance();
const TAG = "BuiltinMethod";
// print(x)
class BuiltinMethod extends CallExpression {
	constructor() {
		super();
		this._type = 'BuiltinMethod';
	}
	step() {
		if (this._argsIndex < this._arguments.length || (this._arguments[this._argsIndex] !== undefined && !this._arguments[this._argsIndex].isDone())) {
			if (!this._arguments[this._argsIndex].isDone())
				this._arguments[this._argsIndex].step();
			/*if (this._arguments[this._argsIndex].isDone()) {
				// set argument to evaluated Identifier
				this._arguments[this._argsIndex] = this._arguments[this._argsIndex].eval();
				this._argsIndex++;
			}*/
			// do not modify the actual arguments
			if (this._arguments[this._argsIndex].isDone()) {
				this._argsIndex++;
			}
			return;
		}
		// depending on callee, do something with arguments
		var tm = ThreadManager.getInstance();
		switch (this._callee) {
			case 'print':
				var res = '';
				for (var s of this._arguments) {
					res += s.eval().value;
				}
				//Log.d("STDOUT", res);
				//Log.out("stdout", res);
				event.emit('stdout', res);
				break;
			case 'error':
				var res = '';
				for (var s of this._arguments) {
					res += s.eval().value;
				}
				event.emit('stderr', res);
				break;
			case 'sleep':
				var delay;
				var id = tm.getCurrent().getId();
				tm.pauseCurrent();
				if (this._arguments.length) delay = this._arguments[0].eval().value;
				else throw "function sleep/0 not found";				
				setTimeout(function() {
					tm.resume(id);
				}, parseInt(delay));
				break;
			case '__thread_sleep':
				//Log.d(TAG, "pause");
				tm.pauseCurrent();
				break;
			case '__thread_wake':
				//Log.d(TAG, "resume");
				var id;
				if (this._arguments.length) id = this._arguments[0].eval().value;
				if (id) tm.resume(id);
				else tm.resume();
				break;
			case '__thread_id':
				var lit = new Literal();
				//Log.d(tm.getCurrent());
				lit.value = tm.getCurrent().getId();
				lit.raw = "\""+tm.getCurrent().getId()+"\"";
				lit.valueType = 'String';
				this._returnValue = lit;
				break;
			case '__local_thread_count': 
				var ee = this._environment.getRoot().getEntry('__threadbare_threadstore');
				var val = ee ? ee.getValue() : [];
				//console.log(this._environment);
				//Log.d(TAG, "local thread count: " + val.length);
				var lit = new Literal();
				lit.value = val.length;
				lit.raw = ''+val.length;
				lit.valueType = 'int';
				this._returnValue = lit;
				break;
			case '__local_thread_store': 
				var ee = this._environment.getRoot().getEntry('__threadbare_threadstore');
				if (!ee) {
					ee = new EnvEntry();
					ee.setName('__threadbare_threadstore');
					ee.addTag(Unique.get());
					ee.setValue([]);
				}
				// store literal to js array
				var id = this._arguments[0].eval().value;
				var val = ee.getValue();
				val.push(id);
				ee.setValue(val);
				this._environment.addEntryToGlobal(ee);
				//console.log("store " + this._environment.getRoot().id);
				//Log.d(TAG, "stored thread " + val);
				break;
			case '__local_thread_unstore': 
				var ee = this._environment.getRoot().getEntry('__threadbare_threadstore');
				if (!ee) break;
				var val = ee.getValue();
				var id = val[Math.floor(Math.random() * val.length)];
				val = val.filter(x => x !== id);
				ee.setValue(val);
				this._environment.addEntryToGlobal(ee);
				//console.log("unstore " + this._environment.getRoot().id);
				//Log.d(TAG, "unstore thread " + id);
				// put back into an int literal
				var lit = new Literal();
				lit.value = id;
				lit.raw = "\"" + id + "\"";
				lit.valueType = 'String';
				this._returnValue = lit;
				break;
		}
		this._hasRun = true;
	}
	isDone() {
		return this._argsIndex === this._arguments.length
			&& this._hasRun;
	}
	eval() {
		var nul = new Literal();
		nul.value = null;
		nul.raw = 'null';
		nul.valueType = null;
		return this._returnValue || nul;
	}
}
export default BuiltinMethod;