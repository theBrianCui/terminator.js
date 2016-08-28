QUnit.test("Constructor Tests", function(assert) {
	assert.ok(typeof Terminator === 'function');
	
	var target = document.createElement('div');
	var main = new Terminator(target);
	assert.ok(main instanceof Terminator);
	assert.strictEqual(main.element, target);
	assert.strictEqual(main.element.innerHTML, '');
});