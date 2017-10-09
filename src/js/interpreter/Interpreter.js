import Log from './../logger/Log.js';
import Tokenizer from './Tokenizer.js';
import TokenLinker from './TokenLinker.js';
//import TreeBuilder from './TreeBuilder.js';
import ASTBuilder from './ASTBuilder.js';

function Interpreter() {
	const TAG = "Interpreter";
	this.interpret = function(str) {
		return new Promise((resolve, reject) => {
			var tkz = new Tokenizer(str.replace(/\t/g, ''));
			var tkl = new TokenLinker();
			//var trb = new TreeBuilder();
			var ast = new ASTBuilder();
			tkz.parse().then(tokens => {
				//Log.out(TAG, tokens);
				return tkl.link(tokens);
			}).then(linkedTokens => {
				//Log.d(TAG, linkedTokens);
				//return trb.build(linkedTokens);
				return ast.parse(linkedTokens);
			}).then(tree => {
				// environments, and token sequence instructions
				//Log.out(TAG, tree);
				Log.out(TAG, tree);
				resolve(tree);
			}).catch(e => {
				reject(e);
			});
		})
	} 
}
export default Interpreter;