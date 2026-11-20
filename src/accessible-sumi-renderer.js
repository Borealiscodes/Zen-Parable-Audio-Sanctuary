/**
 * src/accessible-sumi-renderer.js — WCAG AAA High-Contrast & Shape-Redundant Low-Vision Renderer (Ledger 2)
 * Zero strobing, zero screen shake, thick 4px geometric node silhouettes (CIRCLE, TRIANGLE,
 * SQUARE, DIAMOND), high-contrast labels, and visual stereo-bearing guidance.
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

import { fromQ16 } from "./core.js";
import { getPrimaryTargetNode } from "./parable-kernel.js";

function drawDistinctShape(ctx, shape, cx, cy, r) {
  ctx.beginPath();
  if (shape === "TRIANGLE") {
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(cx + r, cy + r * 0.85);
    ctx.lineTo(cx - r, cy + r * 0.85);
    ctx.closePath();
  } else if (shape === "SQUARE") {
    ctx.rect(cx - r * 0.85, cy - r * 0.85, r * 1.7, r * 1.7);
  } else if (shape === "DIAMOND") {
    ctx.moveTo(cx, cy - r * 1.1);
    ctx.lineTo(cx + r * 1.1, cy);
    ctx.lineTo(cx, cy + r * 1.1);
    ctx.lineTo(cx - r * 1.1, cy);
    ctx.closePath();
  } else {
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
  }
}

export function renderAccessibleSanctuary(ctx, state) {
  const { width, height } = ctx.canvas;

  // 1. Steady WCAG AAA high-contrast obsidian ink backdrop (zero flicker)
  ctx.fillStyle = "#09090b";
  ctx.fillRect(0, 0, width, height);

  // Outer high-contrast boundary frame
  ctx.strokeStyle = "#f8fafc";
  ctx.lineWidth = 3;
  ctx.strokeRect(16, 16, width - 32, height - 32);

  // 2. Stage-Specific Environmental Landmarks (River / Waving Banners / Tsukubai Basin)
  if (state.stageIndex === 1) {
    // Flowing Mountain River Channel across center
    ctx.fillStyle = "#0c4a6e";
    ctx.fillRect(255, 20, 130, height - 40);
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 3;
    ctx.strokeRect(255, 20, 130, height - 40);

    ctx.fillStyle = "#e0f2fe";
    ctx.font = "bold 13px monospace";
    ctx.textAlign = "center";
    ctx.fillText("MOUNTAIN RIVER", 320, 48);
    ctx.textAlign = "left";
  }

  if (state.stageIndex === 2) {
    // Three Silk Temple Banners above the courtyard (waving amplitude slows as banners are calmed)
    for (let i = 0; i < 3; i++) {
      const bx = 200 + i * 120;
      const isStill = i < state.bannersCalmed;
      const wave = isStill ? 0 : Math.sin(state.tick * 0.14 + i * 1.8) * 14;

      ctx.strokeStyle = isStill ? "#4ade80" : "#fbbf24";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(bx, 48);
      ctx.quadraticCurveTo(bx + wave, 82, bx - wave * 0.6, 114);
      ctx.stroke();

      ctx.fillStyle = isStill ? "#4ade80" : "#fde047";
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.fillText(isStill ? "STILL" : "WAVING", bx, 132);
      ctx.textAlign = "left";
    }
  }

  if (state.stageIndex === 3) {
    // Tsukubai Water Level Indicator Ring
    ctx.fillStyle = "#fde047";
    ctx.font = "bold 13px monospace";
    ctx.textAlign = "center";
    ctx.fillText("TSUKUBAI FILL: " + state.cupFillLevel + " / 4", 320, 52);
    ctx.textAlign = "left";
  }

  // 3. Interactive Parable Nodes (Distinct Geometric Shapes + High-Contrast Labels)
  const primary = getPrimaryTargetNode(state);
  for (const node of state.parable.nodes) {
    const isTarget = primary && primary.id === node.id;
    ctx.fillStyle = isTarget ? "#1e1b4b" : "#18181b";
    ctx.strokeStyle = isTarget ? "#fde047" : "#f8fafc";
    ctx.lineWidth = isTarget ? 4.5 : 3;

    drawDistinctShape(ctx, node.shape, node.x, node.y, 26);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isTarget ? "#fde047" : "#f8fafc";
    ctx.font = "bold 12px monospace";
    ctx.textAlign = "center";
    ctx.fillText(node.label.toUpperCase(), node.x, node.y + 44);
    ctx.textAlign = "left";
  }

  // 4. Traveler Guiding Beacon Line & High-Contrast Traveler Marker
  const tx = fromQ16(state.traveler.xQ16);
  const ty = fromQ16(state.traveler.yQ16);

  if (primary) {
    ctx.save();
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = "rgba(253, 224, 71, 0.55)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(primary.x, primary.y);
    ctx.stroke();
    ctx.restore();
  }

  ctx.fillStyle = "#38bdf8";
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(tx, ty, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 12px monospace";
  ctx.textAlign = "center";
  ctx.fillText(state.carryingRaft ? "YOU + RAFT" : "YOU", tx, ty - 22);
  ctx.textAlign = "left";
}
