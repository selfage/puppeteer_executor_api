# @selfage/puppeteer_test_executor

## Install

`npm install @selfage/puppeteer_test_executor`

## Overview

Written in TypeScript and compiled to ES6 with inline source map & source. See [@selfage/tsconfig](https://www.npmjs.com/package/@selfage/tsconfig) for full compiler options. Provides an executor which launches a single browser page via Puppeteer, exposes helper functions for testing to browser context/window scope, and executes a single/bundled JS file in that page.

[Puppeteer](https://github.com/puppeteer/puppeteer) is a Node library which provides a high-level API to control Chrome or Chromium over the DevTools Protocol.

## Executing a JS file

You can use the CLI e.g. `$ npx pexe file/to/be/run/in/browser.js -b base/dir`. See below for detailed options.

```Shell
$ npx pexe -h
Usage: pexe [options] <binFile> [pass-through-args...]

Execute the presumably bundled JavaScript file in browser context. The file ext can be neglected and is always fixed as .js. "--" is needed in between <binFile> and pass through arguments.

Options:
  -b, --base-dir <baseDir>  The base directory that all loaded files/resources should be relative to, from which all static files are being served in the server. If not
                            provided, it will be the current working directory.
  -p, --port <port>         The port number to start your local server. Default to 8000.
  -l, --outputToConsole     Whether to log logs in browser to console.
  -h, --help                display help for command
```

Or use programmatical API as below.

```TypeScript
import { execute, OutputCollection } from '@selfage/puppeteer_test_executor';

// Runs in Node context.
let outputCollection: OutputCollection = execute(
  'file/to/be/run/in/browser.js',
  'base/dir',
  /* outputToConsole= */ true,
  /* port= */ 8080,
  /* argv= */ ['--case', 'AssertAddition']);
outputCollection.log; // Array<string>
outputCollection.warn; // Array<string>
outputCollection.error; // Array<string>
outputCollection.other; // Array<string>
```

As a prerequisite, you need a JS file that's meant to be run in browser context, which contains everything needed to render a page/perform whatever actions. It can be a bundled file using bundlers such as `browserify`, or a bootstrap file that loads other files.

The `execute()` function or the CLI will start a local Node server, embed the JS file into a temporary HTML file, and launch Puppeteer to navigate to that HTML file. When `outputToConsole` is `true`, it logs browser logs to Node console. Returned `outputCollection` will always collect all logs from the browser. `pass-through-args` or `argv` argument are made available to the JS file as a global variable.

The full JS file path in the example is `./base/dir/file/to/be/run/in/browser.js` which is split into two parts: a base directory and a relative path. You might just want to use `'.'`, which is the default, as the base directory. However the base directory is where all static files are being served from. E.g. if the JS file loads an image with `src='/path/to/image.jpg'`, the server will try to find it at `./base/dir/path/to/image.jpg`.

Note that, normally a browser page won't exit by itself even if everything have been executed, so `execute()` or the CLI will never resolve/return. The solution is to call `exit()` from the JS file.

## JS file in browser context

The JS file executed by the way above runs in browser context, i.e. having access to `window` and DOM tree.

### Helper functions

A set of helper functions are provided to global/`window` thanks to the magic [exposeFunction()](https://github.com/puppeteer/puppeteer/blob/v11.0.0/docs/api.md#pageexposefunctionname-puppeteerfunction). They are able to interact with browser itself and access files directly from file system.

E.g., normally a browser page won't close/exit at all even if everything has been executed, because it's waiting for user to interact with the page. However, if you are running tests, and want to close the browser after all tests are done. You can call the `exit()` function like below.

```TypeScript
import { exit } from "@selfage/puppeteer_test_executor/helper";

// ... other stuff to do
exit(); // The browser is now being exited/closed.

```

See [helper.ts](https://github.com/selfage/puppeteer_test_executor/blob/main/helper.ts) for all available functions.

### Argv

```TypeScript
import { getArgv } '@selfage/puppeteer_test_executor/helper'; // Import type definitions only.

console.log(getArgv()); // ['--case', 'AssertAddition']
```

If you have executed the JS file with an `argv` argument or `[pass-through-args...]`, the value, which is of type `Array<string>`, can then be accessed in the JS file by `getArgv()`. It's intended to be used just as command line arguments as if it's an exetuable JS file used in Node CLIs.
