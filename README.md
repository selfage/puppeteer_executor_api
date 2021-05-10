# @selfage/puppeteer_executor_api

## Install

`npm install @selfage/puppeteer_executor_api`

## Overview

Written in TypeScript and compiled to ES6 with inline source map & source. See [@selfage/tsconfig](https://www.npmjs.com/package/@selfage/tsconfig) for full compiler options. Provides environment-level API declarations, though rather primitive, for TS/JS code running by [@selfage/bundler_cli#run-in-puppeteer](https://github.com/selfage/bundler_cli/tree/main#run-in-puppeteer), i.e., in Puppeteer/browser environment. See all available [Puppeteer executor APIs](https://github.com/selfage/puppeteer_executor_api/blob/main/apis.ts) to access global variables and control browser behaviors that are normally prohibited due to security reasons.

## Access argv

Pass-through arguments from `@selfage/bundler_cli` can be accessed in your executable TS/JS file via a global `argv` variable which is an array of strings similar to Nodejs's `process.argv` except no Node path and JS file name. See an exmaple below.

```TypeScript
import '@selfage/puppeteer_executor_api/argv'; // import for side effect which declares argv as a global variable.

// argv = ['-a', '10'] with `$ bundage prun my_file -- -a 10`
// You can use some popular tools to parse arguments.
parseArg(argv);
// or parseArg(globalThis.argv);
```

## Control API

APIs are invoked by logging, i.e. `console.log()`, and thus verbose to avoid accidental conflicts. Those APIs are not available/provided as native JS/Nodejs APIs because they can control browser behaviors and touch file systems, and thus are prohibited in normal cases. When run/executed by `@selfage/bundler_cli`, logging events are being listened to and then executed only when matched. Those APIs should be for dev/test purposes only.

```TypeScript
import { EXIT, SCREENSHOT } from '@selfage/puppeteer_executor_api';

console.log(EXIT);
console.log(SCREENSHOT + '/golden/test_image.png');
```

You can find a working example in [@selfage/test_runner](https://github.com/selfage/test_runner).
