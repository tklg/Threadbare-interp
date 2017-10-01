import Block from './Block.js';
import Environment from '../environment/Environment.js';

class CallableBlock extends Block {
	constructor(parent, env) {
		super(parent, env);
		this.environment = new Environment(env === null ? env : (env || this.env));
	}
}

export default CallableBlock;