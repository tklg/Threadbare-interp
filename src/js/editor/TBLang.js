export default class TBLang {
  static getTokensProvider() {	
	return {
	  // Set defaultToken to invalid to see what you do not tokenize yet
	  //defaultToken: 'invalid',

	  keywords: [
		'for', 'new', 'switch', 'do',
		'if', 'private', 'this', 'break', 'else', 'public',
		'return', 'static', 'class', 'function', 'thread', 'monitor', 'atomic',
		'const', 'super', 'while', 'true', 'false'
	  ],

	  typeKeywords: [
		'boolean', 'double', 'byte', 'int', 'short', 'char', 'void', 'long', 'float', 'condition'
	  ],

	  operators: [
		'=', '>', '<', '!', '~', '==', '<=', '>=', '!=',
		'&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%',
		'<<', '>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=',
		'%=', '<<=', '>>='
	  ],

	  // we include these common regular expressions
	  symbols:  /[=><!~&|+\-*\/\^%]+/,

	  // C# style strings
	  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

	  // The main tokenizer for our languages
	  tokenizer: {
		root: [
		  // identifiers and keywords
		  [/[a-z_$][\w$]*/, { cases: { '@typeKeywords': 'keyword',
									   '@keywords': 'keyword',
									   '@default': 'identifier' } }],
		  [/[A-Z][\w\$]*/, 'type.identifier' ],  // to show class names nicely

		  // whitespace
		  { include: '@whitespace' },

		  // delimiters and operators
		  [/[{}()\[\]]/, '@brackets'],
		  [/[<>](?!@symbols)/, '@brackets'],
		  [/@symbols/, { cases: { '@operators': 'operator',
								  '@default'  : '' } } ],

		  // @ annotations.
		  // As an example, we emit a debugging log message on these tokens.
		  // Note: message are supressed during the first load -- change some lines to see them.
		  [/@\s*[a-zA-Z_\$][\w\$]*/, { token: 'annotation', log: 'annotation token: $0' }],

		  // numbers
		  [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
		  [/0[xX][0-9a-fA-F]+/, 'number.hex'],
		  [/\d+/, 'number'],

		  // delimiter: after number because of .\d floats
		  [/[;,.]/, 'delimiter'],

		  // strings
		  [/"([^"\\]|\\.)*$/, 'string.invalid' ],  // non-teminated string
		  [/"/,  { token: 'string.quote', bracket: '@open', next: '@string' } ],

		  // characters
		  [/'[^\\']'/, 'string'],
		  [/(')(@escapes)(')/, ['string','string.escape','string']],
		  [/'/, 'string.invalid']
		],

		comment: [
		  [/[^\/*]+/, 'comment' ],
		  [/\/\*/,	'comment', '@push' ],	// nested comment
		  ["\\*/",	'comment', '@pop'  ],
		  [/[\/*]/,   'comment' ]
		],

		string: [
		  [/[^\\"]+/,  'string'],
		  [/@escapes/, 'string.escape'],
		  [/\\./,	  'string.escape.invalid'],
		  [/"/,		{ token: 'string.quote', bracket: '@close', next: '@pop' } ]
		],

		whitespace: [
		  [/[ \t\r\n]+/, 'white'],
		  [/\/\*/,	   'comment', '@comment' ],
		  [/\/\/.*$/,	'comment'],
		],
	  },
	};
  }
  static getDefaultFiles() {
	return [
	  {
		name: 'Semaphore.jtbc',
		content: `class Semaphore {
	private int permissions;
	public Semaphore(int perms) {
		permissions = perms;
	}
	public atomic void acquire() {
		if (permissions > 0) {
			permissions--;
		} else {
			__local_thread_store(__thread_id());
			__thread_sleep();
		}
  }
	public atomic void release() {
		if (__local_thread_count() == 0) {
			permissions++;
		} else {
			String waking = __local_thread_unstore();
			__thread_wake(waking);
		}
	}
}`,
	  },
	  {
		name: 'turnstile.jtbi',
		content: `public Semaphore mutex = new Semaphore(1),
				 m2 = new Semaphore(0);
public int counter = 0;
function turnstile(int id) {
	int temp;
	for (int i = 0; i < 10; i++) {
		mutex.acquire();
		temp = counter;
		counter = temp + 1;
		mutex.release();
	}
	m2.release();
}
thread turnstile(1);
thread turnstile(2);
m2.acquire();
m2.acquire();
print("final count: " + counter);
		`,
	  },
	  {
	  	name: 'DEMO.jtb',
	  	content: `// class definition
class Foo {
	private int x;
	public Foo() {
		print("constructor");
	}
	public void bar(int _x) {
		x = _x;
		print("Foo::bar");
	}
	public void baz() {
		print("baz: " + x);
	}
}

int z = 9;
// function definition
function sum(int x, int y) {
	print(x + y);
}
// function call
sum(1 + 2, 5);

// function-defined thread
thread sum(6, z);

// unlabelled thread
thread {
	print("Unlabelled thread");
	for (int i = 0; i < 5; ++i) {
		print("ULThread: " + i);
	}
}
// labelled thread
thread SomeThread: {
	private Foo foo = new Foo();
	foo.bar(10);
	foo.baz();
}
// parameterized thread
int tpar = 800;
thread ParamThread(tpar): {
	print("ParamThread: " + tpar);
	int i = 10;
	while (i > 0) {
		print("ParamThread: " + i--);
	}
}

if (5 > 100) {
	print("no");
} else if (50 > 6) {
	print("yes");
}`,
	  }
	];
  }
}