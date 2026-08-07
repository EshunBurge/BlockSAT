"use client";

import { PieceInstance } from "@/types";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

function MiniShape({ shape, color, cellSize = 16 }: { shape: boolean[][]; color: string; cellSize?: number }) {
  return (
    <div className="flex flex-col gap-0.5">
      {shape.map((row, r) => (
        <div key={r} className="flex gap-0.5">
          {row.map((filled, c) => (
            <div
              key={c}
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: filled ? color : "transparent",
              }}
              className={filled ? "rounded-[3px]" : ""}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

interface PieceTrayProps {
  pieces: PieceInstance[];
  draggingPieceId: string | null;
  onLockedClick: (pieceId: string) => void;
  onDragStart: (pieceId: string, e: React.PointerEvent) => void;
}

export function PieceTray({ pieces, draggingPieceId, onLockedClick, onDragStart }: PieceTrayProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          onPointerDown={(e) => {
            if (piece.locked) {
              onLockedClick(piece.id);
            } else {
              onDragStart(piece.id, e);
            }
          }}
          className={cn(
            "flex aspect-square touch-none items-center justify-center rounded-xl border transition select-none",
            piece.locked
              ? "cursor-pointer border-white/10 bg-white/5"
              : "cursor-grab border-white/20 bg-white/10 hover:bg-white/15 active:cursor-grabbing",
            draggingPieceId === piece.id && "opacity-20"
          )}
        >
          {piece.locked ? (
            <div className="flex flex-col items-center gap-1 text-white/40">
              <Lock className="h-6 w-6" />
              <span className="text-[10px] font-medium">Answer to unlock</span>
            </div>
          ) : (
            <MiniShape shape={piece.shape} color={piece.color} />
          )}
        </div>
      ))}
    </div>
  );
}
