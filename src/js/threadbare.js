import Parser from './interpreter/Parser.js';
import Runner from './interpreter/Runner.js';
import Log from './logger/Log.js';

(function() {
	function ThreadBare() {
		const TAG = "ThreadBare";
		var runner = null;
		this.interpret = function(str) {
			var i = new Parser();
			i.interpret(str.trim())
			.then(tree => {
				runner = new Runner(tree);
				Log.d(TAG, runner);

				runner.step();
			});
		}
		this.start = function() {
			if (!runner) return;
			runner.start();
		}
		this.stop = function() {
			if (!runner) return;
			runner.stop();
		}
		this.step = function() {
			if (!runner) return;
			runner.step();
		}
		this.reset = function() {
			runner = null;
		}
	}

	if (module && module.exports) module.ThreadBare = ThreadBare;
	else window.ThreadBare = ThreadBare;
})();
