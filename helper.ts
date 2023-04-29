import "./api";

export function getArgv(): Array<string> {
  return globalThis.puppeteerArgv;
}

export function exit(): void {
  return globalThis.puppeteerExit();
}

export function screenshot(
  relativePath: string,
  options?: { delay?: number /* ms */; fullPage?: boolean; quality?: number }
): Promise<void> {
  return globalThis.puppeteerScreenshot(relativePath, options);
}

export function fileExists(relativePath: string): Promise<boolean> {
  return globalThis.puppeteerFileExists(relativePath);
}

export function readFile(
  relativePath: string,
  // An encoding is mandatory because raw buffer data cannot be transmitted
  // correctly. Refer to BufferEncoding for all supported strings.
  encoding: string
): Promise<string> {
  return globalThis.puppeteerReadFile(relativePath, encoding);
}

export function writeFile(
  relativePath: string,
  // Represented as a binary string.
  data: string
): Promise<void> {
  return globalThis.puppeteerWriteFile(relativePath, data);
}

export function deleteFile(relativePath: string): Promise<void> {
  return globalThis.puppeteerDeleteFile(relativePath);
}

export async function getFiles(
  ...relativePaths: Array<string>
): Promise<FileList> {
  let fileInput = document.createElement("input");
  fileInput.type = "file";
  await globalThis.puppeteerWaitForFileChooser();
  fileInput.click();
  await globalThis.puppeteerFileChooserAccept(...relativePaths);
  return fileInput.files;
}

export async function supplyFiles(
  triggerFileChooserFn: () => void,
  ...relativePaths: Array<string>
): Promise<void> {
  await globalThis.puppeteerWaitForFileChooser();
  triggerFileChooserFn();
  return globalThis.puppeteerFileChooserAccept(...relativePaths);
}

export function setViewport(width: number, height: number): Promise<void> {
  return globalThis.puppeteerSetViewport(width, height);
}

export function mockExactFile(originalUrl: string, relativePath: string): void {
  return globalThis.puppeteerMockExactFile(originalUrl, relativePath);
}
