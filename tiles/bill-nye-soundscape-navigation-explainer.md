# 🟧 Bill Nye Tile: Zen Parable Audio Sanctuary (Navigating by Stereo Sound, Flowing Rivers & Braille!)

**Altitude:** `A7` (Public-Facing Clarity Layer • Zero Jargon • Non-Activating)  
**Companion Runtime:** `Zen-Parable-Audio-Sanctuary v1.0.0` (Experimental Proof of Concept • `3/3` Tests Passing)  
**Companion Guide:** [`docs/audio-first-zen-design-guide.md`](../docs/audio-first-zen-design-guide.md)  
**Maintainer:** Borealis Serenity Hedling (`NDH-RESEARCH-PILOT` · County Dublin, Ireland)  

---

## ⭐ Bill Nye Says…

> “Kids!  
> 
> Close your eyes for ten seconds and listen to the room around you—you can tell whether a doorway, a running faucet, or a person speaking is to your **left**, **straight ahead**, or to your **right** because sound reaches each ear at slightly different volumes and times!  
> 
> In **Zen Parable Audio Sanctuary**, your browser uses **stereo panning (`StereoPannerNode`)**, **low-pass filtered noise** for rushing rivers and mountain wind, **screen-reader descriptions**, and a **5-cell Unicode Braille bar (`⠀⠀⠀⠀⣿`)** so you can explore a Zen garden purely by ear, touch, and Braille!”

---

## 🌊 Part 1: Three Audio & Tactile Tricks Working Together

1. **Stereo Panning (`-0.75` Left to `+0.75` Right):**  
   When the *Solitary Toro Lantern* is east of your traveler, the proximity ping pans toward your right speaker—and as you walk east toward it, the sound moves smoothly to the center (`0.0`) while rising gently in pitch!
2. **Shaping Random Noise into Rivers & Wind (`ecosystem-foley-audio.js`):**  
   By passing smooth brown noise through a **`340 Hz` low-pass filter**, random numbers turn into the steady rush of a mountain river. Passing that same noise through a **`480 Hz` bandpass filter** modulated by a slow sine wave creates the rustle of silk banners waving in the wind!
3. **5-Cell Unicode Braille Spatial Radar (`U+2800`–`U+28FF`):**  
   Five Braille cells act like a tactile compass: the active cell jumps across slots `1` through `5` for West-to-East direction, while the number of raised dots (`⠄` → `⠶` → `⣿`) shows how close you are (`0%` → `100%`).

---

## 🧭 Provenance & Non-Activation Footer

* **Status:** Verified Educational Proof-of-Concept Tile (`v1.0.0` Audio-First Sanctuary • `3/3` Tests Passing)  
* **Non-Activation Clause:** Descriptive educational tile only; strictly non-activating.  
* **Signed-off-by:** `Borealis Serenity Hedling <chguard-sentinel@vaked.dev>`
