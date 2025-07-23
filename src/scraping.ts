import { firefox } from "playwright";

function toGrid<T>(arr: T[], width: number): T[][] {
  const grid: T[][] = [];
  for (let i = 0; i < arr.length; i += width) {
    grid.push(arr.slice(i, i + width));
  }
  return grid;
}

async function scrapeWithFirefox() {
  const browser = await firefox.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("https://www.tangly.org/?id=86");
  await page.waitForSelector(".grid.grid-cols-6");

  const puzzle = await page.evaluate(() => {
    const cells = document.querySelectorAll<HTMLButtonElement>(
      ".grid.grid-cols-6 > div button",
    );
    const result: string[] = [];

    cells.forEach((btn) => {
      const img = btn.querySelector("img");
      if (!img) {
        result.push("empty");
      } else {
        const src = img.getAttribute("src") || "";
        if (src.includes("lemon")) result.push("lemon");
        else if (src.includes("moon")) result.push("moon");
        else result.push("unknown");
      }
    });

    return result;
  });

  const grid = toGrid(puzzle, 6);
  console.log(grid);
  await browser.close();
}

scrapeWithFirefox();
