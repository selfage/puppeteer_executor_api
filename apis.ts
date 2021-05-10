// APIs are invoked by logging via `console.log()` and thus verbose to avoid
// accidental conflicts. Those APIs are not available in native JS APIs because
// they can control browser behaviors and touch file systems, and thus are
// prohibited in normal cases. When run/executed by `bundage` CLI, logging
// events are being listened to and then executed only when matched. Those APIs
// should be for dev/test purposes only.

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
