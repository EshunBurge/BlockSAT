import { create } from "zustand";
import { PieceInstance } from "@/types";
import {
  Board,
  createEmptyBoard,
  canPlace,
  canPlaceAnywhere,
  placeShape,
  clearLines,
  computePlacementScore,
  computeClearScore,
} from "@/lib/game/board";
import { randomShape, randomColor } from "@/lib/game/pieces";

function makeLockedPiece(): PieceInstance {
  return {
    id: crypto.randomUUID(),
    shape: randomShape(),
    color: randomColor(),
    locked: true,
  };
}

export interface FloatingScorePopup {
  id: string;
  amount: number;
  x: number;
  y: number;
}

interface GameState {
  board: Board;
  pieces: PieceInstance[];
  score: number;
  linesCleared: number;
  comboStreak: number;
  longestCombo: number;
  gameOver: boolean;
  questionsAnswered: number;
  questionsCorrect: number;
  correctStreak: number;
  longestCorrectStreak: number;
  lastClearedLines: { rows: number[]; cols: number[] } | null;
  popups: FloatingScorePopup[];
  activeUnlockPieceId: string | null;

  initGame: () => void;
  requestUnlock: (pieceId: string) => void;
  cancelUnlock: () => void;
  resolveQuestion: (correct: boolean) => void;
  placePiece: (pieceId: string, row: number, col: number) => boolean;
  dismissPopup: (id: string) => void;
}

function checkGameOver(board: Board, pieces: PieceInstance[]): boolean {
  const unlockedPlayable = pieces.filter((p) => !p.locked);
  if (unlockedPlayable.length === 0) return false; // still have locked pieces to unlock
  return unlockedPlayable.every((p) => !canPlaceAnywhere(board, p.shape));
}

export const useGameStore = create<GameState>((set, get) => ({
  board: createEmptyBoard(),
  pieces: [makeLockedPiece(), makeLockedPiece(), makeLockedPiece()],
  score: 0,
  linesCleared: 0,
  comboStreak: 0,
  longestCombo: 0,
  gameOver: false,
  questionsAnswered: 0,
  questionsCorrect: 0,
  correctStreak: 0,
  longestCorrectStreak: 0,
  lastClearedLines: null,
  popups: [],
  activeUnlockPieceId: null,

  initGame: () =>
    set({
      board: createEmptyBoard(),
      pieces: [makeLockedPiece(), makeLockedPiece(), makeLockedPiece()],
      score: 0,
      linesCleared: 0,
      comboStreak: 0,
      longestCombo: 0,
      gameOver: false,
      questionsAnswered: 0,
      questionsCorrect: 0,
      correctStreak: 0,
      longestCorrectStreak: 0,
      lastClearedLines: null,
      popups: [],
      activeUnlockPieceId: null,
    }),

  requestUnlock: (pieceId) => set({ activeUnlockPieceId: pieceId }),
  cancelUnlock: () => set({ activeUnlockPieceId: null }),

  resolveQuestion: (correct) => {
    const { activeUnlockPieceId, pieces, correctStreak, longestCorrectStreak } = get();
    const questionsAnswered = get().questionsAnswered + 1;
    const questionsCorrect = get().questionsCorrect + (correct ? 1 : 0);
    const nextStreak = correct ? correctStreak + 1 : 0;

    if (!correct || !activeUnlockPieceId) {
      set({
        questionsAnswered,
        questionsCorrect,
        correctStreak: nextStreak,
        longestCorrectStreak: Math.max(longestCorrectStreak, nextStreak),
        activeUnlockPieceId: correct ? activeUnlockPieceId : null,
      });
      return;
    }

    const nextPieces = pieces.map((p) => (p.id === activeUnlockPieceId ? { ...p, locked: false } : p));
    set({
      pieces: nextPieces,
      questionsAnswered,
      questionsCorrect,
      correctStreak: nextStreak,
      longestCorrectStreak: Math.max(longestCorrectStreak, nextStreak),
      activeUnlockPieceId: null,
    });
  },

  placePiece: (pieceId, row, col) => {
    const state = get();
    const piece = state.pieces.find((p) => p.id === pieceId);
    if (!piece || piece.locked) return false;
    if (!canPlace(state.board, piece.shape, row, col)) return false;

    const cellsPlaced = piece.shape.flat().filter(Boolean).length;
    let board = placeShape(state.board, piece.shape, row, col, piece.color);
    const placementScore = computePlacementScore(cellsPlaced);

    const clearResult = clearLines(board);
    board = clearResult.board;

    const comboStreak = clearResult.totalLines > 0 ? state.comboStreak + 1 : 0;
    const clearScore = computeClearScore(clearResult.totalLines, comboStreak);
    const longestCombo = Math.max(state.longestCombo, comboStreak);

    let nextPieces = state.pieces.filter((p) => p.id !== pieceId);
    nextPieces.push(makeLockedPiece());
    // Once all 3 slots are used up and refilled, ensure exactly 3 remain.
    if (nextPieces.length > 3) nextPieces = nextPieces.slice(-3);

    const popups: FloatingScorePopup[] = [...state.popups];
    if (placementScore > 0) {
      popups.push({ id: crypto.randomUUID(), amount: placementScore, x: 50, y: 50 });
    }
    if (clearScore > 0) {
      popups.push({ id: crypto.randomUUID(), amount: clearScore, x: 50, y: 35 });
    }

    const gameOver = checkGameOver(board, nextPieces);

    set({
      board,
      pieces: nextPieces,
      score: state.score + placementScore + clearScore,
      linesCleared: state.linesCleared + clearResult.totalLines,
      comboStreak,
      longestCombo,
      lastClearedLines:
        clearResult.totalLines > 0 ? { rows: clearResult.rowsCleared, cols: clearResult.colsCleared } : null,
      popups,
      gameOver,
    });
    return true;
  },

  dismissPopup: (id) => set((s) => ({ popups: s.popups.filter((p) => p.id !== id) })),
}));
