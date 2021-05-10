// Exits when you think all things are done. Browser/Puppeteer environment will
// not exit by itself because it still waits for user interactions.
export let EXIT = "eeexisttt!";
// Followed by a url path which is treated as a relative file path to the root
// directory, and writes the screenshot to the file path. Note that there is
// no way to wait for writing done. You can only keep polling.
export let SCREENSHOT = "ssscreenshottt:";
// Followed by a url path which is treated as a relative file path to the root
// directory, which will be deleted. Note that there is no way to wait for
// deletion done. You can only keep polling.
export let DELETE = "dddeleteee:"
