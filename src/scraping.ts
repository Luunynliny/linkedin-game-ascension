import { firefox } from "playwright";
import * as cheerio from "cheerio";

export type PuzzleConfig = {
  "id": number;
  "piecesFEN": string;
  "rowConstraintsFEN": string;
  "colConstraintsFEN": string;
};

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

export function getColConstraints(gridHtml: string): string {
  const $ = cheerio.load(gridHtml);
  const cells = $("div.grid > div.relative");

  let constraints = "";

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 6; col++) {
      const index = row * 6 + col;
      const cell = $(cells[index]);

      const mark = cell
        .find("div.absolute")
        .filter((_, el) => {
          const className = $(el).attr("class") ?? "";
          return className.includes("bottom-0") &&
            className.includes("left-1/2");
        })
        .text()
        .trim();

      switch (mark) {
        case "×":
          constraints += "X";
          break;

        case "=":
          constraints += "=";
          break;

        default:
          constraints += "_";
          break;
      }
    }
  }

  return constraints;
}

export function getRowConstraints(gridHtml: string): string {
  const $ = cheerio.load(gridHtml);
  const cells = $("div.grid > div.relative");

  let constraints = "";

  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 5; col++) {
      const index = row * 6 + col;
      const cell = $(cells[index]);

      const mark = cell
        .find("div.absolute")
        .filter((_, el) => {
          const className = $(el).attr("class") ?? "";
          return className.includes("top-1/2") && className.includes("right-0");
        })
        .text()
        .trim();

      switch (mark) {
        case "×":
          constraints += "X";
          break;

        case "=":
          constraints += "=";
          break;

        default:
          constraints += "_";
          break;
      }
    }
  }

  return constraints;
}

export function parseColConstraintsFEN(constraints: string): string {
  const rows = constraints.match(/.{1,6}/g) || [];
  let fen = "";

  rows.forEach((row) => {
    let emptyCounter = 0;

    for (let i = 0; i < 6; i++) {
      const constraint = row[i];

      if (constraint === "X" || constraint === "=") {
        if (emptyCounter > 0) {
          fen += emptyCounter;
          emptyCounter = 0;
        }

        fen += constraint.toLowerCase();
        continue;
      }

      if (constraint === "_") {
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

export function parseRowConstraintsFEN(constraints: string): string {
  const rows = constraints.match(/.{1,5}/g) || [];
  let fen = "";

  rows.forEach((row) => {
    let emptyCounter = 0;

    for (let i = 0; i < 5; i++) {
      const constraint = row[i];

      if (constraint === "X" || constraint === "=") {
        if (emptyCounter > 0) {
          fen += emptyCounter;
          emptyCounter = 0;
        }

        fen += constraint.toLowerCase();
        continue;
      }

      if (constraint === "_") {
        emptyCounter++;

        if (i === 4) {
          fen += emptyCounter;
        }
      }
    }

    fen += "/";
  });

  return fen.slice(0, -1);
}

export async function getPuzzleConfig(puzzleId: number): Promise<PuzzleConfig> {
  const gridHtml = await fetchGrid(puzzleId);

  const pieces = getPieces(gridHtml);
  const rowConstraints = getRowConstraints(gridHtml);
  const colConstraints = getColConstraints(gridHtml);

  return {
    "id": puzzleId,
    "piecesFEN": parsePiecesFEN(pieces),
    "rowConstraintsFEN": parseRowConstraintsFEN(rowConstraints),
    "colConstraintsFEN": parseColConstraintsFEN(colConstraints),
  };
}
