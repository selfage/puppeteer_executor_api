# @selfage/puppeteer_test_executor

## Install

`npm install @selfage/puppeteer_test_executor`

## Overview

Written in TypeScript and compiled to ES6 with inline source map & source. See [@selfage/tsconfig](https://www.npmjs.com/package/@selfage/tsconfig) for full compiler options. Provides an executor which launches a single browser page via Puppeteer, exposes helper functions for testing to browser context/window scope, and executes a single/bundled JS file in that page.

[Puppeteer](https://github.com/puppeteer/puppeteer) is a Node library which provides a high-level API to control Chrome or Chromium over the DevTools Protocol.

## Executing a JS file

```TypeScript
import { execute, OutputCollection } from '@selfage/puppeteer_test_executor';

// Runs in Node context.
let outputCollection: OutputCollection = execute(
  './file/to/be/run/in/browser.js',
  './base/dir',
  /* outputToConsole= */ true,
  /* port= */ 8080,
  /* argv= */ ['--case', 'AssertAddition']);
outputCollection.log; // Array<string>
outputCollection.warn; // Array<string>
outputCollection.error; // Array<string>
outputCollection.other; // Array<string>
```

As a prerequisite, you need a JS file that's meant to be run in browser context, which contains everything needed to render a page/perform whatever actions. It can be a bundled file using bundlers such as `browserify`, or a bootstrap file that loads other files.

The `execute()` function will start a local Node server, embed the JS file into a temporary HTML file, and launch Puppeteer to navigate to that HTML file. When `outputToConsole` is `true`, it logs browser logs to Node console. Returned `outputCollection` will always collect all logs from the browser. Note that, normally a browser page won't exit by itself even if everything have been executed, so `execute()` will never resolve/return. The solution is to call `exit()` from the JS file. Keep reading.

The full JS file path in the example is `./base/dir/file/to/be/run/in/browser.js` which is split into two parts: a base directory and a relative path. You might just want to use `'.'` as the base directory. However the base directory is also used to be prepended to all paths loaded in the JS file. E.g. if the JS file loads an image with `src='/path/to/image.jpg'`, the server will try to find the file at `./base/dir/path/to/image.jpg`. You need to make sure all other files loaded share the same base directory with the JS file, and only reference the part of file paths after the base directory.

## JS file in browser context

The JS file executed by the way above has access to several more global/window variables & functions. Below is the full list copied from [apis.ts](https://github.com/selfage/puppeteer_test_executor_api/blob/main/apis.ts) which can be imported after installing `@selfage/puppeteer_test_executor_api`.

```TypeScript
declare var argv: Array<string>;
declare function exit(): void;
declare function screenshot(
  relativePath: string,
  options: { delay?: number; fullPage?: boolean; quality?: number }
): Promise<void>;
declare function fileExists(relativePath: string): Promise<boolean>;
declare function readFile(
  relativePath: string,
  // Not use BufferEncoding to avoid dependency on @types/node
  encoding?: string
): Promise<string | ArrayBuffer>;
declare function writeFile(
  relativePath: string,
  data: ArrayBuffer
): Promise<void>;
declare function deleteFile(relativePath: string): Promise<void>;
declare function setViewport(width: number, height: number): Promise<void>;

```

### Argv

```TypeScript
import '@selfage/puppeteer_test_executor_api'; // Import type definitions only.

parseArg(argv); // ['--case', 'AssertAddition']
// or parseArg(globalThis.argv);
```

If you have executed the JS file with an `argv` argument, the value, which is of `Array<string>`, can then be accessed in the JS file by `argv`, i.e. it's a global/window scope variable. It's intended to be used just as command line arguments as if it's an exetuable JS file used in CLIs.

### Functions

```TypeScript
import '@selfage/puppeteer_test_executor_api'; // Import type definitions only.

// Runs in browser context.
async function main(): Promise<void> {
  await fileExists('some/file.txt');
  exit();
}
```

Functions made available this way are more powerful than regular functions because they are actually run in Node context, as opposed to browser context, thanks to the magic [exposeFunction()](https://github.com/puppeteer/puppeteer/blob/v11.0.0/docs/api.md#pageexposefunctionname-puppeteerfunction). I.e. you can interact with file systems within browser context directly, as well as changing view port and taking screenshots.

`exit()` is a special and important function. It tells the browser page which runs the JS file to close itself. Normally a browser page won't close/exit at all even if everything has been executed, because it's waiting for user to interact with the page. But in testing scenarios, the JS file itself often controls all interactions and knows when to end tests. `exit()` can then be called upon all tests finished, which in turn resolves `execute()` function. You can see [@selfage/test_runner](https://github.com/selfage/test_runner) as an example.
