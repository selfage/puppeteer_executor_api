declare function puppeteerWaitForFileChooser(): Promise<void>;
declare function puppeteerFileChooserAccept(...files: Array<string>): Promise<void>;
declare function puppeteerExit(): void;

async function main1(): Promise<void> {
  let input = document.createElement('input');
  input.type = "file";

  await puppeteerWaitForFileChooser();
  input.click();
  await puppeteerFileChooserAccept("./test_data/text_file.txt");
  console.log(await input.files[0].text());

  puppeteerExit();
}

main1();
