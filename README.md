> ### ✅ RELEASE v1.0.0 — AUDIO-FIRST & LOW-VISION PARABLE SANCTUARY (PROOF OF CONCEPT)
> **Status:** `v1.0.0` Verified Proof of Concept (`3/3` Tests Passing) • Zero-Float `Q16.16` • Social Model Accessibility (`07` + `08`)  
> 
> **Proof-of-Concept Scope (Nov 2026):** An experimental, zero-dependency, audio-first and low-vision-accessible reimagining of [`Borealiscodes/Zen-Parable-Geometry-Odyssey`](https://github.com). Demonstrates how deterministic `Q16.16` node puzzles (`Ledger 1`) can be navigated entirely by ear, screen reader (`aria-live` + optional `speechSynthesis`), refreshable Braille (`U+2800`–`U+28FF`), and WCAG AAA high-contrast visuals (`Ledger 2`) using the Social Model primitives from [`Borealiscodes/ndh-game-dev-kit`](https://github.com).

# ⛩ Zen Parable Audio Sanctuary — Contemplative Soundscape & Accessible Koan Odyssey

**An open, zero-dependency, audio-first interactive sanctuary translating four classical Zen parables into spatial WebAudio soundscapes, procedural ecosystem foley (flowing mountain rivers, fluttering silk banners, pouring bamboo water), stereo proximity beacons, and deterministic `Q16.16` contemplation puzzles.**

[![License: MIT](https://shields.io)](LICENSE)
[![Status: v1.0.0 Proof of Concept](https://shields.io)](#-quickstart--verification)
[![Accessibility: Social Model 07+08](https://shields.io)](#-social-model-accessibility-architecture)
[![Tests: 3/3 Passing](https://shields.io)](#-quickstart--verification)

---

## 📖 Companion Design Guide & Explainer Tile

* **Audio-First & Social Model Design Guide (APA 7th Ed.):** [`docs/audio-first-zen-design-guide.md`](docs/audio-first-zen-design-guide.md) — Connects Oliver's Social Model of Disability, RNIB audio-first navigation guidelines, and WCAG 2.2 / WAI-ARIA 1.2 standards to `Ledger 1` / `Ledger 2` architecture.
* **Plain-Language Explainer Tile:** [`tiles/bill-nye-soundscape-navigation-explainer.md`](tiles/bill-nye-soundscape-navigation-explainer.md) — Altitude `A7` plain-language walkthrough of stereo panning (`StereoPannerNode`), noise-filtered rivers and wind, and 5-cell Unicode Braille spatial bars.

---

## 🌐 Social Model Accessibility Architecture

Built around the **Social Model of Disability** (removing environmental barriers in the interface rather than labeling players) via [`ndh-game-dev-kit`](https://github.com) (`07-sensory-regulation-envelope` + `08-nonvisual-spatial-bridge`):

* **Sensory Regulation Envelope (`src/accessibility-envelope.js`):** Enforces zero strobe flashes (`noFlash: true`), zero screen shake (`reducedMotion: true`), a master `820 Hz` low-pass audio filter with gentle attack envelopes, opt-in-only haptics (`allowHaptics: false` by default), and toggleable `0.5x` / `1.0x` movement pacing (`timeScaleQ16`).
* **Non-Visual Spatial Bridge (`src/accessibility-envelope.js`):** Projects target offsets onto balanced ternary bearings `{-1, 0, +1}`, driving stereo-panned proximity pings, live `role="status"` / `aria-live="polite"` narration (**Listen Around** via `L`), opt-in `speechSynthesis` voice readouts, a **5-cell Unicode Braille spatial radar (`U+2800`–`U+28FF`)**, and WCAG AAA high-contrast visuals with distinct geometric node shapes (`CIRCLE`, `TRIANGLE`, `SQUARE`, `DIAMOND`).

---

## 🍵 4-Parable Narrative & Ecosystem Soundscape Matrix

| Stage | Classical Parable / Koan | Contemplative Narrative & Puzzle | Procedural Ecosystem Foley + *Yo*-Scale Layer |
| :--- | :--- | :--- | :--- |
| **1** | ***The Sound of One Hand*** *(Master Hakuin)* | Distinguish the loud double clap of the twin *Bonshō* bells (which raises mist) from the solitary *Tōrō* stone lantern (`Space` to chime). | High cedar mountain breeze, bronze temple resonance, and **Layer 1: *Shakuhachi* bamboo flute (`D4`)**. |
| **2** | ***The Raft & The Shore*** *(Majjhima Nikāya 22)* | Board the cedar raft at the West River Pier (`Space`), cross the stream, and release the raft on the East Sanctuary Shore (`R`). | Stereo-panned, low-pass filtered **flowing mountain river** (`340 Hz`) + **Layer 2: Plucked *Koto* arpeggio**. |
| **3** | ***Two Monks & The Flag*** *(Mumonkan Case 29)* | Chime the central *Iwakura* stillness stone (`Space` ×3) to bring three fluttering silk banners into quiet stillness. | Bandpass-filtered **wind-fluttering silk banners** whose modulation slows to stillness + **Layer 3: Deep *Taiko* pulse**. |
| **4** | ***The Empty Cup*** *(Master Nan-in)* | Pour four measures (`R` ×4) from the overflowing *Tsukubai* water basin (`4/4 → 0/4`) until clear spring stillness remains. | Descending **water-pour stream** + **Layer 4: Resonant *Bonshō* temple bell overtones**. |

---

## 📁 Repository Structure

```text
Zen-Parable-Audio-Sanctuary/
├── index.html                                         # High-contrast layout, aria-live narration log, Braille radar & controls
├── style.css                                          # WCAG AAA obsidian/parchment styling & thick keyboard focus rings
├── package.json                                       # Zero-dependency ESM manifest (`npm test` -> `node --test`)
├── LICENSE                                            # MIT License
├── README.md                                          # Proof-of-concept overview, Social Model architecture & quickstart
├── docs/
│   └── audio-first-zen-design-guide.md                # Guide to RNIB spatial audio, foley synthesis & Social Model design
├── tiles/
│   └── bill-nye-soundscape-navigation-explainer.md    # Altitude A7 plain-language explainer of stereo pan, filters & Braille
├── src/
│   ├── core.js                                        # Zero-float Q16.16 fixed-point math & synchronous SHA-256 receipt
│   ├── accessibility-envelope.js                      # Composes 07-sensory-regulation-envelope & 08-nonvisual-spatial-bridge
│   ├── parables-narrative-data.js                     # Expanded contemplative parables, foley profiles & spatial node layouts
│   ├── parable-kernel.js                              # Deterministic Q16.16 movement, chime/release & 4-stage progression
│   ├── ecosystem-foley-audio.js                       # Procedural river, wind-fluttering banners, water-pour & Yo-scale synth
│   ├── accessible-sumi-renderer.js                    # Zero-strobe, WCAG AAA shape-redundant high-contrast canvas renderer
│   └── sanctuary-app.js                               # 60 Hz loop, keyboard/touch controls, Listen-Around (L) & speech toggle
└── test/
    └── sanctuary-kernel.test.mjs                      # Built-in `node --test` suite verifying all 4 parables & Braille cues
```

---

## 🚀 Quickstart & Verification

```bash
# 1. Run deterministic 4-parable, Braille radar & SHA-256 receipt tests (3/3 passing)
node --test test/sanctuary-kernel.test.mjs

# 2. Launch locally over IPv4 in browser
python3 -m http.server 8086 --bind 127.0.0.1
```

Open **`http://127.0.0.1:8086`**, tap **`Sound: Muted`** to awaken the **procedural river, banner wind, water-pour foley, stereo proximity beacons, and 4-layer *Yo*-scale ensemble**, toggle **`🗣️ Spoken Narration: OFF`** for spoken updates, steer with `WASD` / Arrow keys / touch buttons, chime with `Space`, release/pour with `R`, and listen to your surroundings anytime with `L`.

---

## 🤝 Provenance & License

* **Architectural Lineage:** Adapted from [`Borealiscodes/Zen-Parable-Geometry-Odyssey`](https://github.com) using the Social Model accessibility primitives (`07` & `08`) from [`Borealiscodes/ndh-game-dev-kit`](https://github.com).
* **Author & License:** Borealis Serenity Hedling (`NDH-RESEARCH-PILOT` • County Dublin, Ireland) • MIT License • `Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>`.
