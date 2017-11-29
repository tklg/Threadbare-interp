import AbstractElement from './AbstractElement.js';
import Event from './../../Eventify.js';

const event = Event.getInstance();
// break;
class BreakStatement extends AbstractElement {
	constructor() {
		super();
		this._type = "BreakStatement";
	}
	step() {
		event.emit(this.runtimeID + ".break");
		this._hasRun = true;
	}
	isDone() {
		return this._hasRun || false;
	}
}
export default BreakStatement;