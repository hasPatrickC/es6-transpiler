const utils = require('../utils');
utils.getES5Module('RegExp');

exports["'y' flag"] = {
	"sticky/global property": function(test) {
		var regex_y = new RegExp("^(\\S+) line\\n?", "y");
		var regex_g = new RegExp("^(\\S+) line\\n?", "g");
		var regex_raw = /(1)/;

		test.ok(regex_y["sticky"]);
		test.equal(regex_y.global, false);
		test.equal(regex_g.global, true);
		test.equal(regex_g["sticky"], false);
		test.equal(regex_raw["sticky"], false);
		test.done();
	},
	"instanceof": function(test) {
		var regex_y = new RegExp("^(\\S+) line\\n?", "y");
		var regex_yg = new RegExp("^(\\S+) line\\n?", "yg");
		var regex_g = new RegExp("^(\\S+) line\\n?", "g");
		var regex_raw = /(1)/;

		test.ok(regex_y instanceof RegExp);
		test.ok(regex_yg instanceof RegExp);
		test.ok(regex_g instanceof RegExp);
		test.ok(regex_raw instanceof RegExp);
		test.done();
	},
	"RegExp#exec": {
		"without 'g' flag": function(test) {
			var text = "First line\nSecond line";
			var regex = new RegExp("^(\\S+) line\\n?", "y");

			var match = regex.exec(text);
			test.equal(match[1], "First");
			test.equal(regex.lastIndex, 11);

			var match2 = regex.exec(text);
			test.equal(match2[1], "Second");
			test.equal(regex.lastIndex, 22);

			var match3 = regex.exec(text);
			test.equal(match3, null);
			test.equal(regex.lastIndex, 0);
			test.done();
		},

		"with 'g' flag": function(test) {
			var text = "First line\nSecond line";
			var regex = new RegExp("^(\\S+) line\\n?", "gy");

			var match = regex.exec(text);
			test.equal(match[1], "First");
			test.equal(regex.lastIndex, 11);

			var match2 = regex.exec(text);
			test.equal(match2[1], "Second");
			test.equal(regex.lastIndex, 22);

			var match3 = regex.exec(text);
			test.equal(match3, null);
			test.equal(regex.lastIndex, 0);
			test.done();
		}
	},
	"RegExp#test": {
		"without 'g' flag": function(test) {
			var text = "First line\nSecond line";
			var regex = new RegExp("^(\\S+) line\\n?", "y");

			var match = regex.test(text);
			test.equal(match, true);
			test.equal(regex.lastIndex, 11);

			var match2 = regex.test(text);
			test.equal(match2, true);
			test.equal(regex.lastIndex, 22);

			var match3 = regex.test(text);
			test.equal(match3, false);
			test.equal(regex.lastIndex, 0);
			test.done();
		},

		"with 'g' flag": function(test) {
			var text = "First line\nSecond line";
			var regex = new RegExp("^(\\S+) line\\n?", "gy");

			var match = regex.test(text);
			test.equal(match, true);
			test.equal(regex.lastIndex, 11);

			var match2 = regex.test(text);
			test.equal(match2, true);
			test.equal(regex.lastIndex, 22);

			var match3 = regex.test(text);
			test.equal(match3, false);
			test.equal(regex.lastIndex, 0);
			test.done();
		}
	},
	"RegExp[leftContext/rightContext]": function(test) {
		var re = (new RegExp("(1)", "y"));

		var expect1 = 'captures: 1,1; RegExp.leftContext: ""; RegExp.rightContext: "234561"';
		var actual1 = 'captures: ' + re.exec('1234561') +
			'; RegExp.leftContext: "' + RegExp.leftContext +
			'"; RegExp.rightContext: "' + RegExp.rightContext + '"';

		/1/.test("212");
		test.equal(RegExp.leftContext, "2");
		test.equal(RegExp.rightContext, "2");

		var expect2 = 'captures: null; RegExp.leftContext: "2"; RegExp.rightContext: "2"';
		var actual2 = 'captures: ' + re.exec('1234561') +
			'; RegExp.leftContext: "' + RegExp.leftContext +
			'"; RegExp.rightContext: "' + RegExp.rightContext + '"';

		/2/.test("323");
		test.equal(RegExp.leftContext, "3");
		test.equal(RegExp.rightContext, "3");

		test.equal(expect1, actual1);
		test.equal(expect2, actual2);

		re = (new RegExp("(1)", "y"));
		var expect3 = 'captures: 1,1; RegExp.leftContext: ""; RegExp.rightContext: "123456"';
		var actual3 = 'captures: ' + re.exec('1123456') +
			'; RegExp.leftContext: "' + RegExp.leftContext +
			'"; RegExp.rightContext: "' + RegExp.rightContext + '"';

		/3/.test("434");
		test.equal(RegExp.leftContext, "4");
		test.equal(RegExp.rightContext, "4");

		var expect4 = 'captures: 1,1; RegExp.leftContext: "1"; RegExp.rightContext: "23456"';
		var actual4 = 'captures: ' + re.exec('1123456') +
			'; RegExp.leftContext: "' + RegExp.leftContext +
			'"; RegExp.rightContext: "' + RegExp.rightContext + '"';

		test.equal(expect3, actual3);
		test.equal(expect4, actual4);

		/4/.test("545");
		test.equal(RegExp.leftContext, "5");
		test.equal(RegExp.rightContext, "5");
		test.done();
	},

	"String#match": {
		"without 'g' flag": function(test) {
			var string = 'aaaaBCaaaa';
			var match = string.match((new RegExp("(a)", "y")));

			test.equal(match.length, 2);
			test.equal(match.index, 0);
			test.equal(match[0], 'a');
			test.equal(match[1], 'a');
			test.done();
		},

		"with 'g' flag": function(test) {
			var string = 'aaaaBCaaaa';
			var match = string.match((new RegExp("(a)", "gy")));

			test.equal(match.length, 4);
			test.equal(match[0], 'a');
			test.equal(match[1], 'a');
			test.equal(match[2], 'a');
			test.equal(match[3], 'a');
			test.done();
		}
	},

	"String#replace": {
		"string - without 'y', without 'g' flag": function(test) {
			var string = "!i123i-!ighhgi-!i999[88[77]]i-!i097";

			test.equal(string.replace(new RegExp("!i(.*?)i", ""), "$0$00$001$$1"), "$0$00$001$1-!ighhgi-!i999[88[77]]i-!i097");
			test.equal(string.replace(new RegExp("!i(.*?)i", ""), "$1"), "123-!ighhgi-!i999[88[77]]i-!i097");
			test.equal(string.replace(new RegExp("!i(.*?)i", ""), "($$&$&)"), "($&!i123i)-!ighhgi-!i999[88[77]]i-!i097");
			test.equal(string.replace(new RegExp("!i(.*?)i", ""), "($&)"), "(!i123i)-!ighhgi-!i999[88[77]]i-!i097");
			test.equal(string.replace(new RegExp("!i(.*?)i", ""), "($')"), "(-!ighhgi-!i999[88[77]]i-!i097)-!ighhgi-!i999[88[77]]i-!i097");
			test.equal(string.replace(new RegExp("!i(.*?)i", ""), "($`)"), "()-!ighhgi-!i999[88[77]]i-!i097");
			test.done();
		},
		"string - without 'y', with 'g' flag": function(test) {
			var string = "!i123i-!ighhgi-!i999[88[77]]i-!i097";

			test.equal(string.replace(new RegExp("!i(.*?)i", "g"), "$0$00$001$$1"), "$0$00$001$1-$0$00$001$1-$0$00$001$1-!i097");
			test.equal(string.replace(new RegExp("!i(.*?)i", "g"), "$1"), "123-ghhg-999[88[77]]-!i097");
			test.equal(string.replace(new RegExp("!i(.*?)i", "g"), "($$&$&)"), "($&!i123i)-($&!ighhgi)-($&!i999[88[77]]i)-!i097");
			test.equal(string.replace(new RegExp("!i(.*?)i", "g"), "($&)"), "(!i123i)-(!ighhgi)-(!i999[88[77]]i)-!i097");
			test.equal(string.replace(new RegExp("!i(.*?)i", "g"), "($')"), "(-!ighhgi-!i999[88[77]]i-!i097)-(-!i999[88[77]]i-!i097)-(-!i097)-!i097");
			test.equal(string.replace(new RegExp("!i(.*?)i", "g"), "($`)"), "()-(!i123i-)-(!i123i-!ighhgi-)-!i097");
			test.done();
		},

		"string - without 'g' flag": function(test) {
			var string = "!i123i!ighhgi!i999[88[77]]i!i097";

			test.equal(string.replace(new RegExp("!i(.*?)i", "y"), "$0$00$001$$1"), "$0$00$001$1!ighhgi!i999[88[77]]i!i097");
			test.equal(string.replace(new RegExp("!i(.*?)i", "y"), "$1"), "123!ighhgi!i999[88[77]]i!i097");
			test.equal(string.replace(new RegExp("!i(.*?)i", "y"), "($$&$&)"), "($&!i123i)!ighhgi!i999[88[77]]i!i097");
			test.equal(string.replace(new RegExp("!i(.*?)i", "y"), "($&)"), "(!i123i)!ighhgi!i999[88[77]]i!i097");
			test.equal(string.replace(new RegExp("!i(.*?)i", "y"), "($')"), "(!ighhgi!i999[88[77]]i!i097)!ighhgi!i999[88[77]]i!i097");
			test.equal(string.replace(new RegExp("!i(.*?)i", "y"), "($`)"), "()!ighhgi!i999[88[77]]i!i097");

			string = "!i123i-!ighhgi-!i999[88[77]]i-!i097";
			test.equal(string.replace(new RegExp("!i(.*?)i", "y"), "$1"), "123-!ighhgi-!i999[88[77]]i-!i097");
			test.done();
		},
		"function - without 'g' flag": function(test) {
			var string = "!i123i!ighhgi!i999[88[77]]i!i097";
			var count = 0, results = [];
			var lastIndexes = [];
			var re = new RegExp("!i(.*?)i", "y");
			
			re.lastIndex = 6;
			var result = string.replace(re, function(found, $1, offset, str) {
				lastIndexes.push(re.lastIndex);
				count++;
				results.push({found: found, group1: $1, offset: offset, str: str});
				return "(" + $1 + ")"
			});

			test.equal(re.lastIndex, 6);
			test.equal(result, "(123)!ighhgi!i999[88[77]]i!i097");
			test.deepEqual(results, [
				{ "found":"!i123i", "group1":"123", "offset":0, "str":"!i123i!ighhgi!i999[88[77]]i!i097" }
			]);
			test.deepEqual(lastIndexes, [6]);
			test.done();
		},

		"string - with 'g' flag": function(test) {
			var string = "!i123i!ighhgi!i999[88[77]]i!i097";

			test.equal(string.replace(new RegExp("!i(.*?)i", "gy"), "$0$00$001$$1"), "$0$00$001$1$0$00$001$1$0$00$001$1!i097");
			test.equal(string.replace(new RegExp("!i(.*?)i", "gy"), "$1"), "123ghhg999[88[77]]!i097");
			test.equal(string.replace(new RegExp("!i(.*?)i", "gy"), "($$&$&)"), "($&!i123i)($&!ighhgi)($&!i999[88[77]]i)!i097");
			test.equal(string.replace(new RegExp("!i(.*?)i", "gy"), "($&)"), "(!i123i)(!ighhgi)(!i999[88[77]]i)!i097");
			test.equal(string.replace(new RegExp("!i(.*?)i", "gy"), "($')"), "(!ighhgi!i999[88[77]]i!i097)(!i999[88[77]]i!i097)(!i097)!i097");
			test.equal(string.replace(new RegExp("!i(.*?)i", "gy"), "($`)"), "()(!i123i)(!i123i!ighhgi)!i097");

			string = "!i123i-!ighhgi-!i999[88[77]]i-!i097";
			test.equal(string.replace(new RegExp("!i(.*?)i", "gy"), "$1"), "123-!ighhgi-!i999[88[77]]i-!i097");
			test.done();
		},
		"function - with 'g' flag": function(test) {
			var string = "!i123i!ighhgi!i999[88[77]]i!i097";
			var count = 0, results = [];
			//TODO:: var lastIndexes = [];
			var re = new RegExp("!i(.*?)i", "gy");			

			// String.match and String.replace now reset RegExp.lastIndex
			// [https://bugzilla.mozilla.org/show_bug.cgi?id=501739](Bug 501739 � String match and replace methods do not update global regexp lastIndex per ES3&5)
			// The String.match and String.replace methods have been refactored to resolve a spec conformance issue on RegExp.lastIndex. When those methods are called with a global regular expression, the lastIndex, if specified, will be reset to 0.
			re.lastIndex = 6;
			var result = string.replace(re, function(found, $1, offset, str) {
				//TODO:: lastIndexes.push(re.lastIndex);
				count++;
				results.push({found: found, group1: $1, offset: offset, str: str});
				return "(" + $1 + ")"
			});

			test.equal(re.lastIndex, 0);
			test.equal(result, "(123)(ghhg)(999[88[77]])!i097");
			test.deepEqual(results, [
				{ "found":"!i123i", "group1":"123", "offset":0, "str":"!i123i!ighhgi!i999[88[77]]i!i097" }
				,{ "found":"!ighhgi", "group1":"ghhg", "offset":6, "str":"!i123i!ighhgi!i999[88[77]]i!i097" }
				,{ "found":"!i999[88[77]]i", "group1":"999[88[77]]", "offset":13, "str":"!i123i!ighhgi!i999[88[77]]i!i097" }
			]);
			//TODO:: test.deepEqual(lastIndexes, [0, 0, 0]);
			test.done();
		}
	}
};

exports["'u' flag"] = {
	"unicode property": function(test) {
		var regex_u = new RegExp("foo.bar", "u");
		var regex_no_u = new RegExp("foo.bar", "");

		test.equal(regex_u["unicode"], true);
		test.equal(regex_no_u["unicode"], false);
		test.done();
	},

	"instanceof": function(test) {
		var regex_u1 = /💫{2}/u;
		var regex_u2 = new RegExp("[💩-💫]", "u");
		var regex_raw = /(1)/;

		test.ok(regex_u1 instanceof RegExp);
		test.ok(regex_u2 instanceof RegExp);
		test.ok(regex_raw instanceof RegExp);
		test.done();
	},

	"patterns transpiling": function(test) {
		test.ok((new RegExp("H[\\uD83D\\uDCA0-\\uD83D\\uDCAB]", "u")).test('H\uD83D\uDCA9'));
		test.ok((new RegExp("H[a-\uD83D\uDCAB]A", "u")).test('H\uD83D\uDCA9A'));
		test.ok(/foo.bar/u.test('foo\uD83D\uDCA9bar'));
		// TODO:: test.ok((new RegExp("foo1.bar1", "u")).test('foo1\uD83D\uDCA9bar1'));
		test.ok(/foo\Sbar/u.test('foo\uD83D\uDCA9bar'));
		// TODO:: test.ok((new RegExp("foo1\\Sbar1", "u")).test('foo1\uD83D\uDCA9bar1'));
		test.ok(/foo\Wbar/u.test('foo\uD83D\uDCA9bar'));
		// TODO:: test.ok((new RegExp("foo1\\Wbar1", "u")).test('foo1\uD83D\uDCA9bar1'));
		test.ok(/foo\Dbar/u.test('foo\uD83D\uDCA9bar'));
		// TODO:: test.ok((new RegExp("foo1\\Dbar1", "u")).test('foo1\uD83D\uDCA9bar1'));
		//TODO:: more

		test.done();
	},

	"RegExp#toString": function(test) {
		test.equal(String(new RegExp("H[\\uD83D\\uDCA0-\\uD83D\\uDCAB]", "u")), "/H[\\uD83D\\uDCA0-\\uD83D\\uDCAB]/u");
		test.equal(String(new RegExp("H[a-\uD83D\uDCAB]A", "u")), "/H[a-\uD83D\uDCAB]A/u");
		test.equal(String(/foo.bar/ug), "/foo.bar/gu");
		// TODO:: test.equal((new RegExp("foo1.bar1", "u")));
		test.equal(String(/foo\Sbar/ug), "/foo\\Sbar/gu");
		// TODO:: test.equal((new RegExp("foo1\\Sbar1", "u")));
		test.equal(String(/foo\Wbar/ug), "/foo\\Wbar/gu");
		// TODO:: test.equal((new RegExp("foo1\\Wbar1", "u")));
		test.equal(String(/foo\Dbar/ug), "/foo\\Dbar/gu");
		// TODO:: test.equal((new RegExp("foo1\\Dbar1", "u")));

		test.done();
	},

	"RegExp#source": function(test) {
		test.equal((new RegExp("H[\\uD83D\\uDCA0-\\uD83D\\uDCAB]", "u")).source, "H\\uD83D[\\uDCA0-\\uDCAB]");
		test.equal((new RegExp("H[a-\uD83D\uDCAB]A", "u")).source, "H(?:[a-\\uD7FF\\uDC00-\\uFFFF]|[\\uD800-\\uD83C][\\uDC00-\\uDFFF]|\\uD83D[\\uDC00-\\uDCAB]|[\\uD800-\\uDBFF])A");
		test.equal((/foo.bar/ug).source, "foo(?:[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]|.)bar");
		// TODO:: test.equal((new RegExp("foo1.bar1", "u")));
		test.equal((/foo\Sbar/ug).source, "foo(?:[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]|\\S)bar");
		// TODO:: test.equal((new RegExp("foo1\\Sbar1", "u")));
		test.equal((/foo\Wbar/ug).source, "foo(?:[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]|\\W)bar");
		// TODO:: test.equal((new RegExp("foo1\\Wbar1", "u")));
		test.equal((/foo\Dbar/ug).source, "foo(?:[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]|\\D)bar");
		// TODO:: test.equal((new RegExp("foo1\\Dbar1", "u")));

		test.done();
	},

	"RegExp#test": function(test) {
		/*first*/test.equal((new RegExp("[💩-💫]", "u")).test('\uD83D\uDCAB'), true); // match U+1F4AB

		test.equal((new RegExp("[\uD83D\uDCA9-\uD83D\uDCAB]", "u")).test('\uD83D\uDCA9'), true); // match U+1F4A9
		test.equal((new RegExp("[\\uD83D\\uDCA9-\\uD83D\\uDCAB]", "u")).test('\uD83D\uDCA9'), true); // match U+1F4A9

		test.equal((new RegExp("\uD83D[\uDCA9-\uDCAB]", "u")).test('\uD83D\uDCAA'), true); // match U+1F4AA
		test.equal((new RegExp("\\uD83D[\\uDCA9-\\uDCAB]", "u")).test('\uD83D\uDCAA'), true); // match U+1F4AA

		/*second*/test.equal((new RegExp("[💩-💫]", "u")).test('\uD83D\uDCAB'), true); // match U+1F4AB

		test.equal((new RegExp("/OR[\u0001-\uD83D\uDCAB]|[a-\uD83D\uDCAB]", "u")).test('OR\uD83D\uDCA9'), true);
		test.equal((new RegExp("/OR[\\u0001-\\uD83D\\uDCAB]|[a-\\uD83D\\uDCAB]", "u")).test('ORa'), true);

		test.done();

		// TODO:: (new RegExp("[A-Za-z\u00C0-00D6\u00D8-\u00F6\u00F8-\u01BA]", "u")).test('A')
	},

	"es6 codePoint escape form": function(test) {
		let re = /A💫{2}A/u;
		test.equal(re.test('A💫' + '💫A'), true);
		re = /B\u{1F4AB}{2}B/u;
		test.equal(re.test('B\u{1F4AB}\u{1F4AB}B'), true);

		test.done();
	},

//	"RegExp#exec": function(test) {
//		//TODO::
//	},
//
//	"String#match": function(test) {
//		//TODO::
//	},
//
//	"String#replace": function(test) {
//		//TODO::
//	}
};
