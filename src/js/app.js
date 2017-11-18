import ThreadBare from './Threadbare.js';

(function() {
	var b;
	init();
	document.getElementById('step').addEventListener('click', function(e) {
		b.step();
	});
	document.getElementById('run').addEventListener('click', function(e) {
		if (b.isDone()) {
			b = null;
			init();
		}
		b.start();
	});
	function init() {
		b = new ThreadBare();
		b.on('any', handle);
		b.interpret(document.getElementById('e').value, 'random');
	}
	function handle(ev, val) {
		if (ev.indexOf('error') > -1) {
			console.error(ev +" : " + val);
			return;
		}
		switch (ev) {
			case 'stdout': return console.info(ev +" : %c" + val, 'color:#9977ee');
			case 'stderr': return console.error(ev +" : " + val);
			default: return console.log(ev +" : %c" + val, 'color:#888');
		}
	}
})();