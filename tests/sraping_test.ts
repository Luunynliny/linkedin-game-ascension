import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { fetchGrid, getPieces } from "../src/scraping.ts";
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

  const pieces = getPieces(gridHtml)

  assertEquals(pieces, "______SS__S_S__M_M__M___M________SS_");
});
