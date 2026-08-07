import { PieceShape } from "@/types";

/**
 * Original BlockSAT piece library (not copied from any existing game's data
 * files) — a set of classic polyomino shapes sized for an 8x8 board.
 */
const SHAPES: PieceShape[] = [
  // 1x1
  [[true]],
  // 1x2, 2x1
  [[true, true]],
  [[true], [true]],
  // 1x3, 3x1
  [[true, true, true]],
  [[true], [true], [true]],
  // 1x4, 4x1
  [[true, true, true, true]],
  [[true], [true], [true], [true]],
  // 1x5, 5x1
  [[true, true, true, true, true]],
  [[true], [true], [true], [true], [true]],
  // 2x2 square
  [
    [true, true],
    [true, true],
  ],
  // 3x3 square
  [
    [true, true, true],
    [true, true, true],
    [true, true, true],
  ],
  // L shapes (4 rotations)
  [
    [true, false],
    [true, false],
    [true, true],
  ],
  [
    [true, true, true],
    [true, false, false],
  ],
  [
    [true, true],
    [false, true],
    [false, true],
  ],
  [
    [false, false, true],
    [true, true, true],
  ],
  // J shapes
  [
    [false, true],
    [false, true],
    [true, true],
  ],
  [
    [true, false, false],
    [true, true, true],
  ],
  [
    [true, true],
    [true, false],
    [true, false],
  ],
  [
    [true, true, true],
    [false, false, true],
  ],
  // T shapes
  [
    [true, true, true],
    [false, true, false],
  ],
  [
    [false, true],
    [true, true],
    [false, true],
  ],
  [
    [false, true, false],
    [true, true, true],
  ],
  [
    [true, false],
    [true, true],
    [true, false],
  ],
  // S / Z shapes
  [
    [false, true, true],
    [true, true, false],
  ],
  [
    [true, true, false],
    [false, true, true],
  ],
  [
    [true, false],
    [true, true],
    [false, true],
  ],
  [
    [false, true],
    [true, true],
    [true, false],
  ],
  // Plus shape
  [
    [false, true, false],
    [true, true, true],
    [false, true, false],
  ],
  // Corner (2x2 missing one)
  [
    [true, true],
    [true, false],
  ],
  [
    [true, true],
    [false, true],
  ],
  [
    [true, false],
    [true, true],
  ],
  [
    [false, true],
    [true, true],
  ],
];

export const PIECE_COLORS = [
  "#f97316", // orange
  "#ef4444", // red
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#22c55e", // green
  "#eab308", // yellow
  "#ec4899", // pink
  "#06b6d4", // cyan
];

export function randomShape(): PieceShape {
  return SHAPES[Math.floor(Math.random() * SHAPES.length)];
}

export function randomColor(): string {
  return PIECE_COLORS[Math.floor(Math.random() * PIECE_COLORS.length)];
}

export function pieceCellCount(shape: PieceShape): number {
  return shape.reduce((sum, row) => sum + row.filter(Boolean).length, 0);
}
