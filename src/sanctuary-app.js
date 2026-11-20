/**
 * src/sanctuary-app.js — Contemplative Audio-First Sanctuary Controller, Narrator & Braille HUD
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

import { Q_ONE, toQ16, fromQ16 } from "./core.js";
import {
  createSanctuaryAccessibilityProfile,
  computeSpatialSanctuaryCue,
} from "./accessibility-envelope.js";
import {
  createSanctuaryState,
  getPrimaryTargetNode,
  describeSurroundings,
  stepSanctuaryFrame,
  emitSanctuaryChime,
  releaseSanctuaryAttachment,
  buildContemplationReceipt,
} from "./parable-kernel.js";
import { createEcosystemFoleyAudio } from "./ecosystem-foley-audio.js";
import { renderAccessibleSanctuary } from "./accessible-sumi-renderer.js";

const FIXED_DT_MS = 1000 / 60;

function initSanctuary() {
  const canvas = document.getElementById("sanctuary-canvas");
  const ctx = canvas ? canvas.getContext("2d") : null;
  const audio = createEcosystemFoleyAudio();

  const hudStage = document.getElementById("hud-stage");
  const parableTitleEl = document.getElementById("parable-title");
  const parableQuoteEl = document.getElementById("parable-quote");
  const foleySummaryEl = document.getElementById("foley-summary");
  const brailleDisplayEl = document.getElementById("braille-radar");
  const bearingReadoutEl = document.getElementById("bearing-readout");
  const liveNarrationEl = document.getElementById("aria-narration");
  const musicLayerEl = document.getElementById("music-layer");

  const audioBtn = document.getElementById("btn-audio");
  const speechBtn = document.getElementById("btn-speech");
  const pacingBtn = document.getElementById("btn-pacing");
  const receiptBox = document.getElementById("receipt-output");

  let profile = createSanctuaryAccessibilityProfile();
  let state = createSanctuaryState();
  let lastSpokenSeq = 0;

  const keys = new Set();
  const touchDir = { x: 0, y: 0 };

  const speakIfEnabled = (text) => {
    if (!profile.speechNarration || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.92;
    window.speechSynthesis.speak(utter);
  };

  const syncAccessibleHud = () => {
    const target = getPrimaryTargetNode(state);
    const tx = fromQ16(state.traveler.xQ16);
    const ty = fromQ16(state.traveler.yQ16);

    const cue = computeSpatialSanctuaryCue({
      targetLabel: target.label,
      targetHint: target.description,
      dxQ16: toQ16(target.x - tx),
      dyQ16: toQ16(target.y - ty),
      profile,
    });

    if (hudStage) {
      hudStage.textContent =
        "Parable " + (state.stageIndex + 1) + "/4 | Yo Layers: " + state.unlockedLayers + "/4";
    }
    if (parableTitleEl) parableTitleEl.textContent = state.parable.title;
    if (parableQuoteEl) parableQuoteEl.textContent = state.parable.koanQuote;
    if (foleySummaryEl) foleySummaryEl.textContent = "Soundscape: " + state.parable.soundscapeSummary;
    if (brailleDisplayEl) brailleDisplayEl.textContent = cue.brailleBar;
    if (bearingReadoutEl) {
      bearingReadoutEl.textContent =
        target.label + " — " + cue.bearingDesc + " (" + cue.proximityPercent + "% proximity)";
    }
    if (musicLayerEl) musicLayerEl.textContent = state.parable.musicLayerUnlocked;

    if (liveNarrationEl && liveNarrationEl.textContent !== state.narrationLog) {
      liveNarrationEl.textContent = state.narrationLog;
    }
    if (state.narrationSeq !== lastSpokenSeq) {
      lastSpokenSeq = state.narrationSeq;
      speakIfEnabled(state.narrationLog);
    }

    return cue;
  };

  syncAccessibleHud();

  // Keyboard Navigation & Accessible Hotkeys
  window.addEventListener("keydown", (ev) => {
    const k = ev.key.toLowerCase();
    keys.add(k);
    if (k === " ") {
      ev.preventDefault();
      state = emitSanctuaryChime(state);
    } else if (k === "r") {
      ev.preventDefault();
      state = releaseSanctuaryAttachment(state);
    } else if (k === "l") {
      ev.preventDefault();
      state = describeSurroundings(state);
    }
  });

  window.addEventListener("keyup", (ev) => {
    keys.delete(ev.key.toLowerCase());
  });

  // On-Screen Accessible Action Buttons
  document.getElementById("btn-chime")?.addEventListener("click", () => {
    state = emitSanctuaryChime(state);
  });
  document.getElementById("btn-release")?.addEventListener("click", () => {
    state = releaseSanctuaryAttachment(state);
  });
  document.getElementById("btn-listen")?.addEventListener("click", () => {
    state = describeSurroundings(state);
  });

  // Directional Touch Buttons
  const bindMove = (id, dx, dy) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      touchDir.x = dx;
      touchDir.y = dy;
    });
    const stop = () => {
      touchDir.x = 0;
      touchDir.y = 0;
    };
    el.addEventListener("pointerup", stop);
    el.addEventListener("pointerleave", stop);
    el.addEventListener("pointercancel", stop);
  };
  bindMove("btn-up", 0, -1);
  bindMove("btn-down", 0, 1);
  bindMove("btn-left", -1, 0);
  bindMove("btn-right", 1, 0);

  audioBtn?.addEventListener("click", () => {
    const muted = audio.toggleMute();
    audioBtn.textContent = muted ? "Sound: Muted" : "🌊 Ecosystem Soundscape: ON";
  });

  speechBtn?.addEventListener("click", () => {
    profile = createSanctuaryAccessibilityProfile({
      ...profile,
      speechNarration: !profile.speechNarration,
    });
    speechBtn.textContent = profile.speechNarration ? "🗣️ Spoken Narration: ON" : "🗣️ Spoken Narration: OFF";
    if (profile.speechNarration) speakIfEnabled(state.narrationLog);
  });

  pacingBtn?.addEventListener("click", () => {
    const isSlow = profile.timeScaleQ16 < Q_ONE;
    profile = createSanctuaryAccessibilityProfile({
      ...profile,
      timeScaleQ16: isSlow ? Q_ONE : toQ16(0.5),
    });
    pacingBtn.textContent = isSlow ? "Pacing: 1.0x Normal" : "Pacing: 0.5x Gentle";
  });

  document.getElementById("btn-receipt")?.addEventListener("click", () => {
    if (receiptBox) receiptBox.value = JSON.stringify(buildContemplationReceipt(state), null, 2);
  });

  let lastTime = performance.now();
  let accumulator = 0;

  function loop(now) {
    accumulator += Math.min(100, now - lastTime);
    lastTime = now;

    let ix = touchDir.x;
    let iy = touchDir.y;
    if (keys.has("a") || keys.has("arrowleft")) ix -= 1;
    if (keys.has("d") || keys.has("arrowright")) ix += 1;
    if (keys.has("w") || keys.has("arrowup")) iy -= 1;
    if (keys.has("s") || keys.has("arrowdown")) iy += 1;

    while (accumulator >= FIXED_DT_MS) {
      state = stepSanctuaryFrame(state, toQ16(ix * 640), toQ16(iy * 640), profile.timeScaleQ16);
      for (const sfx of state.sfxQueue) {
        audio.playSfx(sfx);
      }
      accumulator -= FIXED_DT_MS;
    }

    const cue = syncAccessibleHud();
    audio.updateEnvironment(state, cue);
    if (ctx) renderAccessibleSanctuary(ctx, state);
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

window.addEventListener("DOMContentLoaded", initSanctuary);
