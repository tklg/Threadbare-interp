export default class Node {
	constructor(tokens, parent, env) {
		this.tokens = tokens;
		this.parent = parent;
		this.env = env;
		this.children = [];
	}
	getParent() {
		return this.parent;
	}
	addChild(cn) {
		if (!(cn instanceof Node)) {
			throw "Invalid child node: " + cn;
		}
		this.children.push(cn);
	}
}