import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { Cell, Constraint, Tangly } from "../src/tangly.ts";

Deno.test("instanciation", () => {
  const cells = [
    [" ", " ", " ", " ", " ", " "],
    ["S", "S", " ", " ", "S", " "],
    ["S", " ", " ", "M", " ", "M"],
    [" ", " ", "M", " ", " ", " "],
    ["M", " ", " ", " ", " ", " "],
    [" ", " ", " ", "S", "S", " "],
  ] as Cell[][];

  const hConstraints = [
    [" ", "x", " ", " ", " "],
    [" ", "x", " ", " ", " "],
    [" ", " ", " ", " ", "x"],
    [" ", " ", " ", "=", " "],
    [" ", " ", " ", " ", " "],
  ] as Constraint[][];

  const vConstraints = [
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " "],
  ] as Constraint[][];

  const tangly = new Tangly(cells, hConstraints, vConstraints);

  assertEquals(tangly.cells, [
    [" ", " ", " ", " ", " ", " "],
    ["S", "S", " ", " ", "S", " "],
    ["S", " ", " ", "M", " ", "M"],
    [" ", " ", "M", " ", " ", " "],
    ["M", " ", " ", " ", " ", " "],
    [" ", " ", " ", "S", "S", " "],
  ]);

  assertEquals(tangly.hConstraints, [
    [" ", "x", " ", " ", " "],
    [" ", "x", " ", " ", " "],
    [" ", " ", " ", " ", "x"],
    [" ", " ", " ", "=", " "],
    [" ", " ", " ", " ", " "],
  ]);

  assertEquals(tangly.vConstraints, [
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " "],
  ]);
});

Deno.test("toString", () => {
  const cells = [
    [" ", " ", " ", " ", " ", " "],
    ["S", "S", " ", " ", "S", " "],
    ["S", " ", " ", "M", " ", "M"],
    [" ", " ", "M", " ", " ", " "],
    ["M", " ", " ", " ", " ", " "],
    [" ", " ", " ", "S", "S", " "],
  ] as Cell[][];

  const hConstraints = [
    [" ", "x", " ", " ", " "],
    [" ", "x", " ", " ", " "],
    [" ", " ", " ", " ", "x"],
    [" ", " ", " ", "=", " "],
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " "],
  ] as Constraint[][];

  const vConstraints = [
    [" ", " ", " ", " ", " ", ""],
    [" ", " ", " ", " ", " ", ""],
    [" ", " ", " ", " ", " ", ""],
    [" ", " ", " ", " ", " ", ""],
    [" ", " ", " ", " ", " ", ""],
  ] as Constraint[][];

  const tangly = new Tangly(cells, hConstraints, vConstraints);

  assertEquals(
    tangly.toString(),
    "   |   ×   |   |   |   |\n" +
      "---+---+---+---+---+---+\n" +
      " ◯ | ◯ ×   |   | ◯ |   |\n" +
      "---+---+---+---+---+---+\n" +
      " ◯ |   |   | ☽ |   × ☽ |\n" +
      "---+---+---+---+---+---+\n" +
      "   |   | ☽ |   =   |   |\n" +
      "---+---+---+---+---+---+\n" +
      " ☽ |   |   |   |   |   |\n" +
      "---+---+---+---+---+---+\n" +
      "   |   |   | ◯ | ◯ |   |\n",
  );
});

Deno.test("loadCellsFEN", () => {
  const piecesFEN = "6/ss2s1/s2m1m/2m3/m5/3ss1";

  const tangly = new Tangly()
  tangly.loadCellsFEN(piecesFEN)

  assertEquals(
    tangly.cells,
    [
    [" ", " ", " ", " ", " ", " "],
    ["S", "S", " ", " ", "S", " "],
    ["S", " ", " ", "M", " ", "M"],
    [" ", " ", "M", " ", " ", " "],
    ["M", " ", " ", " ", " ", " "],
    [" ", " ", " ", "S", "S", " "],
  ] as Cell[][]);
});
