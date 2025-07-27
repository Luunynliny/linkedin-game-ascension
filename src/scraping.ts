import { firefox } from "playwright";
import * as cheerio from "cheerio";

export async function fetchGrid(puzzleId: number): Promise<string> {
  const browser = await firefox.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("https://www.tangly.org/?id=" + puzzleId);
  await page.waitForSelector(".grid.grid-cols-6");

  const gridHtml = await page.$eval(".grid.grid-cols-6", (el) => el.outerHTML);

  await browser.close();
  return gridHtml;
}

export function getPieces(gridHtml: string): string {
  const $ = cheerio.load(gridHtml);
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

export function parsePiecesFEN(pieces: string): string {
  const rows = pieces.match(/.{1,6}/g) || [];
  let fen = "";

  rows.forEach((row) => {
    let emptyCounter = 0;

    for (let i = 0; i < 6; i++) {
      const piece = row[i];

      if (piece === "S" || piece === "M") {
        if (emptyCounter > 0) {
          fen += emptyCounter;
          emptyCounter = 0;
        }

        fen += piece.toLowerCase();
        continue;
      }

      if (piece === "_") {
        emptyCounter++;

        if (i === 5) {
          fen += emptyCounter;
        }
      }
    }

    fen += "/";
  });

  return fen.slice(0, -1);
}
