/**
 * src/parable-kernel.js — Deterministic Q16.16 Contemplative Parable Simulation (Ledger 1)
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

import { Q_ONE, toQ16, fromQ16, qAdd, qMul, sha256Hex } from "./core.js";
import { SANCTUARY_PARABLES } from "./parables-narrative-data.js";
import {
  createSanctuaryAccessibilityProfile,
  computeSpatialSanctuaryCue,
} from "./accessibility-envelope.js";

export const SANCTUARY_W = 640;
export const SANCTUARY_H = 380;

export function createSanctuaryState() {
  const first = SANCTUARY_PARABLES.at(0);
  const initialState = {
    tick: 0,
    stageIndex: 0,
    parable: first,
    completedAll: false,
    traveler: {
      xQ16: toQ16(110),
      yQ16: toQ16(200),
      vxQ16: 0,
      vyQ16: 0,
    },
    // Stage-specific deterministic state
    mistCleared: false,
    carryingRaft: false,
    raftCrossed: false,
    bannersCalmed: 0, // 0 .. 3
    cupFillLevel: 4,  // 4 -> 0
    unlockedLayers: 1,
    activeNodeIndex: 0,
    narrationLog: first.surroundingsNarration,
    narrationSeq: 1,
    sfxQueue: [], // ["CHIME", "MIST", "BOARD", "POUR", "STAGE_CLEAR"]
  };
  return initialState;
}

export function getPrimaryTargetNode(state) {
  const nodes = state.parable.nodes;
  if (state.stageIndex === 0) {
    return nodes.at(1); // Solitary Toro Lantern is the true path
  }
  if (state.stageIndex === 1) {
    return state.carryingRaft ? nodes.at(1) : nodes.at(0);
  }
  return nodes.at(0);
}

export function describeSurroundings(state) {
  const target = getPrimaryTargetNode(state);
  const tx = fromQ16(state.traveler.xQ16);
  const ty = fromQ16(state.traveler.yQ16);
  const cue = computeSpatialSanctuaryCue({
    targetLabel: target.label,
    targetHint: target.description,
    dxQ16: toQ16(target.x - tx),
    dyQ16: toQ16(target.y - ty),
  });

  const extraStatus =
    state.stageIndex === 1
      ? state.carryingRaft
        ? " You are currently crossing with the wooden raft."
        : " The wooden raft awaits at the West Pier."
      : state.stageIndex === 2
      ? ` ${state.bannersCalmed} of 3 silk banners are now still.`
      : state.stageIndex === 3
      ? ` The Tsukubai basin is ${state.cupFillLevel} of 4 full.`
      : "";

  return {
    ...state,
    narrationSeq: state.narrationSeq + 1,
    narrationLog: `${state.parable.surroundingsNarration}${extraStatus} Nearest focus — ${cue.ariaLiveText}`,
  };
}

function advanceToNextParable(state, clearMessage) {
  if (state.stageIndex >= SANCTUARY_PARABLES.length - 1) {
    return {
      ...state,
      completedAll: true,
      unlockedLayers: 4,
      narrationSeq: state.narrationSeq + 1,
      narrationLog:
        clearMessage +
        " All four parables are complete. The sanctuary rests in clear stillness; all four Yo-scale layers resonate together.",
      sfxQueue: [...state.sfxQueue, "STAGE_CLEAR"],
    };
  }

  const nextIdx = state.stageIndex + 1;
  const nextParable = SANCTUARY_PARABLES.at(nextIdx);
  return {
    ...state,
    stageIndex: nextIdx,
    parable: nextParable,
    unlockedLayers: nextIdx + 1,
    traveler: { xQ16: toQ16(110), yQ16: toQ16(200), vxQ16: 0, vyQ16: 0 },
    narrationSeq: state.narrationSeq + 1,
    narrationLog: clearMessage + " — Entering " + nextParable.title + ". " + nextParable.surroundingsNarration,
    sfxQueue: [...state.sfxQueue, "STAGE_CLEAR"],
  };
}

export function stepSanctuaryFrame(state, moveXQ16 = 0, moveYQ16 = 0, timeScaleQ16 = Q_ONE) {
  const tick = state.tick + 1;
  const dtQ16 = qMul(toQ16(1.0 / 60.0), timeScaleQ16);
  const dampQ16 = toQ16(0.86);

  const vx = qMul(qAdd(state.traveler.vxQ16, qMul(moveXQ16, dtQ16)), dampQ16);
  const vy = qMul(qAdd(state.traveler.vyQ16, qMul(moveYQ16, dtQ16)), dampQ16);

  let fx = fromQ16(qAdd(state.traveler.xQ16, qMul(vx, dtQ16)));
  let fy = fromQ16(qAdd(state.traveler.yQ16, qMul(vy, dtQ16)));

  fx = Math.max(40, Math.min(SANCTUARY_W - 40, fx));
  fy = Math.max(55, Math.min(SANCTUARY_H - 45, fy));

  return {
    ...state,
    tick,
    traveler: {
      xQ16: toQ16(fx),
      yQ16: toQ16(fy),
      vxQ16: vx,
      vyQ16: vy,
    },
    sfxQueue: [],
  };
}

export function emitSanctuaryChime(state) {
  const px = fromQ16(state.traveler.xQ16);
  const py = fromQ16(state.traveler.yQ16);

  // Find nearest node within 75px reach
  let nearest = null;
  let bestDist = 75;
  for (const node of state.parable.nodes) {
    const d = Math.hypot(px - node.x, py - node.y);
    if (d <= bestDist) {
      bestDist = d;
      nearest = node;
    }
  }

  if (!nearest) {
    const target = getPrimaryTargetNode(state);
    const cue = computeSpatialSanctuaryCue({
      targetLabel: target.label,
      dxQ16: toQ16(target.x - px),
      dyQ16: toQ16(target.y - py),
    });
    return {
      ...state,
      narrationSeq: state.narrationSeq + 1,
      narrationLog: `Your chime echoes across the garden. ${cue.ariaLiveText}`,
      sfxQueue: [...state.sfxQueue, "CHIME"],
    };
  }

  if (nearest.role === "CLAP") {
    return {
      ...state,
      mistCleared: false,
      narrationSeq: state.narrationSeq + 1,
      narrationLog:
        "The twin Bonsho bells clap loudly—thick mist gathers over the gate. Seek the solitary Toro lantern to the east.",
      sfxQueue: [...state.sfxQueue, "MIST"],
    };
  }

  if (nearest.role === "ONE_HAND") {
    return advanceToNextParable(
      { ...state, mistCleared: true },
      "A single clear note rings from the Toro stone lantern; the mist dissolves without effort"
    );
  }

  if (nearest.role === "BOARD_RAFT") {
    return {
      ...state,
      carryingRaft: true,
      traveler: { ...state.traveler, xQ16: toQ16(435), yQ16: toQ16(210) },
      narrationSeq: state.narrationSeq + 1,
      narrationLog:
        "You step onto the cedar raft and glide across the mountain river to the East Shore. Press Release (R) to leave the raft behind.",
      sfxQueue: [...state.sfxQueue, "BOARD"],
    };
  }

  if (nearest.role === "CALM_BANNERS") {
    const nextBanners = Math.min(3, state.bannersCalmed + 1);
    if (nextBanners >= 3) {
      return advanceToNextParable(
        { ...state, bannersCalmed: 3 },
        "All three silk banners settle into quiet stillness; neither wind nor flag moves"
      );
    }
    return {
      ...state,
      bannersCalmed: nextBanners,
      narrationSeq: state.narrationSeq + 1,
      narrationLog: `The Iwakura stone resonates. Banner ${nextBanners} of 3 settles into stillness (${3 - nextBanners} still fluttering in the wind).`,
      sfxQueue: [...state.sfxQueue, "CHIME"],
    };
  }

  return {
    ...state,
    narrationSeq: state.narrationSeq + 1,
    narrationLog: `Beside ${nearest.label}. Press Release (R) to pour and let go.`,
    sfxQueue: [...state.sfxQueue, "CHIME"],
  };
}

export function releaseSanctuaryAttachment(state) {
  const px = fromQ16(state.traveler.xQ16);
  const py = fromQ16(state.traveler.yQ16);

  if (state.stageIndex === 1) {
    const eastBank = state.parable.nodes.at(1);
    if (state.carryingRaft && Math.hypot(px - eastBank.x, py - eastBank.y) <= 85) {
      return advanceToNextParable(
        { ...state, carryingRaft: false, raftCrossed: true },
        "You step ashore and release the cedar raft back to the river current"
      );
    }
    return {
      ...state,
      narrationSeq: state.narrationSeq + 1,
      narrationLog: state.carryingRaft
        ? "Move closer to the East Sanctuary Shore before releasing the raft."
        : "Board the raft at the West Pier first, then cross to the East Shore.",
    };
  }

  if (state.stageIndex === 3) {
    const basin = state.parable.nodes.at(0);
    if (Math.hypot(px - basin.x, py - basin.y) <= 85) {
      const nextFill = Math.max(0, state.cupFillLevel - 1);
      if (nextFill === 0) {
        return advanceToNextParable(
          { ...state, cupFillLevel: 0 },
          "The Tsukubai basin empties completely (0 of 4); clear spring water reflects the sky"
        );
      }
      return {
        ...state,
        cupFillLevel: nextFill,
        narrationSeq: state.narrationSeq + 1,
        narrationLog: `You pour one measure from the bamboo ladle. Tsukubai basin is now ${nextFill} of 4 full.`,
        sfxQueue: [...state.sfxQueue, "POUR"],
      };
    }
    return {
      ...state,
      narrationSeq: state.narrationSeq + 1,
      narrationLog: "Move closer to the central Tsukubai water basin to pour.",
    };
  }

  return {
    ...state,
    narrationSeq: state.narrationSeq + 1,
    narrationLog: "Nothing to release here—emit a Chime (Space) to listen and interact.",
  };
}

export function buildContemplationReceipt(state) {
  const payload = {
    schema: "ndh.zen.parable.audio.sanctuary.v1",
    stageReached: state.stageIndex + 1,
    parableSlug: state.parable.slug,
    completedAll: state.completedAll,
    unlockedYoLayers: state.unlockedLayers,
    bannersCalmed: state.bannersCalmed,
    cupFillLevel: state.cupFillLevel,
  };
  return {
    ...payload,
    sha256: sha256Hex(JSON.stringify(payload)),
  };
}
