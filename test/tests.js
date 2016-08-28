QUnit.module('Constructor Tests');
QUnit.test('Constructor is a function', function(assert) {
	assert.ok(typeof Terminator === 'function');
});

QUnit.test('Constructor consumes target element', function(assert) {
	var target = document.createElement('div');
	var main = new Terminator(target);
	
	assert.ok(main instanceof Terminator, 'constructor produces Terminator Object');
	assert.strictEqual(main.element, target, 'constructor consumes target element');
	assert.strictEqual(main.element.innerHTML, '', 'target element default state contains nothing');
});

QUnit.test('Constructor applies optional settings', function(assert) {
	var defaultOptions = {
		alwaysFocus: true,
		autoScroll: true,
		prefix: '~$',
		caret: '_'
	};
	
	var defaultTerm = new Terminator(null, {});
	assert.deepEqual(defaultTerm.config, defaultOptions, 
		'optional settings remain available and unchanged');
	
	var customOptions = {
		alwaysFocus: false,
		autoScroll: false,
		prefix: 'asdf',
		caret: 'jkl;',
		junk: 'trunk'
	};
	
	var customTerm = new Terminator(null, customOptions);
	for (var key in defaultOptions) {
		if (defaultOptions.hasOwnProperty(key)) {
			assert.ok(customTerm.config.hasOwnProperty(key), 
				'custom settings contain default setting: ' + key);
		}
	}
	
	for (var key in customTerm.config) {
		if (customTerm.config.hasOwnProperty(key)) {
			assert.ok(defaultOptions.hasOwnProperty(key), 
				'default settings contain custom setting: ' + key);
			assert.strictEqual(customOptions[key], customTerm.config[key], 
				'custom settings applied for: ' + key);
		}
	}
});

var instance = null;
QUnit.module('Prompt Tests', {
	beforeEach: function(assert) {
		instance = new Terminator(document.getElementById('terminator'));
	}
});
QUnit.test('Prompt is a method', function(assert) {
	assert.ok(typeof instance.prompt === 'function');
});
QUnit.test('Prompt adds a prompt', function(assert) {
	instance.prompt();

	var promptText = document.querySelectorAll('#terminator div:last-child')[0].children;
	console.log(document.querySelectorAll('#terminator div:last-child')[0].innerHTML);
	assert.strictEqual(promptText[0].innerHTML, instance.config.prefix, 
		'prefix is included at beginning of prompt');
	assert.strictEqual(promptText[promptText.length - 1].innerHTML, instance.config.caret, 
		'caret is included at end of prompt');
});