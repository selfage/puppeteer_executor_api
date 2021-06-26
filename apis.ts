declare var argv: Array<string>;
declare function screenshot(path: string, type: string, quality?: number): Promise<string|Buffer>;
declare function fileExists(path: string): Promise<void>;
declare function deleteFile(path: string): Promise<void>;
declare function setViewport(width: number, height: number): Promise<void>; 

