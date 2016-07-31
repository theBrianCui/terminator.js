/* Preserve global scope by wrapping all code in a immediately-executed function */
var Terminator = (function() {
    //Create a new Terminator instance targeting a DOM element with a configuration.
    let Terminator = function(element, config) {
        this.config = {
            alwaysFocus: true,
            autoScroll: true,
            prefix: '~$',
            caret: '_'
        };

        //Override default settings
        for (let setting in config) {
            if (config.hasOwnProperty(setting) && this.config.hasOwnProperty(setting))
                this.config[setting] = config[setting];
        }

        //Setup a text input field to act as the console prompt
        let hiddenField = document.createElement('input');
        hiddenField.setAttribute('type', 'text');
        hiddenField.classList.add('terminator-hidden');
        document.body.appendChild(hiddenField);

        this.element = element; //The DOM node that will become the Terminal.
        this.hiddenField = hiddenField; //The hidden DOM input node that accepts typing input.
        this.displayField = null; //The DOM span node that displays what the user has typed.
        this.activeCaret = null; //The DOM span node that trails the user's input as a caret.
        this.callback = false; //A function that overrides the default program execution.
        this.locked = false; //When locked, user input is disabled.

        //Fill in the prompt value with the hiddenField value
        hiddenField.addEventListener('input', (function() {
            console.log('Typing!');
            if (this.displayField && !this.locked) {
                window.scrollTo(0, document.body.scrollHeight);
                this.displayField.textContent = this.hiddenField.value;
            }
        }).bind(this));

        hiddenField.addEventListener('keydown', (function(e) {
            //Prevent scrolling left and right, which breaks the caret
            //TODO implement a dynamic caret that follows scroll
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

        if (this.config.alwaysFocus) {
            //Prevent the hidden field from being blurred
            hiddenField.addEventListener('blur', (function() {
                setTimeout((function() {
                    let origX = window.scrollX, origY = window.scrollY;
                    this.hiddenField.focus();
                    window.scrollTo(origX, origY);
                }).bind(this), 0);
            }).bind(this), true);
        }

        let programs = {};
        //Register a program to a Terminator instance with a function and name.
        //Also takes an array for registering aliases for a single command.
        this.register = function(callback, name) {
            if (Array.isArray(name)) {
                for (let i = 0; i < name.length; i++) {
                    programs[name[i]] = callback;
                }
                return;
            }
            programs[name] = callback;
        };

        this.canExecute = function(name) {
            return name && programs[name];
        };

        this.execute = function(name, command) {
            return programs[name](this, command);
        }
    };

    //Makes a linebreak and then prints text.
    Terminator.prototype.writeLine = function(content) {
        this.lineBreak();
        let span = document.createElement('span');
        span.textContent = content;
        this.element.appendChild(span);
        return span;
    };

    //Makes a linebreak and prints HTML.
    Terminator.prototype.writeHTML = function(content) {
        this.lineBreak();
        let div = document.createElement('div');
        div.innerHTML = content;
        this.element.appendChild(div);
        return div;
    };

    Terminator.prototype.lineBreak = function() {
        let br = document.createElement('br');
        this.element.appendChild(br);
    };

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

            if (this.config.autoScroll)
                window.scrollTo(0, document.body.scrollHeight);

            return;
        }

        //Otherwise, search the known programs list
        console.log("No callback for command: " + command);
        let args = command.split(' ');
        if (this.canExecute(args[0])) {
            console.log("Running registered program " + args[0]);
            this.execute(args[0], command);

            if (this.config.autoScroll)
                window.scrollTo(0, document.body.scrollHeight);

        } else {
            console.warn("Invalid command: " + command);
            this.writeLine(command + ": command not found");
            this.lineBreak();
            this.prompt();
        }
    };

    //Lock the terminal, and automatically type out, and run, a string.
    Terminator.prototype.autoType = function(command, delay) {
        if (!this.locked) {
            this.locked = true;
            this.displayField.textContent = '';
            delay = delay || 0;

            let funcs = [];
            for (let i = 0; i < command.length; i++) {
                funcs[i] = (function(index) {
                    return (function() {
                        this.displayField.textContent += command[index];
                    }).bind(this);
                }).call(this, i);
            }

            for (let i = 0; i < command.length; i++) {
                setTimeout(funcs[i], i * 50 + delay);
            }

            setTimeout((function() {
                this.run(this.displayField.textContent);
            }).bind(this), command.length * 50 + 100 + delay);
        } else {
            console.warn("Terminal currently locked, cannot auto-type command: " + command);
        }
    };

     /* Build and display the prompt element, then accept input.
     * If a callback is provided, save it for the run command. */
    Terminator.prototype.prompt = function(prefix, callback) {
        this.hiddenField.value = '';

        let promptWrapper = document.createElement('span');
        promptWrapper.innerHTML = prefix || this.config.prefix;
        let commandWrapper = document.createElement('span');
        let caretWrapper = document.createElement('span');
        caretWrapper.textContent = this.config.caret;
        caretWrapper.classList.add('terminator-blink');

        /* Append elements to the Terminal in the following order:
            prompt, command, caret */
        this.element.appendChild(promptWrapper);
        this.element.appendChild(commandWrapper);
        this.element.appendChild(caretWrapper);

        this.displayField = commandWrapper;
        this.activeCaret = caretWrapper;
        this.callback = callback || null;
        this.locked = false;
        this.hiddenField.focus();

        if (this.config.autoScroll) {
            window.scrollTo(0, document.body.scrollHeight);
        }
    };

    return Terminator;
})();
