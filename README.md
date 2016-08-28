terminator.js
=============

terminator.js is a tiny dependency-free library for building text terminal like interfaces for the browser. See it in action on the [Information & Systems Security Society website](https://www.isss.io/), also on [GitHub](https://github.com/theBrianCui/ISSS_webShell).

## Usage

Drop the JS + CSS into your website to access terminator.js. The latest build can always be found in the `dist/` folder of the GitHub repository.

    <link rel="stylesheet" type="text/css" href="terminator.css">
    <script src="terminator.js"></script>
    
The script exposes a `Terminator` constructor with which takes two parameters: a DOM element (such as a `div`) and a configuration Object. Example:

    var config = {
            alwaysFocus: true, 	//Prevents the user from blurring the terminal input.
            autoScroll: true, 	//Automatically scrolls to the bottom when typing or executing commands.
            prefix: '~$', 		//The prefix character in front of the prompt.
            caret: '_'			//The caret symbol in the input field.
    };
    var targetNode = document.getElementById('some-dom-id');
    var theTerminator = new Terminator(targetNode, config);
    
Register some functions:

	//Print everything that comes after 'echo'
	main.register(function(term, command) {
	    term.writeLine(command.split(' ').slice(1).join(' '));
	    term.prompt();
	}, 'echo');

Then, whenever you're ready to accept commands, call

    theTerminator.prompt();
	
## API

#### `register(callback, name)`

Registers a standard JS function under the command `name`. An array of multiple names can be provided to serve as aliases. 

When the user types in the provided name into the prompt and presses the enter key, the `callback` is executed. The `callback` function will be called with two arguments: the terminal object, and the entire command string. The following example is a basic `echo` function:

	//Print everything that comes after 'echo'
	main.register(function(term, command) {
	    term.writeLine(command.split(' ').slice(1).join(' '));
	    term.prompt();
	}, 'echo');

The first argument (terminal) provides access to the rest of the API within the function itself. In the above case, `term === main`. 

The second argument (command) contains the entire string that the user typed into the prompt. If the user types `echo bananas` in the prompt and presses enter, `command === 'echo bananas'`.

#### `.prompt([prefix=''], [callback=undefined])`

Prompts the user for input. When the user presses enter, the terminal finds the function registered with the corresponding name to the first argument typed and executes that function. See above for details on how to register functions.

An optional `prefix` string can be provided as the first argument to override the default prefix defined in the configuration options. An optional `callback` second argument can be provided to override the function executed after the user presses the enter key.

#### `.autoType(command, [delay=0])`

Automatically types a string `command` into the prompt, letter by letter, to simulate human typing. When auto-typing finishes, the command executes. An optional `delay` parameter can be provided to delay (in ms) the insertion of the first character.

When `.autoType` is called, the contents of the terminal are cleared (reset) and user input is ignored.

#### `.writeLine(text)`

Inserts text (will be escaped) in a `span` and a newline (`br`) into the terminal.

#### `.writeHTML(content)`

Inserts a `div` with the `innerHTML` set to `content` to the terminal.

#### `.lineBreak()`

Inserts a newline (`br`) into the terminal.

## License: MIT
