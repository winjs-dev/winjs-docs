# Debugging {#debug}

In addition to using browser debugging tools for development debugging, WinJS also recommends the following debugging methods to assist with project debugging.

## Debugging dev build artifacts

If you need to debug project build artifacts during the dev phase, take `win.js` as an example. First download the original `win.js` to the current project root directory. After editing according to debugging needs, refresh the browser, and the `win.js` used by the project will be replaced with the `win.js` file in the root directory. To restore after debugging, simply delete the `win.js` in the root directory.

Example:
```bash
# Download the current project's win.js
$ curl http://127.0.0.1:8000/win.js -O

# Add content you want to debug, for example add "debug!!!" alert
$ echo -e  '\n;alert("debug!!!");\n' >> win.js
# Open browser to see the alert popup

# Exit debugging and restore to normal state
$ rm win.js
```

You can debug other JavaScript files in the same way.

## Bug debugging methods

In our development, due to lack of understanding of underlying mechanisms or compatibility issues, we may encounter white screen or Out Of Memory problems. Some issues have no obvious debugging approach. This is when we need to use some debugging strategies.

### Binary search positioning

Binary search is the most commonly used and effective debugging method, very suitable for situations like "my code was working yesterday" and various Out Of Memory errors. We can comment out program logic bit by bit and continuously troubleshoot, which can completely narrow down the possible range of problems, then find the culprit and debug using conventional methods.

For Out Of Memory in Node, the most common approach is to delete half of the dependencies, then retry to continuously narrow down the range until finding where the problem lies. Binary search debugging can basically solve most tricky bugs every time we encounter them - it's an essential programmer skill, regardless of language.

### Rubber duck debugging

Also known as [rubber duck debugging](https://en.wikipedia.org/wiki/Rubber_duck_debugging).

In the process of handling bugs, the hardest part is not how to solve the problem, but how to locate the bug in the code. If you're really at a loss, especially with algorithmic problems, we can use rubber duck debugging. We can find any object or colleague to explain or discuss the problem once, and posting online is also a good approach.

### Rewrite from scratch

This method has the highest cost and is suitable for messy code, especially legacy code. If you really can't understand or fix the bug, you can add good test cases and rewrite it from scratch. After all, many bugs are actually just typos.
