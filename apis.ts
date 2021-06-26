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
