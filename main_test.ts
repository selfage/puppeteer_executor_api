import fs = require("fs");
import { assertThat, eq } from "@selfage/test_matcher";
import { TEST_RUNNER } from "@selfage/test_runner";
import { spawnSync } from "child_process";

TEST_RUNNER.run({
  name: "MainTest",
  cases: [
    {
      name: "LogsAndErrors",
      execute: async () => {
        // Prepare
        spawnSync("selfage", ["cpl", "test_data/logs_and_errors"]);

        // Execute
        let output = spawnSync("node", [
          "main",
          "test_data/logs_and_errors",
          "--",
          "-b",
          "some args",
        ]).stdout;

        // Verify
        assertThat(
          output.toString(),
          eq(`some string to print
-b,some args
some printed error Error
    at http://localhost:8000/test_data/logs_and_errors.js:4:35
`),
          "output"
        );
      },
    },
    {
      name: "Screenshot",
      execute: async () => {
        // Prepare
        spawnSync("selfage", ["cpl", "test_data/screenshot"]);

        // Execute
        spawnSync("node", ["main", "test_data/screenshot"]);

        // Verify
        assertThat(
          fs.readFileSync("test_data/screenshotted_image.png").toString(),
          eq(
            fs
              .readFileSync("test_data/screenshotted_image_golden.png")
              .toString()
          ),
          "image"
        );

        // Cleanup
        fs.unlinkSync("test_data/screenshotted_image.png");
      },
    },
    {
      name: "FileChooser",
      execute: async () => {
        // Prepare
        spawnSync("selfage", ["cpl", "test_data/file_chooser"]);

        // Execute
        let output = spawnSync("node", [
          "main",
          "test_data/file_chooser",
        ]).stdout;

        // Verify
        assertThat(output.toString(), eq(`some string here\n\n`), "text file");
      },
    },
  ],
});
