> ### 🏗️ UNDER CONSTRUCTION — AUDIO-FIRST & LOW-VISION CONTEMPLATIVE PARABLE SANCTUARY (PRE-ALPHA)
> **Status:** Active Architectural Scaffolding & Procedural Foley Prototyping • Zero-Float `Q16.16` • Social Model Accessibility (`07` + `08`)  

**Project Scope:** An audio-first, accessible interactive sanctuary translating classical Zen koans into spatial soundscapes and deterministic `Q16.16` node puzzles, featuring procedural foley, RNIB-style spatial beacons, `aria-live` narration, and a Unicode Braille radar.

# ⛩ Zen Parable Audio Sanctuary — Contemplative Soundscape & Accessible Koan Odyssey

An open, zero-dependency, audio-first interactive experience exploring four Zen parables through spatial audio and accessible design.

---

## 🌐 Social Model Accessibility Architecture

Built using the Social Model of Disability via components from [`ndh-game-dev-kit`](https://github.com) (`07-sensory-regulation-envelope` + `08-nonvisual-spatial-bridge`):
* **Sensory Regulation:** Zero strobe/camera shake, audio safety caps (`<= 850 Hz`), opt-in haptics, and adjustable `Q16.16` pacing.
* **Non-Visual Spatial Bridge:** Stereo proximity beacons, `aria-live` and Web Speech narration (*Listen Around* via `L`), a 5-cell Unicode Braille spatial radar (`U+2800`–`U+28FF`), and WCAG AAA high-contrast visuals with shape redundancy.

---

## 🍵 4-Parable Narrative & Ecosystem Soundscape Matrix

| Stage | Classical Parable / Koan | Contemplative Narrative & Puzzle | Procedural Ecosystem Foley + *Yo*-Scale Layer |
| :--- | :--- | :--- | :--- |
| **1** | ***The Sound of One Hand*** *(Hakuin)* | Staging the temple bell (*Bonshō*) and *Tōrō* stone lantern to part the gate. | Cedar wind, bronze resonance, Shakuhachi bamboo flute (`D4`). |
| **2** | ***The Raft & The Shore*** *(Majjhima Nikāya 22)* | Crossing the mountain stream and releasing the raft. | Filtered flowing river noise, Koto arpeggios. |
| **3** | ***Two Monks & The Flag*** *(Mumonkan 29)* | Aligning three fluttering silk temple banners at the stillness stone. | Bandpass-filtered banner rustles, Taiko heartbeat pulse. |
| **4** | ***The Empty Cup*** *(Nan-in)* | Releasing overflowing attachments at the bamboo water basin. | Water-pour stream, shishi-odoshi clack, full *Yo*-scale ensemble. |

---

## 📁 Architectural Scaffolding

```text
Zen-Parable-Audio-Sanctuary/
├── index.html                                         # Accessible layout, aria-live log, Braille radar & controls
├── style.css                                          # WCAG AAA obsidian/parchment styling & focus rings
├── package.json                                       # Zero-dependency ESM manifest (`npm test` -> `node --test`)
├── LICENSE                                            # MIT License
├── README.md                                          # Contemplative audio-first design & architecture
├── docs/audio-first-zen-design-guide.md               # Guide to RNIB spatial audio & Social Model design
├── tiles/bill-nye-soundscape-navigation-explainer.md  # Plain-language explainer of stereo pan & Braille
├── src/                                               # Core Q16.16 math, accessibility, parables, and audio synths
└── test/sanctuary-kernel.test.mjs                     # Verification suite
```

---

## 🛠️ Build Roadmap (`v0.1` → `v1.0`)

* **`v0.1`:** Deterministic 4-parable kernel, `aria-live` narration, and 5-cell Braille radar.
* **`v0.2`:** Continuous river currents, banner rustles, water pours, and *Yo*-scale instruments.
* **`v0.3`:** High-contrast shape-redundant renderer and optional `speechSynthesis`.
* **`v1.0`:** Companion design guides and full `node --test` verification.

---

## 🤝 Provenance & License

Adapted from [`Borealiscodes/Zen-Parable-Geometry-Odyssey`](https://github.com) by Borealis Serenity Hedling under the MIT License.
