import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { add } from "../src/main.ts";

Deno.test("adds numbers", () => {
  assertEquals(add(2, 3), 5);
});
