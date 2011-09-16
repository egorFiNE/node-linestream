LineStream = require('../index');

exports['check two lines'] = function(test) {
	test.expect(3);
	
	var ls = new LineStream();
	ls.on('lines', function(lines) {
		test.equal(lines.length, 2, 'length');
		test.equal(lines[0], 'sirko')
		test.equal(lines[1], 'vasya')
		test.done();
	});
	ls.emit('data', "sirko\r\nvasya\r\n");
};

exports['check one line'] = function(test) {
	test.expect(2);
	
	var ls = new LineStream();
	ls.on('lines', function(lines) {
		test.equal(lines.length, 1, 'length');
		test.equal(lines[0], 'sirko')
		test.done();
	});
	ls.emit('data', "sirko\r\n");
};

exports['check no lines'] = function(test) {
	test.expect(1);
	
	var ls = new LineStream();
	ls.on('lines', function(lines) {
		test.ok(false, "should not emit");
	});
	ls.emit('data', "");
	setTimeout(function() {
		test.ok(true, "done");
		test.done();
	}, 50);
};

exports['check non-eoled last line'] = function(test) {
	test.expect(2);
	
	var ls = new LineStream();
	ls.on('lines', function(lines) {
		test.equal(lines.length, 1, 'length');
		test.equal(lines[0], 'sirko')
		test.done();
	});
	ls.emit('data', "sirko\r\nvasya");
};

exports['check non-eoled last line and addition'] = function(test) {
	test.expect(4);
	
	var ls = new LineStream();
	ls.on('lines', function(lines) {
		test.equal(lines.length, 1, 'length');
		test.equal(lines[0], 'sirko')
	});
	ls.emit('data', "sirko\r\nva");
	ls.removeAllListeners('lines');
	
	ls.on('lines', function(lines) {
		test.equal(lines.length, 1, 'length');
		test.equal(lines[0], 'vasya')
		test.done();
	});
	ls.emit('data', "sya\r\n");
	ls.removeAllListeners('lines');
};

exports['check line break in the middle'] = function(test) {
	test.expect(2);
	
	var ls = new LineStream();
	ls.on('lines', function(lines) {
		test.ok(false, "Should not emit here");
	});
	ls.emit('data', "sirko");
	ls.removeAllListeners('lines');
	
	ls.on('lines', function(lines) {
		test.equal(lines.length, 1, 'length');
		test.equal(lines[0], 'sirko')
		test.done();
	});
	ls.emit('data', "\r\n");
	ls.removeAllListeners('lines');
};

exports['cutFromRight'] = function(test) {
	var cutFromRight = LineStream._cutFromRight; // HACK

	test.expect(7);
	test.deepEqual(cutFromRight("sirko\n"),['sirko','']);
	test.deepEqual(cutFromRight("sirko\nvasya"), ['sirko','vasya']);
	test.deepEqual(cutFromRight("sirko\nvasya\n"), ["sirko\nvasya", '']);
	test.deepEqual(cutFromRight("sirko\nvasya\npetya"), ["sirko\nvasya", "petya"]);
	test.deepEqual(cutFromRight("\nlena"), ["", "lena"]);
	test.deepEqual(cutFromRight(""), ["", ""]);
	test.deepEqual(cutFromRight("\n"), ["", ""]);
	test.done();
}
