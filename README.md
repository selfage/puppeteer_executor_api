# @selfage/puppeteer_executor_api

## Install

`npm install @selfage/puppeteer_executor_api`

## Overview

Written in TypeScript and compiled to ES6 with inline source map & source. See [@selfage/tsconfig](https://www.npmjs.com/package/@selfage/tsconfig) for full compiler options. Provides [Puppeteer executor environment](https://github.com/selfage/bundler_cli#puppeteer-executor-environment) API declarations, though rather primitive, for TS/JS code running by [@selfage/bundler_cli#run-in-puppeteer](https://github.com/selfage/bundler_cli#run-in-puppeteer).

## Access argv

Pass-through arguments can be accessed in your executable TS/JS file via a global `argv` variable which is an array of strings similar to Nodejs's `process.argv` except no Node path and JS file name.

```TypeScript
import '@selfage/puppeteer_executor_api/argv'; // import for side effect which declares argv as a global variable.

// argv = ['-a', '10'] with `$ bundage prun my_file -- -a 10`
// You can use some popular tools to parse arguments.
parseArg(argv);
// or parseArg(globalThis.argv);
```

## Control API

APIs are invoked by logging, i.e. `console.log()`, and thus verbose to avoid accidental conflicts. Those APIs can control browser behaviors and touch file systems, and thus are usually prohibited by browsers. However, `@selfage/bundler_cli` can listen to logging events and then execute them. They should be used for dev/test purposes only.

```TypeScript
import { EXIT, SCREENSHOT, DELETE } from '@selfage/puppeteer_executor_api';

console.log(EXIT);
console.log(SCREENSHOT + '/golden/test_image.png');
console.log(DELETE + '/golden/test_image.png');
```

Also see [api.ts](https://github.com/selfage/puppeteer_executor_api/blob/main/apis.ts). You can find a working example in [@selfage/test_runner](https://github.com/selfage/test_runner).

