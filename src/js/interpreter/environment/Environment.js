class Environment {
	constructor(env) {
		this.parentEnv = env || null;
		this.env = {};
	}
	addEntry(en) {
		this.env[en.getName()] = en;
	}
	addEntryToGlobal(en) {
		if (this.parentEnv === null) this.addEntry(en);
		else this.parentEnv.addEntryToGlobal(en);
	}
	updateEntry(name, val) {
		this.getEntry(name).setValue(val);
	}
	getEntry(name) {
		return this.env[name] || (this.parentEnv ? this.parentEnv.getEntry(name) : null);
	}
	canAddEntry(entry) {
		return this.env[entry.getName()] === undefined;
	}
}
export default Environment;