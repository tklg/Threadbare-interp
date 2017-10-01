import Node from './Node.js';

// any primitive value (int, float, char, string, etc)
export default class Leaf extends Node {
	constructor(parent, val) {
		super([], parent, null);
		//this.parent = parent;
		this.value = val;
	}
	getParent() {
		return this.parent;
	}
	getValue() {
		return this.value;
	}
	addChild() {
		throw "Cannot add child node to Leaf";
	}
}