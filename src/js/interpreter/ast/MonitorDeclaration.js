import ClassDeclaration from './ClassDeclaration.js';

// monitor X { }
class MonitorDeclaration extends ClassDeclaration {
	constructor() {
		super();
		this._type = "MonitorDeclaration";
	}
}
export default MonitorDeclaration;