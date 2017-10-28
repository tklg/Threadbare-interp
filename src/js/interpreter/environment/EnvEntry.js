class EnvEntry {
	constructor(value) {
		this.value = value || null;
		this.tags = [];
	}
	setValue(val) {
		this.value = val || null;
	}
	getValue() {
		return this.value;
	}
	setName(name) {
		this.name = name;
	}
	getName() {
		return this.name;
	}
	addTag(tag) {
		if (!this.tags.includes(tag)) this.tags.push(tag);
	}
	canModifyEntry() {
		return this.tags.indexOf('final') === -1;
	}
}
export default EnvEntry;