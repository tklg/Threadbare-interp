class Value {
	constructor(token) {
		this.token = token;
	}
	eval() {
		return this.token.value;
	}
}