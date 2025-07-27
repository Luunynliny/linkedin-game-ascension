import { firefox } from "playwright";
import * as cheerio from "cheerio";

async function fetchGrid(puzzleId: number): Promise<string> {
  const browser = await firefox.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("https://www.tangly.org/?id=" + puzzleId);
  await page.waitForSelector(".grid.grid-cols-6");

  const gridHTML = await page.$eval(".grid.grid-cols-6", (el) => el.outerHTML);

  await browser.close();
  return gridHTML;
}

function getPieces(gridHTML: string): string {
  const $ = cheerio.load(gridHTML);
  let pieces = "";

  $("button").each((_, btn) => {
    const img = $(btn).find("img");
    if (img.length === 0) {
      pieces += "_";
    } else {
      const src = img.attr("src");
      if (!src) throw new Error("Unexpected cell value");

      const name = src.split(/[\/.]/)[1];

      switch (name) {
        case "lemon":
          pieces += "S";
          break;
        case "moon":
          pieces += "M";
          break;
        default:
          throw new Error("Unknow image name");
      }
    }
  });

  return pieces;
}

const grid = await fetchGrid(1);
const _pieces = getPieces(grid);
