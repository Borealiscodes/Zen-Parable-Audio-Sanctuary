/**
 * src/ecosystem-foley-audio.js — Procedural Ecosystem Foley, Stereo Proximity Beacons & Yo-Scale Ensemble (Ledger 2)
 * Synthesizes continuous, low-pass filtered natural soundscapes in pure WebAudio API:
 *   - Flowing Mountain River (pink/brown noise modulated by slow current LFO, panned in stereo)
 *   - Waving Silk Banners in Wind (bandpass breeze whose flutter slows as banners are calmed)
 *   - Pouring Bamboo Water & Tsukubai Basin Trickle
 *   - Stereo RNIB Proximity Ping & 4-Layer Japanese Yo-Scale (D4, E4, G4, A4, B4)
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

import { fromQ16 } from "./core.js";

const YO_SCALE_HZ = [293.66, 329.63, 392.00, 440.00, 493.88, 587.33]; // D4, E4, G4, A4, B4, D5

export function createEcosystemFoleyAudio() {
  let muted = true;
  let ctx = null;
  let masterFilter = null;
  let masterGain = null;

  // Continuous foley nodes
  let riverGain = null;
  let riverPanner = null;
  let windGain = null;
  let windFilter = null;
  let seqTimer = null;
  let step = 0;

  const ensureGraph = () => {
    if (!ctx && typeof window !== "undefined") {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();

      // Master sensory-regulation low-pass filter (<= 850 Hz) & gentle gain ceiling
      masterFilter = ctx.createBiquadFilter();
      masterFilter.type = "lowpass";
      masterFilter.frequency.setValueAtTime(820, ctx.currentTime);

      masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.08, ctx.currentTime);

      masterFilter.connect(masterGain);
      masterGain.connect(ctx.destination);

      // Build 3-second seamless brown/pink noise loop buffer for river & wind foley
      const bufLen = ctx.sampleRate * 3;
      const noiseBuf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const data = noiseBuf.getChannelData(0);
      let lastOut = 0;
      for (let i = 0; i < bufLen; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + 0.035 * white) / 1.035;
        data[i] = lastOut * 2.8;
      }

      // 1. Flowing River Channel (low-passed + stereo panned)
      const riverSrc = ctx.createBufferSource();
      riverSrc.buffer = noiseBuf;
      riverSrc.loop = true;

      const riverFilter = ctx.createBiquadFilter();
      riverFilter.type = "lowpass";
      riverFilter.frequency.setValueAtTime(340, ctx.currentTime);

      riverPanner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      riverGain = ctx.createGain();
      riverGain.gain.setValueAtTime(0.01, ctx.currentTime);

      riverSrc.connect(riverFilter);
      if (riverPanner) {
        riverFilter.connect(riverPanner);
        riverPanner.connect(riverGain);
      } else {
        riverFilter.connect(riverGain);
      }
      riverGain.connect(masterFilter);
      riverSrc.start();

      // 2. Mountain Breeze & Waving Silk Banners Channel (bandpass modulated)
      const windSrc = ctx.createBufferSource();
      windSrc.buffer = noiseBuf;
      windSrc.loop = true;

      windFilter = ctx.createBiquadFilter();
      windFilter.type = "bandpass";
      windFilter.frequency.setValueAtTime(480, ctx.currentTime);
      windFilter.Q.setValueAtTime(2.2, ctx.currentTime);

      windGain = ctx.createGain();
      windGain.gain.setValueAtTime(0.01, ctx.currentTime);

      windSrc.connect(windFilter);
      windFilter.connect(windGain);
      windGain.connect(masterFilter);
      windSrc.start();
    }

    if (ctx && ctx.state === "suspended") ctx.resume();
    return ctx;
  };

  const playGentleTone = (freq, type, peak, attack, decay, pan = 0) => {
    const ac = ensureGraph();
    if (!ac || muted || !freq) return;

    const now = ac.currentTime;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    const panner = ac.createStereoPanner ? ac.createStereoPanner() : null;

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(peak, now + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

    osc.connect(gain);
    if (panner) {
      panner.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), now);
      gain.connect(panner);
      panner.connect(masterFilter);
    } else {
      gain.connect(masterFilter);
    }

    osc.start(now);
    osc.stop(now + decay + 0.05);
  };

  const startYoEnsemble = () => {
    if (seqTimer && typeof window !== "undefined") {
      window.clearInterval(seqTimer);
      seqTimer = null;
    }
    if (muted || typeof window === "undefined") return;

    seqTimer = window.setInterval(() => {
      if (muted) return;
      const idx = step % YO_SCALE_HZ.length;
      // Layer 1: Shakuhachi breath drone (always active when unmuted)
      if (step % 4 === 0) {
        playGentleTone(YO_SCALE_HZ.at(idx), "sine", 0.055, 0.28, 1.9, -0.2);
      }
      // Layer 2: Plucked Koto water arpeggio (Stage 2+)
      if (currentLayers >= 2 && step % 2 === 0) {
        playGentleTone(YO_SCALE_HZ.at((idx + 2) % YO_SCALE_HZ.length), "triangle", 0.045, 0.03, 0.9, 0.25);
      }
      // Layer 3: Deep Taiko heartbeat pulse (Stage 3+)
      if (currentLayers >= 3 && step % 4 === 2) {
        playGentleTone(73.42, "sine", 0.08, 0.02, 0.65, 0);
      }
      // Layer 4: Bonsho temple bell overtone (Stage 4+)
      if (currentLayers >= 4 && step % 8 === 0) {
        playGentleTone(587.33, "sine", 0.04, 0.05, 2.4, 0);
      }
      step++;
    }, 520);
  };

  let currentLayers = 1;

  return {
    isMuted: () => muted,
    toggleMute: () => {
      muted = !muted;
      if (!muted) {
        ensureGraph();
        startYoEnsemble();
      } else {
        if (seqTimer && typeof window !== "undefined") {
          window.clearInterval(seqTimer);
          seqTimer = null;
        }
        if (riverGain && ctx) riverGain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.1);
        if (windGain && ctx) windGain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.1);
      }
      return muted;
    },
    updateEnvironment: (state, spatialCue) => {
      currentLayers = state.unlockedLayers;
      if (muted || !ctx) return;
      const now = ctx.currentTime;
      const foley = state.parable.foleyProfile;

      // 1. River current volume & stereo pan relative to center river (x = 320)
      const tx = fromQ16(state.traveler.xQ16);
      const riverPan = Math.max(-0.85, Math.min(0.85, (320 - tx) / 260));
      const riverProximity = Math.max(0.15, 1 - Math.abs(320 - tx) / 300);
      if (riverGain) {
        riverGain.gain.setTargetAtTime(foley.riverLevel * 0.16 * riverProximity, now, 0.15);
      }
      if (riverPanner) {
        riverPanner.pan.setTargetAtTime(riverPan, now, 0.15);
      }

      // 2. Waving silk banners in wind (flutter speed & loudness drop as banners are calmed)
      const activeBanners = Math.max(0, 3 - state.bannersCalmed);
      const flutterRatio = state.stageIndex === 2 ? activeBanners / 3 : 0.35;
      const gustMod = 0.65 + 0.35 * Math.sin(state.tick * (0.04 + flutterRatio * 0.14));
      if (windGain) {
        windGain.gain.setTargetAtTime(foley.windLevel * 0.14 * flutterRatio * gustMod, now, 0.15);
      }
      if (windFilter) {
        windFilter.frequency.setTargetAtTime(360 + flutterRatio * 240, now, 0.2);
      }

      // 3. Periodic gentle RNIB stereo proximity beacon ping (every ~1.5s = 90 ticks)
      if (state.tick % 90 === 0 && spatialCue && spatialCue.audioBeacon.safeGainQ16 > 0) {
        const pan = fromQ16(spatialCue.audioBeacon.panQ16);
        const gain = fromQ16(spatialCue.audioBeacon.safeGainQ16);
        playGentleTone(spatialCue.audioBeacon.pitchHz, "sine", gain, 0.04, 0.45, pan);
      }
    },
    playSfx: (kind) => {
      if (muted) return;
      if (kind === "CHIME") {
        playGentleTone(587.33, "sine", 0.07, 0.02, 1.3, 0);
      } else if (kind === "MIST") {
        playGentleTone(146.83, "triangle", 0.08, 0.02, 0.9, -0.4);
      } else if (kind === "BOARD") {
        playGentleTone(329.63, "triangle", 0.07, 0.03, 0.8, 0);
        setTimeout(() => playGentleTone(440.00, "sine", 0.06, 0.03, 0.9, 0.2), 140);
      } else if (kind === "POUR") {
        playGentleTone(493.88, "sine", 0.06, 0.02, 0.6, 0);
        setTimeout(() => playGentleTone(392.00, "sine", 0.06, 0.02, 0.7, 0), 120);
      } else if (kind === "STAGE_CLEAR") {
        [293.66, 329.63, 392.00, 440.00, 587.33].forEach((f, i) => {
          setTimeout(() => playGentleTone(f, "sine", 0.07, 0.04, 1.6, 0), i * 160);
        });
      }
    },
  };
}
