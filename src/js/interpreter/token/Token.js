class Token {
	constructor(type, value, position) {
		this.val = value;
		this.typeString = type;
		this.position = position;
	}
	get value() {
		return this.val;
	}
	set value(val) {
		this.val = val;
	}
	get type() {
		return this.typeString;
	}
	set type(typ) {
		this.typeString = typ;
	}
	get pos() {
		return this.position;
	}
	set pos(position) {
		this.position = position;
	}
}

export default Token;