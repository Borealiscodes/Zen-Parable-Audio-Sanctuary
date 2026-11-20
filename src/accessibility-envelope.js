/**
 * src/accessibility-envelope.js — Social Model Sensory Regulation & Non-Visual Spatial Bridge (Ledger 2)
 * Composes ndh-game-dev-kit modules 07-sensory-regulation-envelope and 08-nonvisual-spatial-bridge.
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

import { Q_ONE, toQ16, fromQ16, qMul } from "./core.js";

export function createSanctuaryAccessibilityProfile(overrides = {}) {
  return {
    noFlash: true,               // Zero-strobe / zero-flash visual safety
    reducedMotion: true,         // Zero camera shake & zero particle distraction
    maxLowPassHz: 850,           // Gentle low-pass frequency ceiling
    maxAudioGainQ16: toQ16(0.08),
    descriptiveAudio: true,      // Screen-reader aria-live updates
    speechNarration: false,      // Opt-in Web Speech API spoken narration
    audioRadar: true,            // RNIB-style stereo proximity ping
    brailleTactileBar: true,     // 5-cell Unicode Braille spatial bar (U+2800..U+28FF)
    allowHaptics: false,         // Opt-in-only vibration cues
    timeScaleQ16: Q_ONE,         // Adjustable movement pacing (0.5x .. 1.5x)
    ...overrides,
  };
}

export function projectTernaryBearingQ16(dxQ16, dyQ16, deadzoneQ16 = toQ16(18)) {
  const tx = dxQ16 > deadzoneQ16 ? 1 : dxQ16 < -deadzoneQ16 ? -1 : 0;
  const ty = dyQ16 > deadzoneQ16 ? 1 : dyQ16 < -deadzoneQ16 ? -1 : 0;
  return { tx, ty };
}

export function renderBrailleRadarBar(tx, proximityQ16) {
  const p = Math.max(0, Math.min(Q_ONE, proximityQ16 | 0));
  const LEVELS = ["\u2800", "\u2844", "\u2866", "\u2877", "\u28FF"];
  const levelIdx = Math.min(4, Math.floor((p * 5) / (Q_ONE + 1)));
  const activeCell = LEVELS.at(levelIdx);
  const slot = tx < 0 ? 0 : tx > 0 ? 4 : 2;
  return Array.from({ length: 5 }, (_, i) => (i === slot ? activeCell : "\u2800")).join("");
}

export function computeSpatialSanctuaryCue({
  targetLabel = "Stone Lantern",
  targetHint = "",
  dxQ16 = 0,
  dyQ16 = 0,
  maxRangeQ16 = toQ16(540),
  profile = createSanctuaryAccessibilityProfile(),
}) {
  const { tx, ty } = projectTernaryBearingQ16(dxQ16, dyQ16);
  const dist = Math.hypot(Math.abs(fromQ16(dxQ16)), Math.abs(fromQ16(dyQ16)));
  const maxR = Math.max(1, fromQ16(maxRangeQ16));
  const proximity = Math.max(0, Math.min(1, 1 - dist / maxR));
  const proximityQ16 = toQ16(proximity);

  const dirWords = [
    ty < 0 ? "north" : ty > 0 ? "south" : "",
    tx < 0 ? "west" : tx > 0 ? "east" : "",
  ].filter(Boolean);
  const bearingDesc = dirWords.length > 0 ? dirWords.join("-") : "within reach";
  const pct = Math.round(proximity * 100);

  const ariaLiveText = profile.descriptiveAudio
    ? `${targetLabel}: ${bearingDesc} (${pct}% proximity). ${targetHint}`.trim()
    : "";

  const brailleBar = profile.brailleTactileBar ? renderBrailleRadarBar(tx, proximityQ16) : "";

  const rawCutoff = Math.round(240 + proximity * 420);
  const clampedCutoff = Math.min(profile.maxLowPassHz, rawCutoff);
  const safeGainQ16 = profile.audioRadar ? qMul(proximityQ16, profile.maxAudioGainQ16) : 0;

  return {
    ternaryBearing: { tx, ty },
    proximityQ16,
    proximityPercent: pct,
    bearingDesc,
    ariaLiveText,
    brailleBar,
    audioBeacon: {
      panQ16: tx < 0 ? toQ16(-0.75) : tx > 0 ? toQ16(0.75) : 0,
      pitchHz: clampedCutoff,
      safeGainQ16,
    },
    vibrateMs: profile.allowHaptics && proximity > 0.85 ? 25 : 0,
  };
}
