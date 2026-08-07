"use client";

import { PieceShape } from "@/types";

export function DragGhost({
  shape,
  color,
  x,
  y,
  cellSize,
}: {
  shape: PieceShape;
  color: string;
  x: number;
  y: number;
  cellSize: number;
}) {
  const rows = shape.length;
  const cols = shape[0]?.length ?? 0;
  return (
    <div
      className="pointer-events-none fixed z-50 opacity-90"
      style={{
        left: x - (cols * cellSize) / 2,
        top: y - (rows * cellSize) / 2,
      }}
    >
      {shape.map((row, r) => (
        <div key={r} className="flex">
          {row.map((filled, c) => (
            <div
              key={c}
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: filled ? color : "transparent",
              }}
              className={filled ? "rounded-[4px] shadow-lg" : ""}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
