//Create a new Terminator instance targeting a DOM element with a configuration.
var Terminator = function(element, config) {
    var hiddenField = document.createElement('input');
    hiddenField.setAttribute('type', 'text');
    hiddenField.classList.add('terminator-hidden');
    document.body.appendChild(hiddenField);
    
    this.element = element;
    this.hiddenField = hiddenField;
    this.config = config || {};
    
    this.displayField = null;
    this.activeCaret = null;
    this.callback = false;
    this.locked = false;
    
    this.programs = {};
    
    hiddenField.addEventListener('input', (function() {
        console.log('Typing!');
        if (this.displayField && !this.locked) {
            window.scrollTo(0, document.body.scrollHeight);
            this.displayField.textContent = this.hiddenField.value;
        }
    }).bind(this));
    
    hiddenField.addEventListener('keydown', (function(e) {
        //Prevent scrolling left and right
        if (((e.key == 37) || (e.keyCode == 37)) || ((e.key == 39) || (e.keyCode == 39))) {
            e.preventDefault();
            return;
        }
        
        if ((e.key == 13 || e.keyCode == 13) && !this.locked) {
            console.log("Enter key pressed!");
            window.scrollTo(0, document.body.scrollHeight);
            this.run(this.displayField.textContent);
        }
    }).bind(this));
    
    if (config.alwaysFocus) {
        hiddenField.addEventListener('blur', (function() {
            setTimeout((function() {
                var origX = window.scrollX, origY = window.scrollY;
                this.hiddenField.focus();
                window.scrollTo(origX, origY);
            }).bind(this), 0);
        }).bind(this), true);
    }
};

//Register a program to a Terminator instance with a function and name.
//Also takes an array for registering aliases for a single command.
Terminator.prototype.register = function(callback, name) {
	if (Array.isArray(name)) {
		for (var i = 0; i < name.length; i++) {
			this.programs[name[i]] = callback;
		}
		return;
	}
	
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
    this.activeCaret.style.display = 'none';
    this.activeCaret = null;
    
    //If nothing entered, return nothing
    if (!command) {
        this.lineBreak();
        this.prompt();
        return;
    }

    //If a callback was provided to the prompt, run it once
    //Note that the callback is responsible for re-prompting when finished
    if (this.callback) {
        this.callback(this, command);
        this.callback = null;
        window.scrollTo(0, document.body.scrollHeight);
        return;
    }
    
    //Otherwise, search the known programs list
    console.log("No callback for command: " + command);
    var args = command.split(' ');
    if (args[0] && this.programs[args[0]]) {
        console.log("Running registered program " + args[0]);
        this.programs[args[0]](this, command);
        window.scrollTo(0, document.body.scrollHeight);
    } else {
        console.warn("Invalid command: " + command);
        this.writeLine(command + ": command not found");
        this.lineBreak();
        this.prompt();
    }
}

Terminator.prototype.autoType = function(command, delay) {
	if (!this.locked) {
		this.locked = true;
		this.displayField.textContent = '';
		delay = delay || 0;
		
		var funcs = [];
		for (var i = 0; i < command.length; i++) {
			funcs[i] = (function(index) {
				return (function() {
					this.displayField.textContent += command[index];
				}).bind(this);
			}).call(this, i);
		}
		
		for (var i = 0; i < command.length; i++) {
			setTimeout(funcs[i], i * 50 + delay);
		}
		
		setTimeout((function() {
			this.run(this.displayField.textContent);
		}).bind(this), i * 50 + 100 + delay);
	} else {
		console.warn("Terminal currently locked, cannot auto-type command: " + command);
	}
}

Terminator.prototype.prompt = function(prefix, callback) {
    this.hiddenField.value = '';
    
    var promptWrapper = document.createElement('span');
    promptWrapper.innerHTML = prefix || this.config.prefix || '~$';
    var commandWrapper = document.createElement('span');
    var caretWrapper = document.createElement('span');
    caretWrapper.textContent = this.config.caret || '_';
    caretWrapper.classList.add('terminator-blink');
    
    this.element.appendChild(promptWrapper);
    this.element.appendChild(commandWrapper);
    this.element.appendChild(caretWrapper);
    
    this.displayField = commandWrapper;
    this.activeCaret = caretWrapper;
    this.callback = callback || null;
    this.locked = false;
    this.hiddenField.focus();
    window.scrollTo(0, document.body.scrollHeight);
}