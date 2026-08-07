/**
 * Lightweight original sound-effect synthesizer using the Web Audio API.
 * No external audio files are bundled — every effect below is generated at
 * runtime from oscillators/noise, which keeps the app dependency-free and
 * guarantees the sounds are original works.
 */
"use client";

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AudioCtx =
      window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    ctx = new AudioCtx();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function tone(freq: number, duration: number, options: { type?: OscillatorType; gain?: number; delay?: number; sweepTo?: number } = {}) {
  const audioCtx = getCtx();
  if (!audioCtx) return;
  const { type = "sine", gain = 0.15, delay = 0, sweepTo } = options;

  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  osc.type = type;
  const startTime = audioCtx.currentTime + delay;
  osc.frequency.setValueAtTime(freq, startTime);
  if (sweepTo) osc.frequency.exponentialRampToValueAtTime(sweepTo, startTime + duration);

  gainNode.gain.setValueAtTime(gain, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.02);
}

let musicInterval: ReturnType<typeof setInterval> | null = null;

export const sfx = {
  placePiece: () => tone(320, 0.09, { type: "square", gain: 0.12, sweepTo: 420 }),
  lineClear: () => {
    tone(520, 0.12, { type: "triangle", sweepTo: 780 });
    tone(660, 0.14, { type: "triangle", delay: 0.05, sweepTo: 990 });
  },
  combo: (streak: number) => {
    const base = 440 + Math.min(streak, 8) * 60;
    tone(base, 0.15, { type: "sawtooth", gain: 0.1, sweepTo: base * 1.5 });
  },
  correct: () => {
    tone(523.25, 0.1, { type: "sine" });
    tone(659.25, 0.12, { type: "sine", delay: 0.09 });
    tone(783.99, 0.16, { type: "sine", delay: 0.18 });
  },
  incorrect: () => {
    tone(220, 0.2, { type: "sawtooth", gain: 0.12, sweepTo: 140 });
  },
  levelUp: () => {
    [0, 0.1, 0.2, 0.3].forEach((delay, i) => tone(392 + i * 130, 0.18, { type: "sine", delay }));
  },
  achievement: () => {
    tone(660, 0.1, { type: "sine" });
    tone(880, 0.12, { type: "sine", delay: 0.08 });
    tone(1046.5, 0.2, { type: "sine", delay: 0.16 });
  },
  gameOver: () => {
    [0, 0.12, 0.24].forEach((delay, i) => tone(300 - i * 60, 0.22, { type: "sawtooth", delay, gain: 0.12 }));
  },
  startMusic: () => {
    if (musicInterval) return;
    const audioCtx = getCtx();
    if (!audioCtx) return;
    const notes = [261.6, 293.7, 329.6, 349.2, 392, 349.2, 329.6, 293.7];
    let i = 0;
    musicInterval = setInterval(() => {
      tone(notes[i % notes.length], 0.4, { type: "sine", gain: 0.03 });
      i++;
    }, 550);
  },
  stopMusic: () => {
    if (musicInterval) {
      clearInterval(musicInterval);
      musicInterval = null;
    }
  },
};
