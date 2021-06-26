# @selfage/puppeteer_executor_api

## Install

`npm install @selfage/puppeteer_executor_api`

## Overview

Written in TypeScript and compiled to ES6 with inline source map & source. See [@selfage/tsconfig](https://www.npmjs.com/package/@selfage/tsconfig) for full compiler options. Provides [Puppeteer executor environment](https://github.com/selfage/bundler_cli#puppeteer-executor-environment) API declarations.

## Access argv

Pass-through arguments can be accessed in your executable TS/JS file via a global `argv` variable which is an array of strings similar to Nodejs's `process.argv` except no Node path and JS file name.

```TypeScript
import '@selfage/puppeteer_executor_api'; // import for side effect which declares argv as a global variable.

// argv = ['-a', '10'] with `$ bundage prun my_file -- -a 10`
// You can use some popular tools to parse arguments.
parseArg(argv);
// or parseArg(globalThis.argv);
```

## All APIs

Below is a file of [apis.ts](https://github.com/selfage/puppeteer_executor_api/blob/main/apis.ts) which declares all APIs.

```TypeScript
declare var argv: Array<string>;
declare function exit(): void;
declare function screenshot(
  relativePath: string,
  options: { delay?: number; fullPage?: boolean; quality?: number }
): Promise<string>;
declare function fileExists(relativePath: string): Promise<void>;
declare function readFile(relativePath: string): Promise<string>;
declare function deleteFile(relativePath: string): Promise<void>;
declare function setViewport(width: number, height: number): Promise<void>;
```

They should be self-explanatory. You can find a working example in [@selfage/test_runner](https://github.com/selfage/test_runner).

