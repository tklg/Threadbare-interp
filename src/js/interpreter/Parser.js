import Log from './../logger/Log.js';
import Tokenizer from './Tokenizer.js';
import TokenLinker from './TokenLinker.js';
//import TreeBuilder from './TreeBuilder.js';
import ASTBuilder from './ASTBuilder.js';
import Eventify from './../Eventify.js';

function Parser() {
	const TAG = "Parser";
	this.interpret = function(str) {
		return new Promise((resolve, reject) => {
			var tkz = new Tokenizer(str.replace(/\t/g, ''));
			var tkl = new TokenLinker();
			//var trb = new TreeBuilder();
			var ast = new ASTBuilder();
			var event = Eventify.getInstance();
			tkz.parse().then(tokens => {
				//Log.d(TAG, tokens);
				event.emit('tokens.parsed');

				// also go over the token list and validate that
				// no definitions happen before the previous one
				// has been closed with a semicolon

				return tkl.link(tokens);
			}).then(linkedTokens => {
				Log.d(TAG, linkedTokens);
				//return trb.build(linkedTokens);
				event.emit('tokens.ready');
				return ast.parse(linkedTokens);
			}).then(tree => {
				// environments, and token sequence instructions
				//Log.out(TAG, tree);
				event.emit('ast.ready');
				Log.out(TAG, tree);
				resolve(tree);
			}).catch(e => {
				reject(e);
			});
		})
	} 
}
export default Parser;