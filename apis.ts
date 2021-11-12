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
