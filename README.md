# @selfage/puppeteer_executor_api

## Install

`npm install @selfage/puppeteer_executor_api`

## Overview

Written in TypeScript and compiled to ES6 with inline source map & source. See [@selfage/tsconfig](https://www.npmjs.com/package/@selfage/tsconfig) for full compiler options. Provides environment-level API declarations, though rather primitive, for TS/JS code running by [@selfage/bundler_cli#run-in-puppeteer](https://github.com/selfage/bundler_cli/tree/main#run-in-puppeteer), i.e., in Puppeteer/browser environment. See all available [Puppeteer executor APIs](https://github.com/selfage/bundler_cli/blob/main/puppeteer_executor_apis.ts) to control browser behaviors that are normally prohibited due to security reasons.

One example can be found in [@selfage/puppeteer_test_runner](https://www.npmjs.com/package/@selfage/puppeteer_test_runner), which is assumed to be bundled and run inside Puppeteer environment together with code under test, and calls "exit" API which are then handled by `$ bundage prun` or `$ bundage pexe` to close the current browser page and exit the executor, like Nodejs's `process.exit()`.
