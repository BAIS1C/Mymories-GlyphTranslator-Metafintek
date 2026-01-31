# Changelog

## [2.0.0] - 2026-01-31

### 🔥 The "Granular Language" Update
- **Massive Dictionary Expansion**: 200+ keywords across 15 categories
- **Literal Translation**: Common words now translate — pronouns, verbs, connectors, modifiers
- **Bidirectional**: Full Text → Glyph and Glyph → Text support
- **Confidence Scoring**: Visual feedback with automatic `🧠⚠️` uncertainty markers

### 🎯 New Dictionary Categories
- **Pronouns**: I, me, we, us, you, they, them
- **Core Verbs**: is, am, are, want, need, think, say, see, hear, do, make, get, give, find, know, love, stop, start, can, must
- **Connectors**: and, or, but, because, so, if, then, therefore
- **Modifiers**: good, bad, more, less, new, old, fast, slow, all, some, none
- **Time**: past, now, future, before, after, yesterday, tomorrow
- **Places**: here, there, home, world, work, office
- **Things**: thing, idea, text, money, food, water, energy
- **Questions**: what, who, where, when, why, how
- **Emotions**: happy, sad, angry, scared, love, fear

### 🛠️ Technical Improvements
- **Greedy Phrase Matching**: 4-gram → 1-gram cascade for compound concepts
- **Weighted Scoring**: Specificity-based keyword weighting
- **Deduplication**: Consecutive identical glyphs collapsed
- **State Persistence**: Mode, language, and input saved across sessions

### 📋 Example Results
```
Original: "We want AI that is fair and balanced"
Output:   👥🎯🤖✅⚖️➕⚖️
Gloss:    we → want → AI → is → fair → and → balanced
```

---

## [1.0.1] - 2026-01-31

### 🐛 Critical Bug Fixes
- **Fixed**: Manifest V3 background service worker error
- **Fixed**: JSON dictionary loading via proper fetch
- **Removed**: Unused background.js and clipboardWrite permission
- **Added**: `web_accessible_resources` for dictionary access

---

## [1.0.0] - 2026-01-31

### 🚀 Initial Release
- **Core Translator**: Text ↔ Glyph bidirectional translation
- **Austin Moraski Dictionary**: Full civilisational glyph lexicon
- **Chrome Extension**: Manifest V3, popup interface
- **Multilingual**: English and 中文 glosses
- **Copy Functions**: Result and Result + Gloss options

### 📋 Glyph System Credit
Based on [Austin Moraski's](https://x.com/austin_moraski/status/2017367148130173284) symbolic compression grammar for civilisational intent — a translation-resistant, loss-tolerant encoding system for governance, economics, safety, and human flourishing.

### 🎯 Canonical Sequences Supported
- Complete governance model
- Economic model (basic needs guaranteed)
- Safety model (prevention over punishment)
- Power dissolution (ethics as infrastructure)
- Transformations (scarcity→abundance, AI→human)

---

**MyMories-GlyphTranslator** by [Metafintek](https://metafintek.xyz)
Glyph system by [@austin_moraski](https://x.com/austin_moraski)
