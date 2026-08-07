"use client";

import { useCallback, useEffect, useRef } from "react";
import { sfx } from "@/lib/audio/sfx";

export function useSound(enabled: boolean, musicEnabled: boolean = false) {
  const enabledRef = useRef(enabled);
  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    if (musicEnabled && enabled) {
      sfx.startMusic();
    } else {
      sfx.stopMusic();
    }
    return () => sfx.stopMusic();
  }, [musicEnabled, enabled]);

  const play = useCallback((name: keyof typeof sfx, arg?: number) => {
    if (!enabledRef.current) return;
    const fn = sfx[name] as (arg?: number) => void;
    fn(arg);
  }, []);

  return { play };
}
