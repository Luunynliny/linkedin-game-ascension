import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { Constraint, Piece, Tangly } from "../src/tangly.ts";

Deno.test("instanciation", () => {
  const pieces = [
    [" ", " ", " ", " ", " ", " "],
    ["S", "S", " ", " ", "S", " "],
    ["S", " ", " ", "M", " ", "M"],
    [" ", " ", "M", " ", " ", " "],
    ["M", " ", " ", " ", " ", " "],
    [" ", " ", " ", "S", "S", " "],
  ] as Piece[][];

  const rowConstraints = [
    [" ", "x", " ", " ", " "],
    [" ", "x", " ", " ", " "],
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", "x"],
    [" ", " ", " ", "=", " "],
    [" ", " ", " ", " ", " "],
  ] as Constraint[][];

  const colConstraints = [
    [" ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " "],
  ] as Constraint[][];

  const tangly = new Tangly(pieces, rowConstraints, colConstraints);

  assertEquals(tangly.pieces, [
    [" ", " ", " ", " ", " ", " "],
    ["S", "S", " ", " ", "S", " "],
    ["S", " ", " ", "M", " ", "M"],
    [" ", " ", "M", " ", " ", " "],
    ["M", " ", " ", " ", " ", " "],
    [" ", " ", " ", "S", "S", " "],
  ]);

  assertEquals(tangly.rowConstraints, [
    [" ", "x", " ", " ", " "],
    [" ", "x", " ", " ", " "],
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", "x"],
    [" ", " ", " ", "=", " "],
    [" ", " ", " ", " ", " "],
  ]);

  assertEquals(tangly.colConstraints, [
    [" ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " "],
  ]);
});

Deno.test("toString", () => {
  const pieces = [
    [" ", " ", " ", " ", " ", " "],
    ["S", "S", " ", " ", "S", " "],
    ["S", " ", " ", "M", " ", "M"],
    [" ", " ", "M", " ", " ", " "],
    ["M", " ", " ", " ", " ", " "],
    [" ", " ", " ", "S", "S", " "],
  ] as Piece[][];

  const rowConstraints = [
    [" ", "x", " ", " ", " "],
    [" ", "x", " ", " ", " "],
    [" ", " ", " ", " ", "x"],
    [" ", " ", " ", "=", " "],
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " "],
  ] as Constraint[][];

  const colConstraints = [
    [" ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " "],
  ] as Constraint[][];

  const tangly = new Tangly(pieces, rowConstraints, colConstraints);

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

Deno.test("loadPiecesFEN", () => {
  const piecesFEN = "6/ss2s1/s2m1m/2m3/m5/3ss1";

  const tangly = new Tangly();
  tangly.loadPiecesFEN(piecesFEN);

  assertEquals(
    tangly.pieces,
    [
      [" ", " ", " ", " ", " ", " "],
      ["S", "S", " ", " ", "S", " "],
      ["S", " ", " ", "M", " ", "M"],
      [" ", " ", "M", " ", " ", " "],
      ["M", " ", " ", " ", " ", " "],
      [" ", " ", " ", "S", "S", " "],
    ] as Piece[][],
  );
  assertEquals(
    tangly.rowConstraints,
    [
      [" ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " "],
    ] as Constraint[][],
  );
  assertEquals(
    tangly.colConstraints,
    [
      [" ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " "],
    ] as Constraint[][],
  );
});

Deno.test("loadRowConstraintsFEN", () => {
  const rowConstraintsFEN = "1x3/1x3/5/4x/3=1/5";

  const tangly = new Tangly();
  tangly.loadRowConstraintsFEN(rowConstraintsFEN);

  assertEquals(
    tangly.pieces,
    [
      [" ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " "],
    ] as Piece[][],
  );
  assertEquals(
    tangly.rowConstraints,
    [
      [" ", "x", " ", " ", " "],
      [" ", "x", " ", " ", " "],
      [" ", " ", " ", " ", " "],
      [" ", " ", " ", " ", "x"],
      [" ", " ", " ", "=", " "],
      [" ", " ", " ", " ", " "],
    ] as Constraint[][],
  );
  assertEquals(
    tangly.colConstraints,
    [
      [" ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " "],
    ] as Constraint[][],
  );
});

Deno.test("loadColConstraintsFEN", () => {
  const colConstraintsFEN = "3xx1/6/6/4x1/6";

  const tangly = new Tangly();
  tangly.loadColConstraintsFEN(colConstraintsFEN);

  assertEquals(
    tangly.pieces,
    [
      [" ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " "],
    ] as Piece[][],
  );
  assertEquals(
    tangly.rowConstraints,
    [
      [" ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " "],
    ] as Constraint[][],
  );
  assertEquals(
    tangly.colConstraints,
    [
      [" ", " ", " ", "x", "x", " "],
      [" ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", "x", " "],
      [" ", " ", " ", " ", " ", " "],
    ] as Constraint[][],
  );
});
