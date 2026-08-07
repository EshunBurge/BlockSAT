"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Board, BOARD_SIZE } from "@/lib/game/board";
import { cn } from "@/lib/utils";

interface GameBoardProps {
  board: Board;
  previewCells: { row: number; col: number; valid: boolean }[] | null;
  clearingCells: { rows: number[]; cols: number[] } | null;
}

export const GameBoard = forwardRef<HTMLDivElement, GameBoardProps>(function GameBoard(
  { board, previewCells, clearingCells },
  ref
) {
  const previewSet = new Map<string, boolean>();
  previewCells?.forEach((c) => previewSet.set(`${c.row}-${c.col}`, c.valid));

  return (
    <div
      ref={ref}
      className="grid aspect-square w-full max-w-[520px] gap-1 rounded-2xl bg-black/30 p-2 shadow-inner"
      style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))` }}
      data-board
    >
      {board.map((row, r) =>
        row.map((cell, c) => {
          const key = `${r}-${c}`;
          const preview = previewSet.get(key);
          const isClearing =
            (clearingCells?.rows.includes(r) || clearingCells?.cols.includes(c)) ?? false;
          return (
            <motion.div
              key={key}
              data-cell
              data-row={r}
              data-col={c}
              className={cn(
                "relative aspect-square rounded-md",
                !cell.filled && !preview && "bg-white/5",
                preview !== undefined && (preview ? "ring-2 ring-emerald-400 bg-emerald-400/30" : "ring-2 ring-red-500 bg-red-500/20")
              )}
              animate={
                isClearing
                  ? { scale: [1, 1.15, 0], opacity: [1, 1, 0] }
                  : cell.filled
                  ? { scale: 1, opacity: 1 }
                  : { scale: 1, opacity: 1 }
              }
              transition={{ duration: 0.35 }}
              style={cell.filled ? { backgroundColor: cell.color ?? undefined } : undefined}
            >
              {cell.filled && (
                <div className="absolute inset-0.5 rounded-[4px] bg-white/20" style={{ mixBlendMode: "overlay" }} />
              )}
            </motion.div>
          );
        })
      )}
    </div>
  );
});
