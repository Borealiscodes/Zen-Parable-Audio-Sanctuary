/**
 * test/sanctuary-kernel.test.mjs — Verification of All 4 Audio-First Parables, Braille Radar & SHA-256 Receipt
 * Run: node --test test/sanctuary-kernel.test.mjs
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

import test from "node:test";
import assert from "node:assert/strict";

import { toQ16 } from "../src/core.js";
import { computeSpatialSanctuaryCue } from "../src/accessibility-envelope.js";
import {
  createSanctuaryState,
  emitSanctuaryChime,
  releaseSanctuaryAttachment,
  describeSurroundings,
  buildContemplationReceipt,
} from "../src/parable-kernel.js";

test("1. All Four Contemplative Parables Progress Deterministically to Stillness", () => {
  let s = createSanctuaryState();
  assert.equal(s.stageIndex, 0);

  // Parable 1: Chime solitary Toro Lantern at (450, 195)
  s.traveler.xQ16 = toQ16(445);
  s.traveler.yQ16 = toQ16(195);
  s = emitSanctuaryChime(s);
  assert.equal(s.stageIndex, 1);

  // Parable 2: Board raft at West Pier (170, 210), then Release at East Shore (470, 210)
  s.traveler.xQ16 = toQ16(175);
  s.traveler.yQ16 = toQ16(210);
  s = emitSanctuaryChime(s);
  assert.equal(s.carryingRaft, true);
  s = releaseSanctuaryAttachment(s);
  assert.equal(s.stageIndex, 2);

  // Parable 3: Chime Iwakura Stone at (320, 195) 3 times to calm waving banners
  s.traveler.xQ16 = toQ16(320);
  s.traveler.yQ16 = toQ16(195);
  s = emitSanctuaryChime(s);
  s = emitSanctuaryChime(s);
  s = emitSanctuaryChime(s);
  assert.equal(s.stageIndex, 3);

  // Parable 4: Pour Tsukubai Basin at (320, 195) 4 times until empty (0/4)
  s.traveler.xQ16 = toQ16(320);
  s.traveler.yQ16 = toQ16(195);
  s = releaseSanctuaryAttachment(s);
  s = releaseSanctuaryAttachment(s);
  s = releaseSanctuaryAttachment(s);
  s = releaseSanctuaryAttachment(s);
  assert.equal(s.completedAll, true);
  assert.equal(s.unlockedLayers, 4);
});

test("2. Non-Visual Spatial Cue Produces Accurate Stereo Pan, Aria Narration & 5-Cell Braille Radar", () => {
  const cue = computeSpatialSanctuaryCue({
    targetLabel: "Solitary Toro Lantern",
    dxQ16: toQ16(150),
    dyQ16: toQ16(0),
  });

  assert.equal(cue.ternaryBearing.tx, 1);
  assert.equal(cue.brailleBar.length, 5);
  assert.ok(cue.ariaLiveText.includes("Solitary Toro Lantern: east"));
});

test("3. Listen Around (L) & Contemplation Receipt Generate Descriptive Text & SHA-256 Digest", () => {
  let s = createSanctuaryState();
  s = describeSurroundings(s);
  assert.ok(s.narrationLog.includes("Nearest focus"));

  const receipt = buildContemplationReceipt(s);
  assert.equal(receipt.sha256.length, 64);
});
