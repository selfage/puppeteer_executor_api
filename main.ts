#!/usr/bin/env node
import { execute } from "./executor";
import { Command } from "commander";

function main(): void {
  let program = new Command();
  program
    .argument("<binFile>")
    .argument("[pass-through-args...]")
    .description(
      `Execute the presumably bundled JavaScript file in your Chrome ` +
        `browser. Requires the environment variable "CHROME" which points ` +
        `to your Chrome browser's exectuable path. The file ext can be ` +
        `neglected and is always fixed as .js. "--" is needed in between ` +
        `<binFile> and pass through arguments.`,
    )
    .option(
      "-b, --base-dir <baseDir>",
      `The base directory that all loaded files/resources should be ` +
        `relative to, from which all static files are being served in the ` +
        `server. If not provided, it will be the current working directory.`,
    )
    .option(
      "-p, --port <port>",
      `The port number to start your local server. Default to 8000.`,
      (value) => parseInt(value, 10),
    )
    .option(
      "-l, --outputToConsole",
      "Whether to log logs in browser to console.",
    )
    .option(
      "-c, --chromeExecutablePath <path>",
      `The exectuable path of your Chrome browser. You can download one from @puppeteer/browsers. If not provided, it will look for \`chrome\` field in ./package.json.`,
    )
    .action(async (binFile, passThroughArgs, options) => {
      await execute(
        binFile as string,
        options.baseDir as string,
        options.outputToConsole as boolean,
        options.port as number,
        passThroughArgs as Array<string>,
      );
    });
  program.parse();
}

main();
