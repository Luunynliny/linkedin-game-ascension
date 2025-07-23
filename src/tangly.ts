export type Cell = " " | "S" | "M";

export type Constraint = " " | "=" | "x";

export class Tangly {
  cells: Cell[][]; // 6x6
  hConstraints: Constraint[][]; // 6x5
  vConstraints: Constraint[][]; // 5x6

  constructor(
    cells?: Cell[][],
    hConstraints?: Constraint[][],
    vConstraints?: Constraint[][],
  ) {
    this.cells = cells ??
      Array.from({ length: 6 }, () => Array(6).fill(" " as Cell));
    this.hConstraints = hConstraints ??
      Array.from({ length: 6 }, () => Array(5).fill(" " as Constraint));
    this.vConstraints = vConstraints ??
      Array.from({ length: 5 }, () => Array(6).fill(" " as Constraint));
  }

  public loadPiecesFEN(fen: string): void {
    const grid: string[][] = Array.from(
      { length: 6 },
      () => Array(6).fill(" "),
    );

    let i = 0, j = 0;

    for (let n = 0; n < fen.length; n++) {
      const c = fen[n];

      // Skip empty cells
      if (["1", "2", "3", "4", "5", "6"].includes(c)) {
        j += parseInt(c);
        continue;
      }

      // Go the next row
      if (c == "/") {
        i++;
        j = 0;
        continue;
      }

      // Place pieces
      switch (c) {
        case "s":
          grid[i][j] = "S";
          break;

        case "m":
          grid[i][j] = "M";
          break;

        default:
          break;
      }

      j++;
    }

    this.cells = grid as Cell[][];
  }

  public loadHConstraintsFEN(fen: string): void {
    const grid: string[][] = Array.from(
      { length: 6 },
      () => Array(5).fill(" "),
    );

    let i = 0, j = 0;

    for (let n = 0; n < fen.length; n++) {
      const c = fen[n];

      // Skip empty cells
      if (["1", "2", "3", "4", "5", "6"].includes(c)) {
        j += parseInt(c);
        continue;
      }

      // Go the next row
      if (c == "/") {
        i++;
        j = 0;
        continue;
      }

      // Place constraints
      grid[i][j] = c;

      j++;
    }

    this.hConstraints = grid as Constraint[][];
  }

  public loadVConstraintsFEN(fen: string): void {
    const grid: string[][] = Array.from(
      { length: 5 },
      () => Array(6).fill(" "),
    );

    let i = 0, j = 0;

    for (let n = 0; n < fen.length; n++) {
      const c = fen[n];

      // Skip empty cells
      if (["1", "2", "3", "4", "5", "6"].includes(c)) {
        j += parseInt(c);
        continue;
      }

      // Go the next row
      if (c == "/") {
        i++;
        j = 0;
        continue;
      }

      // Place constraints
      grid[i][j] = c;

      j++;
    }

    this.vConstraints = grid as Constraint[][];
  }

  public toString(): string {
    const moonSymbol = " ☽ ";
    const sunSymbol = " ◯ ";
    const emptySymbol = "   ";

    const oppositeSymbol = "×";
    const sameSymbol = "=";

    const emptyHConstraint = "|";
    const emptyVConstraint = "---+";

    let _string = "";

    for (let i = 0; i < 6; i++) {
      // Cells and horizontal constraints
      for (let j = 0; j < 6; j++) {
        const cell = this.cells[i][j];

        switch (cell) {
          case "M":
            _string += moonSymbol;
            break;

          case "S":
            _string += sunSymbol;
            break;

          default:
            _string += emptySymbol;
            break;
        }

        if (0 < j && j < 5) {
          const hConstraint = this.hConstraints[i][j];

          switch (hConstraint) {
            case "x":
              _string += oppositeSymbol;
              break;

            case "=":
              _string += sameSymbol;
              break;

            default:
              _string += emptyHConstraint;
              break;
          }
        } else {
          _string += emptyHConstraint;
        }
      }

      _string += "\n";

      // Vertical constraints
      if (i < 5) {
        for (let j = 0; j < 6; j++) {
          const vConstraint = this.vConstraints[i][j];

          if (0 < j && j < 5) {
            switch (vConstraint) {
              case "x":
                _string += oppositeSymbol;
                break;

              case "=":
                _string += sameSymbol;
                break;

              default:
                _string += emptyVConstraint;
                break;
            }
          } else {
            _string += emptyVConstraint;
          }
        }
        _string += "\n";
      }
    }

    return _string;
  }
}
