import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { fetchGrid } from "../src/scraping.ts";
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
