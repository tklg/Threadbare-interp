import Environment from '../environment/Environment.js';

class Block {
	constructor(parent, env) {
		this.instructions = [];
		this.index = 0;
		this.parent = parent || null;
		this.environment = env || new Environment();
	}
	get env() {
		return this.environment;
	}
	addInstruction(instr) {
		this.instructions.push(instr);
	}
	addToEnv(entry) {
		return this.environment.addEntry(entry);
	}
	getFromEnv(name) {
		return this.environment.getEntry(name);
	}
	canAddToEnv(name) {
		return this.environment.canAddEntry(name);
	}
	step() {
		/* 
		regular block is just lines
		run through once and stop
		*/
		if (this.instructions[this.index].isDone()) this.index++;
		this.instructions[this.index].step();
	}
	isDone() {
		return this.instructions[this.instructions.length - 1].isDone();
	}
}
export default Block;