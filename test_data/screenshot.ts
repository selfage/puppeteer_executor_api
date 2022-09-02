declare function puppeteerScreenshot(path: string, options: any): Promise<void>;
declare function puppeteerExit(): void;

async function main0(): Promise<void> {
  let div = document.createElement('div');
  div.style.width = "100px";
  div.style.height = "100px";
  div.style.backgroundColor = "red";
  document.body.appendChild(div);

  let renderedImagePath = "./test_data/screenshotted_image.png";
  await puppeteerScreenshot(renderedImagePath, {
    delay: 500,
  });

  puppeteerExit();
}

main0();
