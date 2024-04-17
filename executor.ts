import fs = require("fs");
import http = require("http");
import mime = require("mime-types");
import path = require("path");
import puppeteer = require("puppeteer-core");
import stream = require("stream");
import util = require("util");
import { Buffer } from "buffer";
let pipeline = util.promisify(stream.pipeline);

let PUPPETEER_NAMESPACE = "puppeteer";
let HOST_NAME = "localhost";

export interface OutputCollection {
  log: Array<string>;
  warn: Array<string>;
  error: Array<string>;
  other: Array<string>;
}

export async function execute(
  binFile: string,
  baseDir = ".",
  noLogToConsole = false,
  port = 8000,
  noHeadless = false,
  argv: Array<string> = [],
): Promise<OutputCollection> {
  if (!process.env.CHROME) {
    throw new Error(
      `Requires the environment variable "CHROME" which points to your Chrome browser's exectuable path.`,
    );
  }
  let outputToConsole = !noLogToConsole;
  let headless = !noHeadless;

  let pathObj = path.parse(binFile);
  pathObj.ext = ".js";
  pathObj.base = "";
  let binJsFile = path.relative(baseDir, path.format(pathObj));
  let tempBinFile = path.join(baseDir, "selfage_temp_bin.html");
  let argsStr = argv.length === 0 ? `` : `"${argv.join(`","`)}"`;
  let writeFilePromise = fs.promises.writeFile(
    tempBinFile,
    `<!DOCTYPE html>
<html>
  <head><meta charset="UTF-8"></head>
  <body>
    <script type="text/javascript">var ${PUPPETEER_NAMESPACE}Argv = [${argsStr}];</script>
    <script type="text/javascript" src="/${binJsFile}"></script>
  </body>
</html>`,
  );

  let server = http.createServer();
  server.addListener(
    "request",
    (request: http.IncomingMessage, response: http.ServerResponse) =>
      serveFile(baseDir, request, response),
  );
  let startServerPromise = new Promise<void>((resolve) => {
    server.listen({ host: HOST_NAME, port: port }, () => resolve());
  });
  await Promise.all([writeFilePromise, startServerPromise]);

  let browser = await puppeteer.launch({
    executablePath: process.env.CHROME,
    headless,
  });
  let page = await browser.newPage();
  page.exposeFunction(
    `${PUPPETEER_NAMESPACE}Screenshot`,
    async (
      relativePath: string,
      {
        delay = 0,
        fullPage,
        quality,
      }: {
        delay?: number; // ms
        fullPage?: boolean;
        quality?: number;
      } = {},
    ): Promise<void> => {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, delay);
      });
      let file = path.join(baseDir, relativePath);
      let fileType: "png" | "jpeg";
      if (path.extname(relativePath) === ".png") {
        fileType = "png";
      } else {
        fileType = "jpeg";
      }
      await page.screenshot({
        path: file,
        type: fileType,
        quality: quality,
        fullPage: fullPage,
        omitBackground: true,
      });
    },
  );
  page.exposeFunction(
    `${PUPPETEER_NAMESPACE}FileExists`,
    async (relativePath: string): Promise<boolean> => {
      let file = path.join(baseDir, relativePath);
      try {
        await fs.promises.stat(file);
        return true;
      } catch (e) {
        return false;
      }
    },
  );
  page.exposeFunction(
    `${PUPPETEER_NAMESPACE}ReadFile`,
    async (relativePath: string, encoding: BufferEncoding): Promise<string> => {
      let file = path.join(baseDir, relativePath);
      return await fs.promises.readFile(file, encoding);
    },
  );
  page.exposeFunction(
    `${PUPPETEER_NAMESPACE}WriteFile`,
    async (relativePath: string, data: string): Promise<void> => {
      let file = path.join(baseDir, relativePath);
      return await fs.promises.writeFile(file, Buffer.from(data, "binary"));
    },
  );
  page.exposeFunction(
    `${PUPPETEER_NAMESPACE}DeleteFile`,
    async (relativePath: string): Promise<void> => {
      let file = path.join(baseDir, relativePath);
      await fs.promises.unlink(file);
    },
  );
  page.exposeFunction(
    `${PUPPETEER_NAMESPACE}SetViewport`,
    async (width: number, height: number): Promise<void> => {
      await page.setViewport({ width, height });
    },
  );
  page.exposeFunction(
    `${PUPPETEER_NAMESPACE}MouseClick`,
    async (x: number, y: number): Promise<void> => {
      await page.mouse.click(x, y);
    },
  );
  page.exposeFunction(
    `${PUPPETEER_NAMESPACE}MouseMove`,
    async (x: number, y: number, steps: number): Promise<void> => {
      await page.mouse.move(x, y, { steps });
    },
  );
  page.exposeFunction(
    `${PUPPETEER_NAMESPACE}MouseDown`,
    async (): Promise<void> => {
      await page.mouse.down();
    },
  );
  page.exposeFunction(
    `${PUPPETEER_NAMESPACE}MouseUp`,
    async (): Promise<void> => {
      await page.mouse.up();
    },
  );
  page.exposeFunction(
    `${PUPPETEER_NAMESPACE}MouseWheel`,
    async (deltaX: number, deltaY: number): Promise<void> => {
      await page.mouse.wheel({ deltaX, deltaY });
    },
  );
  page.exposeFunction(
    `${PUPPETEER_NAMESPACE}TouchTap`,
    async (x: number, y: number): Promise<void> => {
      await page.touchscreen.tap(x, y);
    },
  );
  page.exposeFunction(
    `${PUPPETEER_NAMESPACE}TouchStart`,
    async (x: number, y: number): Promise<void> => {
      await page.touchscreen.touchStart(x, y);
    },
  );
  page.exposeFunction(
    `${PUPPETEER_NAMESPACE}TouchMove`,
    async (x: number, y: number): Promise<void> => {
      await page.touchscreen.touchMove(x, y);
    },
  );
  page.exposeFunction(
    `${PUPPETEER_NAMESPACE}TouchEnd`,
    async (): Promise<void> => {
      await page.touchscreen.touchEnd();
    },
  );
  page.exposeFunction(
    `${PUPPETEER_NAMESPACE}KeyboardType`,
    async (text: string): Promise<void> => {
      await page.keyboard.type(text);
    },
  );
  page.exposeFunction(
    `${PUPPETEER_NAMESPACE}KeyboardDown`,
    async (key: puppeteer.KeyInput): Promise<void> => {
      await page.keyboard.down(key);
    },
  );
  page.exposeFunction(
    `${PUPPETEER_NAMESPACE}KeyboardUp`,
    async (key: puppeteer.KeyInput): Promise<void> => {
      await page.keyboard.up(key);
    },
  );
  {
    await page.setRequestInterception(true);
    page.on("request", (request): void => {
      request.continue(request.continueRequestOverrides(), 0);
    });
    page.exposeFunction(
      `${PUPPETEER_NAMESPACE}MockExactFile`,
      (originalUrl: string, relativePath: string): void => {
        page.on("request", (request) => {
          if (request.url() === originalUrl) {
            request.continue(
              { url: `http://${HOST_NAME}:${port}${relativePath}` },
              1,
            );
          }
        });
      },
    );
  }
  {
    let fileChooserPromise: Promise<puppeteer.FileChooser>;
    page.exposeFunction(
      `${PUPPETEER_NAMESPACE}WaitForFileChooser`,
      async (delayAfter = 500 /* ms */): Promise<void> => {
        fileChooserPromise = page.waitForFileChooser();
        await new Promise<void>((resolve) => {
          setTimeout(resolve, delayAfter);
        });
      },
    );
    page.exposeFunction(
      `${PUPPETEER_NAMESPACE}FileChooserAccept`,
      async (...relativePaths: Array<string>): Promise<void> => {
        let fileChooser = await fileChooserPromise;
        await fileChooser.accept(
          relativePaths.map((relativePath): string => {
            return path.join(baseDir, relativePath);
          }),
        );
      },
    );
  }

  let outputCollection: OutputCollection = {
    log: [],
    warn: [],
    error: [],
    other: [],
  };
  let exited = false;
  let lastConsoleMsgPromise = Promise.resolve();
  let exitCodePromise = new Promise<number>((resolve) => {
    page.exposeFunction(`${PUPPETEER_NAMESPACE}Exit`, (): void => {
      exited = true;
      resolve(0);
    });
    page.on("pageerror", async (err) => {
      exited = true;
      resolve(2);
      await lastConsoleMsgPromise;
      if (outputToConsole) {
        console.error(err.stack);
      }
      outputCollection.error.push(err.stack);
    });
  });
  page.on("console", (msg) => {
    if (exited) {
      return;
    }
    lastConsoleMsgPromise = collectConsoleMsgAfterLastMsg(
      lastConsoleMsgPromise,
      msg,
      outputToConsole,
      outputCollection,
    );
  });
  await page.goto(`http://${HOST_NAME}:${port}/selfage_temp_bin.html`);

  process.exitCode = await exitCodePromise;
  await lastConsoleMsgPromise;
  await Promise.all([
    browser.close(),
    new Promise<void>((resolve) => {
      server.close(() => resolve());
    }),
    fs.promises.unlink(tempBinFile),
  ]);
  return outputCollection;
}

async function serveFile(
  baseDir: string,
  request: http.IncomingMessage,
  response: http.ServerResponse,
): Promise<void> {
  let url = new URL(request.url, `http://${request.headers.host}`);
  let file = path.join(baseDir, url.pathname.substring(1));
  let contentType = mime.lookup(path.extname(file));
  if (typeof contentType === "boolean") {
    contentType = mime.contentType("bin") as string;
  }

  try {
    await fs.promises.stat(file);
  } catch (e) {
    response.writeHead(404, {
      "Content-Type": mime.contentType("text") as string,
    });
    response.end("Not found");
    return;
  }
  response.writeHead(200, { "Content-Type": contentType });
  return pipeline(fs.createReadStream(file), response);
}

async function collectConsoleMsgAfterLastMsg(
  lastCollectPromise: Promise<void>,
  msg: puppeteer.ConsoleMessage,
  outputToConsole: boolean,
  outputCollection: OutputCollection,
): Promise<void> {
  await lastCollectPromise;
  let text = await interpretMsg(msg);
  if (msg.type() === "log" || msg.type() === "info") {
    if (outputToConsole) {
      console.log(text);
    }
    outputCollection.log.push(text);
  } else if (msg.type() === "warn") {
    if (outputToConsole) {
      console.warn(text);
    }
    outputCollection.warn.push(text);
  } else if (msg.type() === "error") {
    if (outputToConsole) {
      console.error(text);
    }
    outputCollection.error.push(text);
  } else {
    if (outputToConsole) {
      console.log(`${msg.type()}: ${text}`);
    }
    outputCollection.other.push(`${msg.type()}: ${text}`);
  }
}

async function interpretMsg(msg: puppeteer.ConsoleMessage): Promise<string> {
  if (msg.args().length > 0) {
    let args = (await Promise.all(
      msg.args().map((arg) => {
        return arg.evaluate((arg: any) => {
          if (arg instanceof Error) {
            return arg.stack;
          }
          return `${arg}`;
        });
      }),
    )) as Array<string>;
    return util.format(...args);
  } else {
    return msg.text();
  }
}
