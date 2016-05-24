//Create a new Terminator instance targeting a DOM element with a configuration.
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
    
    this.programs = {};
    
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

//Register a program to a Terminator instance with a function and name.
Terminator.prototype.register = function(callback, name) {
    this.programs[name] = callback;
}

//Makes a linebreak and then prints text.
Terminator.prototype.writeLine = function(content) {
    this.lineBreak();
    var span = document.createElement('span');
    span.textContent = content;
    this.element.appendChild(span);
    return span;
}

//Makes a linebreak and prints HTML.
Terminator.prototype.writeHTML = function(content) {
    this.lineBreak();
    var div = document.createElement('div');
    div.innerHTML = content;
    this.element.appendChild(div);
    return div;
}

Terminator.prototype.lineBreak = function() {
    var br = document.createElement('br');
    this.element.appendChild(br);
}

//Runs a callback, known program, or produces an error.
Terminator.prototype.run = function(command) {
    this.locked = true;

    //If a callback was provided to the prompt, run it once
    //Note that the callback is responsible for re-prompting when finished
    if (this.callback) {
        this.callback(this, command);
        this.callback = null;
        return;
    }
    
    //Otherwise, search the known programs list
    console.log("No callback for command: " + command);
    var args = command.split(' ');
    if (args[0] && this.programs[args[0]]) {
        console.log("Running registered program " + args[0]);
        this.programs[args[0]](this, command);
        
    } else {
        console.warn("Invalid command: " + command);
        this.writeLine(command + ": command not found");
        this.lineBreak();
        this.prompt();
    }
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
        this.run(this.displayField.textContent);
    }).bind(this), i * 40);
}

Terminator.prototype.prompt = function(prefix, callback) {
    this.hiddenField.value = '';
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