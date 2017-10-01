import ThreadBlock from './tree/ThreadBlock.js';
import CallableBlock from './tree/CallableBlock.js';
import MonitorBlock from './tree/MonitorBlock.js';
import Environment from './environment/Environment.js';
import Instruction from './tree/Instruction.js';
import Log from './../logger/Log.js';

function TreeBuilder() {
	const TAG = "TreeBuilder";
	var root = null;
	this.build = function(tokens) {
		return new Promise((resolve, reject) => {
			root = new ThreadBlock(null, null);
			root = makeBlockFromTokens(0, tokens.length, tokens, root);
			resolve(root);
		});
	}
	function makeBlockFromTokens(start, end, tokens, block) {
		var i = start;
		//Log.d(TAG, 'start: ' + start + " end: " + end);
		while (i < end && i < tokens.length) {
			//Log.d(TAG, tokens[i]);
			var itemToAdd = null;
			// global int x = ...
			// ends in a SemToken
			if (endsInSemicolon(tokens, i)) {
				var subTokens = tokens.slice(i, findSemTokenIndex(tokens, i) + 1);
				block.addInstruction(new Instruction(subTokens, block));
				i += subTokens.length;
				continue;
			} else if (isCallableBlock(tokens, i)) { // function, thread, monitor, etc
				var newBlock;
				if (tokens[i].type === 'thread') newBlock = new ThreadBlock(block);
				else if (tokens[i].type === 'function') newBlock = new CallableBlock(block);
				else if (tokens[i].type === 'monitor') newBlock = new MonitorBlock(block);

				var offset = findBlockIndexes(tokens, i);
				var subTokens = tokens.slice(offset.start, offset.end + 1);
				block.addInstruction(makeBlockFromTokens(0, subTokens.length, subTokens, newBlock));
				i = offset.end;
				continue;
			} else if (isLoopBlock(tokens, i)) { // some loop
				// remove
				i++;
				continue;
			} else if (isClassBlock(tokens, i)) { // class definition
				// remove
				i++;
				continue;
			}
			i++;			
		}
		return block;
	}
	function findSemTokenIndex(tokens, i) {
		var i = i;
		while (i++ < tokens.length) {
			if (tokens[i].type === 'semicolon') return i;
		}
	}
	function findBlockIndexes(tokens, i) {
		var i = i;
		// thread TAG: { }
		// function name() { }
		// monitor label: { }
		while (i++ < tokens.length) {
			if (tokens[i].type === 'braceLeft') 
				return {
					start: i, 
					end: tokens.indexOf(tokens[i].matchingToken)
				};
		}
	}
	function endsInSemicolon(tokens, i) {
		if (tokens[i].type === 'typeModifier') { // global int x = ...
			return true;
		} else if (tokens[i].type === 'primitiveType' || tokens[i].type === 'objectType') { // int x = ...
			return true;
		} else if (tokens[i].type === 'variableName' && tokens[i + 1].value === '=') { // x = ...
			return true;
		} else if (tokens[i].type === 'variableName' && tokens[i + 1].value !== '!=' && tokens[i + 1].value !== '==') { // x++, x+=, etc
			return true;
		} else {
			return false;
		}
	}
	function isCallableBlock(tokens, i) {
		if (tokens[i].type === 'thread') { // thread A: {}
			return true;
		} else if (tokens[i].type === 'function') { // function f() {}
			return true;
		} else if (tokens[i].type === 'monitor') { // monitor M: {}
			return true;
		} else {
			return false;
		}
	}
	function isLoopBlock(tokens, i) {
		if (tokens[i].type === 'loop') return true;
		return false;
	}
	function isClassBlock(tokens, i) {
		return false;
	}

	// unused
	function tokensToItem(tokens, block) {
		var i = 0;
		
		//var ee;
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
			/*ee = new EnvEntry(tokens[i + 1].value);
			ee.setTag(tokens[i].value);
			ee.setName(tokens[i + 2].value);
			if (!block.canAddToEnv(ee)) {
				throw `Cannot declare new ${tokens[i + 1].value}: ${tokens[i + 2].value} (Already declared in this scope).`;
			}*/
			tokens = tokens.splice(3);
		} else if (tokens[i].type === 'primitiveType' || tokens[i].type === 'objectType') { // int x = ...
			if (!tokens[i + 1]) {
				throw "Expected variable name, found EOL.";
			}
			if (tokens[i + 1].type !== 'variableName') {
				throw `Expected variable name, found ${tokens[i + 1].type}.`;
			}
			/*ee = new EnvEntry(tokens[i].value);
			ee.setName(tokens[i + 1].value);
			if (!block.canAddToEnv(ee)) {
				throw `Cannot declare new ${tokens[i].value}: ${tokens[i + 1].value} (Already declared in this scope).`;
			}*/
			tokens = tokens.splice(2);
		} else if (tokens[i].type === 'variableName' && tokens[i + 1].value === '=') { // x = ...
			/*ee = block.getEntry(tokens[i].value);

			if (!ee.canModifyEntry()) {
				throw `Cannot modify value of ${tokens[i].value}: is final`;
			}*/
			tokens = tokens.splice(1);
		} else if (tokens[i].type === 'variableName' && tokens[i + 1].value !== '!=' && tokens[i + 1].value !== '==') { // x++, x+=, etc
			/*ee = block.getEntry(tokens[i].value);

			if (!ee.canModifyEntry()) {
				throw `Cannot modify value of ${tokens[i].value}: is final`;
			}*/
		}

		return null;
	}
}
export default TreeBuilder;