import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  fetchGrid,
  getColConstraints,
  getPieces,
  getRowConstraints,
  parseColConstraintsFEN,
  parsePiecesFEN,
  parseRowConstraintsFEN,
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

Deno.test("getRowConstraints -- puzzle #1", async () => {
  const url = new URL("./fixtures/puzzle_1_grid.html", import.meta.url);
  const gridHtml = await Deno.readTextFile(url);

  const constraints = getRowConstraints(gridHtml);

  assertEquals(constraints, "_X____X____________X___=______");
});

Deno.test("getRowConstraints -- puzzle #2", async () => {
  const url = new URL("./fixtures/puzzle_2_grid.html", import.meta.url);
  const gridHtml = await Deno.readTextFile(url);

  const constraints = getRowConstraints(gridHtml);

  assertEquals(constraints, "______________________________");
});

Deno.test("parseColConstraintsFEN -- puzzle #1", () => {
  const pieces = "______________________________";
  const fen = parseColConstraintsFEN(pieces);

  assertEquals(fen, "6/6/6/6/6");
});

Deno.test("parseColConstraintsFEN -- puzzle #2", () => {
  const pieces = "___XX_________________X_______";
  const fen = parseColConstraintsFEN(pieces);

  assertEquals(fen, "3xx1/6/6/4x1/6");
});

Deno.test("parseRowConstraintsFEN -- puzzle #1", () => {
  const pieces = "_X____X____________X___=______";
  const fen = parseRowConstraintsFEN(pieces);

  assertEquals(fen, "1x3/1x3/5/4x/3=1/5");
});

Deno.test("parseRowConstraintsFEN -- puzzle #2", () => {
  const pieces = "______________________________";
  const fen = parseRowConstraintsFEN(pieces);

  assertEquals(fen, "5/5/5/5/5/5");
});
