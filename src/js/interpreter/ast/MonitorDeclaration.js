import ClassDeclaration from './ClassDeclaration.js';

// monitor { body }
// monitor id: { body }
// monitor id(params): { body }
class MonitorDeclaration extends ClassDeclaration {
	constructor() {
		super();
		this._type = "MonitorDeclaration";
	}
}
export default MonitorDeclaration;