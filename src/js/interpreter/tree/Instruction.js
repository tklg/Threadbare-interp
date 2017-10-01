import EnvEntry from './../environment/EnvEntry.js';
import Log from './../../logger/Log.js';
const TAG = "Instruction";
class Instruction {
	constructor(tokens, parentBlock) {
		this.parent = parentBlock;
		this.tokens = tokens;
		this.index = 0;
		this.instructions = [];
		Log.d(TAG, this.toString());
		this.tokensToInstr();
	}
	step() {
		this.instructions[this.index++]();
	}
	isDone() {
		return this.index === this.instructions.length;
	}
	toString() {
		return this.tokens.map(t => t.value).join(' ');
	}
	static tokensToString(tokens) {
		return tokens.map(t => t.value).join(' ');
	}
	tokensToInstr() {
		var i = 0;
		let ee;
		var block = this.parent;
		var tokens = this.tokens;
		var addToEnv = false;
		if (tokens[i].type === 'typeModifier') { // global int x = ...
			if (!tokens[i + 1]) {
				throw "Expected variable type, found EOL.";
			}
			if (tokens[i + 1].type !== 'primitiveType' && tokens[i + 1].type !== 'objectType') {
				throw `Expected variable name, found ${tokens[i + 2].type}.`;
			}
			if (!tokens[i + 2]) {
				throw "Expected variable name, found EOL.";
			}
			if (tokens[i + 2].type !== 'variableName') {
				throw `Expected variable name, found ${tokens[i + 2].type}.`;
			}
			ee = new EnvEntry(tokens[i + 1].value);
			ee.setTag(tokens[i].value);
			ee.setName(tokens[i + 2].value);
			if (!block.canAddToEnv(ee)) {
				throw `Cannot declare new ${tokens[i + 1].value}: ${tokens[i + 2].value} (Already declared in this scope).`;
			}
			addToEnv = true;
			tokens = tokens.slice(3);
		} else if (tokens[i].type === 'primitiveType' || tokens[i].type === 'objectType') { // int x = ...
			if (!tokens[i + 1]) {
				throw "Expected variable name, found EOL.";
			}
			if (tokens[i + 1].type !== 'variableName') {
				throw `Expected variable name, found ${tokens[i + 1].type}.`;
			}
			ee = new EnvEntry(tokens[i].value);
			ee.setName(tokens[i + 1].value);
			if (!block.canAddToEnv(ee)) {
				throw `Cannot declare new ${tokens[i].value}: ${tokens[i + 1].value} (Already declared in this scope).`;
			}
			addToEnv = true;
			tokens = tokens.slice(2);
		} else if (tokens[i].type === 'variableName' && tokens[i + 1].value === '=') { // x = ...
			ee = block.getFromEnv(tokens[i].value);
			if (!ee) throw `Cannot find entry: ${tokens[i].value}`;
			if (!ee.canModifyEntry()) {
				throw `Cannot modify value of ${tokens[i].value}: is final`;
			}
			tokens = tokens.slice(1);
		} else if (tokens[i].type === 'variableName' && tokens[i + 1].value !== '!=' && tokens[i + 1].value !== '==') { // x++, x+=, etc
			ee = block.getFromEnv(tokens[i].value);
			if (!ee) throw `Cannot find entry: ${tokens[i].value}`;
			if (!ee.canModifyEntry()) {
				throw `Cannot modify value of ${tokens[i].value}: is final`;
			}
		}

		if (addToEnv) {
			this.addAction(function() {
				this.parent.addToEnv(ee);
			});
		}

		if (tokens[0].type === 'operatorShorthand') { // ++, --, += , -=, /=, *=, %=, &=, ^=, |=
			if (['++','--'].includes(tokens[0].value)) {

			} else {

			}
			return;
		}

		if (tokens[0].value === '=') {
			tokens.shift();
		}



		Log.out(TAG, Instruction.tokensToString(tokens));
		Log.d(TAG, ee);
	}
	addAction(act) {
		this.instructions.push(act.bind(this));
	}
}
export default Instruction;