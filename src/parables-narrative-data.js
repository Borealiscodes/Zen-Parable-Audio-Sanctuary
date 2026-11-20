/**
 * src/parables-narrative-data.js — Four Contemplative Parables, Ecosystem Foley Profiles & Spatial Nodes
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

export const SANCTUARY_PARABLES = [
  {
    id: 1,
    slug: "sound-of-one-hand",
    title: "Parable I: The Sound of One Hand (Master Hakuin)",
    koanQuote: "“Two hands clap and there is a sound. What is the sound of one hand?”",
    soundscapeSummary: "High cedar mountain breeze and distant bronze temple acoustics.",
    surroundingsNarration:
      "You stand in a quiet cedar courtyard. Two heavy bronze Bonsho bells hang to the west; a solitary Toro stone lantern rests peacefully to the east before the garden gate.",
    foleyProfile: { riverLevel: 0.05, windLevel: 0.45, bannerFlutterHz: 0, waterPourLevel: 0 },
    musicLayerUnlocked: "Layer 1: Breath of the Shakuhachi Flute (D4)",
    nodes: [
      {
        id: "bonsho-west",
        label: "Twin Bonsho Bells",
        shape: "CIRCLE",
        x: 190,
        y: 195,
        role: "CLAP",
        description: "Heavy bronze temple bells. Striking them makes a loud double clap that clouds the path in mist.",
      },
      {
        id: "toro-east",
        label: "Solitary Toro Lantern",
        shape: "TRIANGLE",
        x: 450,
        y: 195,
        role: "ONE_HAND",
        description: "A single carved stone lantern. Chiming it softly parts the mist barrier.",
      },
    ],
  },
  {
    id: 2,
    slug: "raft-and-the-shore",
    title: "Parable II: The Raft and the Shore (Majjhima Nikāya 22)",
    koanQuote: "“A raft is for crossing over, not for carrying upon your shoulders once you reach the far shore.”",
    soundscapeSummary: "A broad mountain river flows steadily between the West Pier and the East Bank.",
    surroundingsNarration:
      "Water rushes across smooth river stones between the West Pier and the East Bank. Board the cedar raft at the West Pier, cross the current, and release the raft (R / Release) on the East Bank so you walk unburdened.",
    foleyProfile: { riverLevel: 0.65, windLevel: 0.25, bannerFlutterHz: 0, waterPourLevel: 0 },
    musicLayerUnlocked: "Layer 2: Plucked Koto Stream Arpeggio",
    nodes: [
      {
        id: "west-pier",
        label: "West River Pier",
        shape: "SQUARE",
        x: 170,
        y: 210,
        role: "BOARD_RAFT",
        description: "Wooden pier on the near bank where the cedar raft is moored.",
      },
      {
        id: "east-bank",
        label: "East Sanctuary Shore",
        shape: "DIAMOND",
        x: 470,
        y: 210,
        role: "RELEASE_RAFT",
        description: "Mossy stone steps on the far bank. Press Release (R) here to let the raft go.",
      },
    ],
  },
  {
    id: 3,
    slug: "two-monks-and-the-flag",
    title: "Parable III: Two Monks and the Flag (Mumonkan Case 29)",
    koanQuote: "“Not the wind, not the flag; it is mind that moves.”",
    soundscapeSummary: "Three silk temple banners flutter asynchronously in mountain gusts around the Iwakura stillness stone.",
    surroundingsNarration:
      "Three silk banners ripple rapidly in restless mountain wind. Approach the central Iwakura stillness stone and chime it three times to bring each fluttering banner into quiet stillness.",
    foleyProfile: { riverLevel: 0.12, windLevel: 0.55, bannerFlutterHz: 3.4, waterPourLevel: 0 },
    musicLayerUnlocked: "Layer 3: Deep Taiko Heartbeat Pulse",
    nodes: [
      {
        id: "iwakura-stone",
        label: "Iwakura Stillness Stone",
        shape: "DIAMOND",
        x: 320,
        y: 195,
        role: "CALM_BANNERS",
        description: "A weathered moss-covered boulder at the center of the courtyard. Chime three times to quiet the waving banners.",
      },
    ],
  },
  {
    id: 4,
    slug: "the-empty-cup",
    title: "Parable IV: The Empty Cup (Master Nan-in)",
    koanQuote: "“How can I show you Zen unless you first empty your cup?”",
    soundscapeSummary: "Clear spring water pours into an overflowing bamboo Tsukubai basin.",
    surroundingsNarration:
      "At the heart of the sanctuary sits a carved stone Tsukubai water basin, brimming full (4 of 4). Press Release (R) four times beside the basin to pour away each cupful until clear stillness remains.",
    foleyProfile: { riverLevel: 0.18, windLevel: 0.20, bannerFlutterHz: 0, waterPourLevel: 0.55 },
    musicLayerUnlocked: "Layer 4: Resonant Bonsho Temple Bell Overtones",
    nodes: [
      {
        id: "tsukubai-basin",
        label: "Tsukubai Water Basin",
        shape: "CIRCLE",
        x: 320,
        y: 195,
        role: "EMPTY_CUP",
        description: "Carved granite basin fed by a bamboo spout. Press Release (R) to pour out one measure of water.",
      },
    ],
  },
];
