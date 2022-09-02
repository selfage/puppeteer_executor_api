console.log("some string to print");

declare let puppeteerArgv: Array<string>;
console.log(puppeteerArgv);

console.log("some printed error", new Error().stack);

throw new Error("This is an error");
