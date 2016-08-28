
QUnit.module('Constructor Tests');
QUnit.test('Constructor is a function', function(assert) {
	assert.ok(typeof Terminator === 'function');
});

QUnit.test('Constructor consumes target element', function(assert) {
	var target = document.createElement('div');
	var main = new Terminator(target);
	
	assert.ok(main instanceof Terminator, 'Constructor produces Terminator Object');
	assert.strictEqual(main.element, target, 'Constructor consumes target element');
	assert.strictEqual(main.element.innerHTML, '', 'Target element default state contains nothing');
});