import fs = require("fs");
import { assertThat, containStr, eq } from "@selfage/test_matcher";
import { TEST_RUNNER } from "@selfage/test_runner";
import { execSync } from "child_process";

TEST_RUNNER.run({
  name: "MainTest",
  environment: {
    setUp: () => {
      execSync("npx selfage cpl main");
    },
  },
  cases: [
    {
      name: "Logs",
      execute: async () => {
        // Prepare
        execSync("npx selfage cpl test_data/logs");

        // Execute
        let output = execSync("node main test_data/logs -- -b some_args");

        // Verify
        assertThat(
          output.toString(),
          eq(`some string to print
-b,some_args
some printed error Error
    at http://localhost:8000/test_data/logs.js:4:35
`),
          "output",
        );
      },
    },
    {
      name: "ThrowError",
      execute: async () => {
        // Prepare
        execSync("npx selfage cpl test_data/throw_error");

        // Execute
        let error: Error;
        try {
          execSync("node main test_data/throw_error");
        } catch (e) {
          error = e;
        }

        // Verify
        assertThat(error.message, containStr("This is an error"), "error message");
      },
    },
    {
      name: "Screenshot",
      execute: async () => {
        // Prepare
        execSync("npx selfage cpl test_data/screenshot");

        // Execute
        execSync("node main test_data/screenshot");

        // Verify
        assertThat(
          fs.readFileSync("test_data/screenshotted_image.png").toString(),
          eq(
            fs
              .readFileSync("test_data/screenshotted_image_golden.png")
              .toString(),
          ),
          "image",
        );

        // Cleanup
        fs.unlinkSync("test_data/screenshotted_image.png");
      },
    },
    {
      name: "FileChooser",
      execute: async () => {
        // Prepare
        execSync("npx selfage cpl test_data/file_chooser");

        // Execute
        let output = execSync("node main test_data/file_chooser");

        // Verify
        assertThat(output.toString(), eq(`some string here\n\n`), "text file");
      },
    },
  ],
});
