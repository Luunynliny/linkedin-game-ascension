import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  fetchGrid,
  getColConstraints,
  getPieces,
  parsePiecesFEN,
} from "../src/scraping.ts";
import { minify } from "npm:html-minifier-terser";

async function normalizeHtml(html: string): Promise<string> {
  return await minify(html, {
    collapseWhitespace: true,
  });
}

Deno.test("fetchGrid", async () => {
  const url = new URL("./fixtures/puzzle_1_grid.html", import.meta.url);
  const expectedHtml = await Deno.readTextFile(url);

  const puzzleId = 1;
  const gridHtml = await fetchGrid(puzzleId);

  assertEquals(normalizeHtml(gridHtml), normalizeHtml(expectedHtml));
});

Deno.test("getPieces", async () => {
  const url = new URL("./fixtures/puzzle_1_grid.html", import.meta.url);
  const gridHtml = await Deno.readTextFile(url);

  const pieces = getPieces(gridHtml);

  assertEquals(pieces, "______SS__S_S__M_M__M___M________SS_");
});

Deno.test("parsePiecesFEN -- puzzle #1", () => {
  const pieces = "______SS__S_S__M_M__M___M________SS_";
  const fen = parsePiecesFEN(pieces);

  assertEquals(fen, "6/ss2s1/s2m1m/2m3/m5/3ss1");
});

Deno.test("parsePiecesFEN -- puzzle #2", () => {
  const pieces = "____S_M______S________SM_M___M__S_S_";
  const fen = parsePiecesFEN(pieces);

  assertEquals(fen, "4s1/m5/1s4/4sm/1m3m/2s1s1");
});

Deno.test("getColConstraints -- puzzle #1", async () => {
  const url = new URL("./fixtures/puzzle_1_grid.html", import.meta.url);
  const gridHtml = await Deno.readTextFile(url);

  const constraints = getColConstraints(gridHtml);

  assertEquals(constraints, "______________________________");
});

Deno.test("getColConstraints -- puzzle #2", async () => {
  const url = new URL("./fixtures/puzzle_2_grid.html", import.meta.url);
  const gridHtml = await Deno.readTextFile(url);

  const constraints = getColConstraints(gridHtml);

  assertEquals(constraints, "___XX_________________X_______");
});
