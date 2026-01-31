# MyMories-GlyphTranslator v2.0.0

**Bidirectional translation between natural language and civilisational glyph grammar**

MyMories-GlyphTranslator is a Chrome extension that converts human language into a symbolic compression format and back. Based on Austin Moraski's glyph grammar system — a loss-tolerant, translation-resistant symbolic language for encoding civilisational intent.

## 🚀 Features

- **🔄 Bidirectional Translation**: Text → Glyph and Glyph → Text modes
- **🎯 Granular Dictionary**: 200+ keywords mapped across pronouns, verbs, modifiers, emotions, tech, and civilisational concepts
- **📊 Confidence Scoring**: Visual feedback on translation coverage with automatic uncertainty markers
- **🌐 Multilingual Support**: English and 中文 (Chinese) glosses
- **⚡ Local Processing**: Zero external API calls — all translation happens in-browser
- **📋 Copy Functions**: One-click copy with or without semantic gloss
- **💾 State Persistence**: Remembers your mode, language, and input across sessions

## 📦 Installation

### Manual Installation (Developer Mode)
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the `mymories-glyphtranslator` folder
5. Click the extension icon in your toolbar to start translating

## 🛠️ Usage

### Basic Translation
1. Click the MyMories-GlyphTranslator icon in your browser toolbar
2. Select mode: **Text → Glyph** or **Glyph → Text**
3. Choose output language (English or 中文)
4. Type or paste your input
5. Click "Translate" (or `Ctrl/Cmd + Enter`)
6. Use **Copy Result** or **Copy with Gloss**

### Text → Glyph Mode
Converts natural language into symbolic sequences.

**Example:**
```
Input:  "We need AI systems that are fair and balanced with feedback"
Output: 👥🎯🤖⚖️➕♻️
Gloss:  we/us → want/need → AI/robot → balance/fair → and → recursive/feedback
```

### Glyph → Text Mode
Decodes symbolic sequences back into readable explanations.

**Example:**
```
Input:  🧬🌍⚛️🔄🤖⚖️
Output: genetics/life → world/earth → atom/nuclear → change/cycle → AI/robot → balance/fair
```

### Confidence Scoring
- **Green (60%+)**: Strong keyword coverage
- **Yellow (30-59%)**: Partial matches — review unmatched words
- **Red (<30%)**: Low coverage — `🧠⚠️` auto-appended

## 📁 Dictionary Categories

| Category | Glyphs | Coverage |
|----------|--------|----------|
| **Pronouns** | 👤 👥 👆 | I, me, we, us, you, they |
| **Core Verbs** | ✅ 🚫 ➡️ 🎯 🤔 💬 👀 🏃 🛠️ | is, not, to, want, think, say, see, do, make |
| **Connectors** | ➕ 🔀 ⚡ ∵ ∴ ❓ | and, or, but, because, so, if |
| **Modifiers** | 👍 👎 📈 📉 🆕 💯 | good, bad, more, less, new, all |
| **Time** | ⏰ ⬅️⏰ ➡️⏰ | now, past, future |
| **Emotions** | 😊 😢 😠 😨 ❤️ | happy, sad, angry, scared, love |
| **AI & Tech** | 🤖 🧠 ⚖️ ♻️ 📊 | AI, intelligence, balance, recursive, data |
| **Safety** | 🛡️ ⚠️ 🔒 🔓 | protect, warning, secure, open |
| **Space** | 🚀 🌍 🪐 ☀️ ⚛️ | rocket, earth, planet, solar, nuclear |
| **Power** | 👑 🌀 ⚙️ | leader, decentralize, system |

### Canonical Sequences (Austin Moraski)
| Sequence | Meaning |
|----------|---------|
| `🧬🌍⚛️🔄🤖🤖🤖⚖️👑♂️👑♀️♻️🎲👥📊🌍🧠🔁` | Complete governance model |
| `🏗️🌾⚡🏠🧬📚✅🚫💰🔓💎✨📈📉` | Economic model: Basic needs guaranteed |
| `🛡️⚠️✋🧠🚫🔫🧬🧯` | Safety model: Prevention over punishment |
| `🌀🌀🌀⚙️🧠` | Power dissolution: Ethics as infrastructure |
| `💣➡️🛠️` | Transformation: Scarcity → Abundance |
| `🤖➡️🧠` | Transformation: AI is means → Human is goal |

## 🔧 Technical Details

### Architecture
```
/mymories-glyphtranslator
├── manifest.json          # Chrome Extension Manifest V3
├── popup.html             # Extension popup interface
├── popup.js               # UI controller and state management
├── style.css              # Dark theme styling
├── lib/
│   ├── glyph-dictionary.json   # Full keyword mappings
│   └── translator.js           # Core translation engine
└── icons/
```

### Translation Engine
- **Greedy phrase matching**: 4-gram → 3-gram → 2-gram → 1-gram
- **Weighted scoring**: Fewer keywords per glyph = higher specificity weight
- **Deduplication**: Consecutive identical glyphs collapsed
- **Confidence**: (matched words / significant words) × 100

### Permissions
- `storage` — Persist user preferences across sessions
- `web_accessible_resources` — Load dictionary JSON

## 🙏 Credits

- **Glyph System**: [Austin Moraski](https://x.com/austin_moraski/status/2017367148130173284) — Original civilisational glyph grammar
- **Extension**: Sean Uddin / [Metafintek](https://metafintek.xyz)
- **Part of**: [MyMories](https://github.com/metafintek/mymories) ecosystem

## 📄 License

MIT — Use freely with attribution to Austin Moraski for the glyph system.

## 🗺️ Roadmap

| Version | Status | Features |
|---------|--------|----------|
| **v1.0** | ✅ Released | Popup translator, copy/paste |
| **v2.0** | ✅ Current | Granular dictionary (200+ keywords) |
| **v2.1** | 🔜 Planned | Inline overlay (Grammarly-style) |
| **v3.0** | 🔮 Future | MyMories .mmr integration, glyph layer in memory files |

---

**MyMories-GlyphTranslator** by [Metafintek](https://metafintek.xyz)
Glyph system by [@austin_moraski](https://x.com/austin_moraski)
