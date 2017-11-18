class Environment {
	constructor(env) {
		this.id = Date.now();
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
	getRoot() {
		if (this.parentEnv === null) return this;
		else return this.parentEnv.getRoot();
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