var Terminator = function(element, config) {
    var hiddenField = document.createElement('input');
    hiddenField.setAttribute('type', 'text');
    hiddenField.style.opacity = 0;
    document.body.appendChild(hiddenField);
    
    this.element = element;
    this.hiddenField = hiddenField;
    this.config = config || {};
    
    this.displayField = null;
    this.callback = false;
    this.locked = false;
    
    hiddenField.addEventListener('input', (function() {
        console.log('Typing!');
        if (this.displayField && !this.locked) {
            this.displayField.textContent = this.hiddenField.value;
        }
    }).bind(this));
    
    hiddenField.addEventListener('keydown', (function(e) {
        if ((e.key == 13 || e.keyCode == 13) && !this.locked) {
            console.log("Enter key pressed!");
            this.run(this.displayField.textContent);
        }
    }).bind(this));
    
    if (config.alwaysFocus) {
        hiddenField.addEventListener('blur', (function() {
            setTimeout((function() {this.hiddenField.focus();}).bind(this), 0);
        }).bind(this), true);
    }
};

Terminator.prototype.lineBreak = function() {
    var br = document.createElement('br');
    this.element.appendChild(br);
}

Terminator.prototype.run = function(command) {
    this.locked = true;
    this.lineBreak();
    
    console.log("Just tried to run: " + command);
    
    this.hiddenField.value = '';
    this.locked = false;
    this.prompt();
}

Terminator.prototype.autoType = function(command) {
    this.locked = true;
    this.displayField.textContent = '';
    
    var funcs = [];
    for (var i = 0; i < command.length; i++) {
        funcs[i] = (function(index) {
            return (function() {
                this.displayField.textContent += command[index];
            }).bind(this);
        }).call(this, i);
    }
    
    for (var i = 0; i < command.length; i++) {
        setTimeout(funcs[i], i * 40);
    }
    
    setTimeout((function() {
        //this.locked = false;
        this.callback ? this.callback(this, this.displayField.textContent) : this.run(this.displayField.textContent);
    }).bind(this), i * 40);
}

Terminator.prototype.prompt = function(prefix, callback) {
    prefix = prefix || this.config.prefix || '~$';
    
    var promptWrapper = document.createElement('span');
    promptWrapper.innerHTML = prefix;
    var commandWrapper = document.createElement('span');
    
    this.element.appendChild(promptWrapper);
    this.element.appendChild(commandWrapper);
    this.displayField = commandWrapper;
    this.callback = callback || null;
    this.locked = false;
    this.hiddenField.focus();
}