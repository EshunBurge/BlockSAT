import { PieceShape } from "@/types";

export const BOARD_SIZE = 8;

export type Cell = { filled: boolean; color: string | null };
export type Board = Cell[][];

export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => ({ filled: false, color: null as string | null }))
  );
}

/** Can the given shape be placed with its top-left cell at (row, col)? */
export function canPlace(board: Board, shape: PieceShape, row: number, col: number): boolean {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const br = row + r;
      const bc = col + c;
      if (br < 0 || br >= BOARD_SIZE || bc < 0 || bc >= BOARD_SIZE) return false;
      if (board[br][bc].filled) return false;
    }
  }
  return true;
}

/** Returns true if the shape can be placed anywhere on the board. */
export function canPlaceAnywhere(board: Board, shape: PieceShape): boolean {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (canPlace(board, shape, r, c)) return true;
    }
  }
  return false;
}

/** Places the shape (assumes canPlace already validated) and returns a new board. */
export function placeShape(board: Board, shape: PieceShape, row: number, col: number, color: string): Board {
  const next: Board = board.map((r) => r.map((cell) => ({ ...cell })));
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      next[row + r][col + c] = { filled: true, color };
    }
  }
  return next;
}

export interface ClearResult {
  board: Board;
  rowsCleared: number[];
  colsCleared: number[];
  totalLines: number;
}

/** Detects and clears any fully-filled rows/columns, returning the new board and what cleared. */
export function clearLines(board: Board): ClearResult {
  const fullRows: number[] = [];
  const fullCols: number[] = [];

  for (let r = 0; r < BOARD_SIZE; r++) {
    if (board[r].every((cell) => cell.filled)) fullRows.push(r);
  }
  for (let c = 0; c < BOARD_SIZE; c++) {
    let full = true;
    for (let r = 0; r < BOARD_SIZE; r++) {
      if (!board[r][c].filled) {
        full = false;
        break;
      }
    }
    if (full) fullCols.push(c);
  }

  if (fullRows.length === 0 && fullCols.length === 0) {
    return { board, rowsCleared: [], colsCleared: [], totalLines: 0 };
  }

  const next: Board = board.map((row) => row.map((cell) => ({ ...cell })));
  for (const r of fullRows) {
    for (let c = 0; c < BOARD_SIZE; c++) next[r][c] = { filled: false, color: null };
  }
  for (const c of fullCols) {
    for (let r = 0; r < BOARD_SIZE; r++) next[r][c] = { filled: false, color: null };
  }

  return {
    board: next,
    rowsCleared: fullRows,
    colsCleared: fullCols,
    totalLines: fullRows.length + fullCols.length,
  };
}

/**
 * Scoring model:
 * - 10 points per cell placed
 * - Line clears: 100 points per line, with a multiplier for clearing multiple
 *   lines simultaneously (Block-Blast-style combo bonus)
 * - Chain bonus: consecutive placements that each trigger a clear increase a
 *   running "combo" multiplier that resets when a placement clears nothing.
 */
export function computePlacementScore(cellsPlaced: number): number {
  return cellsPlaced * 10;
}

export function computeClearScore(linesCleared: number, comboStreak: number): number {
  if (linesCleared === 0) return 0;
  const base = linesCleared * 100;
  const multiLineBonus = linesCleared > 1 ? (linesCleared - 1) * 50 : 0;
  const comboMultiplier = 1 + comboStreak * 0.5;
  return Math.round((base + multiLineBonus) * comboMultiplier);
}
