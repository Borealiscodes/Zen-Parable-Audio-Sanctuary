# ⛩ Audio-First & Low-Vision Sanctuary Design: Applying the Social Model of Disability to Contemplative Games

**Companion Guide for:** `Zen-Parable-Audio-Sanctuary v1.0.0` (Experimental Proof of Concept)  
**Author:** Borealis Serenity Hedling (`NDH-RESEARCH-PILOT` • County Dublin, Ireland)  
**Upstream Primitives:** [`Borealiscodes/ndh-game-dev-kit`](https://github.com) (`07-sensory-regulation-envelope` & `08-nonvisual-spatial-bridge`)  
**Date:** November 20, 2026  

---

## Authorial & Experimental Scope Disclosure

This guide and its companion browser application were developed with AI assistance in County Dublin, Ireland, as an **experimental proof of concept** demonstrating how an existing visual puzzle game ([`Zen-Parable-Geometry-Odyssey`](https://github.com)) can be re-architected around the **Social Model of Disability** without altering its deterministic `Q16.16` simulation core (`Ledger 1`). All deterministic state transitions and spatial cues are verified via built-in unit tests (`node --test`: 3/3 passing).

---

## 1. The Social Model of Disability in Interactive Environments

Under the **Social Model of Disability** (Oliver, 1990), exclusion does not reside in a blind, low-vision, or neurodivergent player—it resides in **environmental barriers built into the interface**, such as:
* **Sight-Only Spatial Information:** Requiring players to spot distant visual landmarks without stereo audio bearings or descriptive text.
* **Color-Only Differentiation:** Encoding interactive state purely through hue without redundant geometric shapes or text labels.
* **Sensory Overload:** Unthrottled screen flashes, camera shake, or sharp high-frequency audio spikes.

Following `ndh-game-dev-kit`'s **"Hard separation, soft communication"** invariant, `Zen-Parable-Audio-Sanctuary` keeps `Ledger 1` (`src/parable-kernel.js`) purely mathematical while routing all perceptual modalities through `Ledger 2`:

1. **Sensory Regulation Envelope (`<= 850 Hz` Low-Pass & Zero Strobe):**
   * Visual rendering uses a steady WCAG AAA high-contrast obsidian-and-white palette with zero strobe flashes or camera shake.
   * WebAudio synthesis passes through a master `820 Hz` low-pass `BiquadFilterNode` with gentle exponential attack ramps (`20 ms`–`280 ms`) so soundscapes remain calming rather than startling.
2. **RNIB-Inspired Audio-First Spatial Signposting & Ecosystem Foley:**
   * **Continuous Environmental Landmarks:** Filtered brown/pink noise renders a stereo-panned mountain river in *Parable II* and bandpass-filtered wind gusts across waving silk banners in *Parable III* (whose flutter rate slows to stillness as banners are calmed).
   * **Stereo Proximity Beacons:** Target offsets `(dxQ16, dyQ16)` project onto balanced ternary bearings `{-1, 0, +1}`, panning gentle proximity pings (`panQ16 ∈ [-0.75, +0.75]`) and scaling pitch smoothly (`240 Hz → 660 Hz`).
3. **Screen-Reader Narration (`aria-live`) & Unicode Braille Spatial Radar:**
   * A live `role="status"` / `aria-live="polite"` region—paired with an on-demand **Listen Around (`L`)** action and optional `speechSynthesis` narration—announces parable context, compass bearing, and proximity percentage.
   * A **5-cell Unicode Braille bar (`U+2800`–`U+28FF`)** maps horizontal azimuth (`West / Center / East`) and proximity dot density for refreshable Braille displays.

---

## 2. References (APA 7th Edition)

* Oliver, M. (1990). *The politics of disablement*. Macmillan.
* Royal National Institute of Blind People (RNIB). (2024). *Accessible gaming and audio-first navigation design guidelines*. RNIB.
* World Wide Web Consortium (W3C). (2023). *Web Content Accessibility Guidelines (WCAG) 2.2* & *WAI-ARIA 1.2*. W3C.
