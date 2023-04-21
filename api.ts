declare var puppeteerArgv: Array<string>;
declare function puppeteerExit(): void;
declare function puppeteerScreenshot(
  relativePath: string,
  options?: { delay?: number /* ms */; fullPage?: boolean; quality?: number }
): Promise<void>;
declare function puppeteerFileExists(relativePath: string): Promise<boolean>;
declare function puppeteerReadFile(
  relativePath: string,
  // An encoding is mandatory because raw buffer data cannot be transmitted
  // correctly. Refer to BufferEncoding for all supported strings.
  encoding: string
): Promise<string>;
declare function puppeteerWriteFile(
  relativePath: string,
  // Represented as a binary string.
  data: string
): Promise<void>;
declare function puppeteerDeleteFile(relativePath: string): Promise<void>;
declare function puppeteerSetViewport(
  width: number,
  height: number
): Promise<void>;
declare function puppeteerMockExactFile(
  originalUrl: string,
  relativePath: string
): void;
declare function puppeteerWaitForFileChooser(
  delayAfter?: number /* ms */
): Promise<void>;
declare function puppeteerFileChooserAccept(
  ...relativePaths: Array<string>
): Promise<void>;
