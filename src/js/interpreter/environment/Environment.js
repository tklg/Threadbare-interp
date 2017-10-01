class Environment {
	constructor(env) {
		this.parentEnv = env || null;
		this.env = {};
	}
	addEntry(en) {
		this.env[en.getName()] = en;
	}
	getEntry(name) {
		return this.env[name] || (this.parentEnv ? this.parentEnv.getEntry(name) : null);
	}
	canAddEntry(name) {
		return this.env[name] === undefined;
	}
}
export default Environment;