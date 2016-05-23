var Terminator = function(element, config) {
    var hiddenField = document.createElement('input');
    hiddenField.setAttribute('type', 'text');
    hiddenField.style.opacity = 0;
    document.body.appendChild(hiddenField);
    
    this.element = element;
    this.hiddenField = hiddenField;
    this.config = config || {};
    this.displayField = null;
    
    hiddenField.addEventListener('input', (function() {
        console.log('Typing!');
        if (this.displayField) {
            this.displayField.textContent = this.hiddenField.value;
        }
    }).bind(this));
    
    hiddenField.addEventListener('keydown', (function(e) {
        if (e.key == 13 || e.keyCode == 13) {
            console.log("Enter key pressed!");
            this.lineBreak();
            this.hiddenField.value = '';
            this.prompt();
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

Terminator.prototype.prompt = function(prefix) {
    prefix = prefix || this.config.prefix || '~$';
    var promptWrapper = document.createElement('span');
    promptWrapper.innerHTML = prefix;
    var commandWrapper = document.createElement('span');
    
    this.element.appendChild(promptWrapper);
    this.element.appendChild(commandWrapper);
    this.displayField = commandWrapper;
    
    this.hiddenField.focus();
}