terminator.js
=============

terminator.js is a tiny dependency-free library for building terminal like interfaces for the browser.

## Usage

Drop the JS + CSS into your website to access terminator.js. The latest build can always be found in the dist/ folder of the GitHub repository.

    <link rel="stylesheet" type="text/css" href="terminator.css">
    <script src="terminator.js"></script>
    
The script exposes a `Terminator` constructor with which takes two parameters: a DOM element (such as a `div`) and a configuration Object. Example:

    var config = {
            alwaysFocus: true,
            autoScroll: true,
            prefix: '~$',
            caret: '_'
    };
    var targetNode = document.getElementById('some-dom-id');
    var theTerminator = new Terminator(targetNode, config);
    
Then, whenever you're ready to accept commands, call

    theTerminator.prompt();

License: MIT