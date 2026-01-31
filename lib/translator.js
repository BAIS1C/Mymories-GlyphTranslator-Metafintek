/**
 * Glyph Translator Engine v1.0
 * Bidirectional translation between natural language and glyph grammar
 * 
 * Credit: Glyph system by Austin Moraski
 * Implementation: Sean Uddin / Metafintek
 */

class GlyphTranslator {
  constructor(dictionary) {
    this.dictionary = dictionary;
    this.glyphToMeaning = new Map();
    this.keywordToGlyph = new Map();
    this.buildIndices();
  }

  buildIndices() {
    // Build reverse lookup indices
    for (const [category, glyphs] of Object.entries(this.dictionary.categories)) {
      for (const [glyph, data] of Object.entries(glyphs)) {
        // Glyph → Meaning index
        this.glyphToMeaning.set(glyph, {
          en: data.en,
          zh: data.zh,
          category: category
        });

        // Keyword → Glyph index (weighted by specificity)
        if (data.keywords) {
          for (const keyword of data.keywords) {
            const existing = this.keywordToGlyph.get(keyword.toLowerCase()) || [];
            existing.push({
              glyph: glyph,
              weight: 1 / data.keywords.length // More specific keywords = higher weight
            });
            this.keywordToGlyph.set(keyword.toLowerCase(), existing);
          }
        }
      }
    }
  }

  /**
   * Translate natural language text to glyph sequence
   * @param {string} text - Input text
   * @param {string} lang - Target language for gloss ('en' or 'zh')
   * @returns {object} - { glyphs, gloss, confidence, unmatched }
   */
  textToGlyph(text, lang = 'en') {
    const words = this.tokenize(text);
    const matches = [];
    const unmatchedWords = [];
    const usedIndices = new Set();

    // Multi-word phrase matching first (greedy)
    for (let windowSize = 4; windowSize >= 1; windowSize--) {
      for (let i = 0; i <= words.length - windowSize; i++) {
        if ([...Array(windowSize)].some((_, j) => usedIndices.has(i + j))) continue;

        const phrase = words.slice(i, i + windowSize).join(' ').toLowerCase();
        const glyphMatches = this.keywordToGlyph.get(phrase);

        if (glyphMatches && glyphMatches.length > 0) {
          // Take highest weighted match
          const best = glyphMatches.reduce((a, b) => a.weight > b.weight ? a : b);
          matches.push({
            glyph: best.glyph,
            weight: best.weight * windowSize, // Bonus for longer matches
            position: i,
            source: phrase
          });
          for (let j = 0; j < windowSize; j++) {
            usedIndices.add(i + j);
          }
        }
      }
    }

    // Track unmatched words
    words.forEach((word, i) => {
      if (!usedIndices.has(i) && word.length > 2) {
        unmatchedWords.push(word);
      }
    });

    // Sort matches by position to preserve order
    matches.sort((a, b) => a.position - b.position);

    // Deduplicate consecutive identical glyphs
    const dedupedGlyphs = [];
    let lastGlyph = null;
    for (const match of matches) {
      if (match.glyph !== lastGlyph) {
        dedupedGlyphs.push(match.glyph);
        lastGlyph = match.glyph;
      }
    }

    // Calculate confidence
    const matchedWordCount = usedIndices.size;
    const totalSignificantWords = words.filter(w => w.length > 2).length;
    const confidence = totalSignificantWords > 0 
      ? Math.round((matchedWordCount / totalSignificantWords) * 100) 
      : 0;

    // Build gloss
    const gloss = dedupedGlyphs.map(g => {
      const meaning = this.glyphToMeaning.get(g);
      return meaning ? meaning[lang] || meaning.en : '?';
    });

    // Add uncertainty marker if low confidence
    let finalGlyphs = dedupedGlyphs.join('');
    if (confidence < 50 && finalGlyphs.length > 0) {
      finalGlyphs += '🧠⚠️';
    }

    return {
      glyphs: finalGlyphs,
      gloss: gloss,
      confidence: confidence,
      unmatched: unmatchedWords,
      matchCount: dedupedGlyphs.length
    };
  }

  /**
   * Translate glyph sequence to natural language
   * @param {string} glyphString - Input glyph sequence
   * @param {string} lang - Target language ('en' or 'zh')
   * @returns {object} - { text, segments, unrecognized }
   */
  glyphToText(glyphString, lang = 'en') {
    const segments = [];
    const unrecognized = [];
    let remaining = glyphString;

    // Greedy matching from longest known glyphs
    const sortedGlyphs = [...this.glyphToMeaning.keys()]
      .sort((a, b) => b.length - a.length);

    while (remaining.length > 0) {
      let matched = false;

      for (const glyph of sortedGlyphs) {
        if (remaining.startsWith(glyph)) {
          const meaning = this.glyphToMeaning.get(glyph);
          segments.push({
            glyph: glyph,
            meaning: meaning[lang] || meaning.en
          });
          remaining = remaining.slice(glyph.length);
          matched = true;
          break;
        }
      }

      if (!matched) {
        // Unknown glyph - capture single character/emoji
        const char = [...remaining][0];
        unrecognized.push(char);
        remaining = remaining.slice(char.length);
      }
    }

    // Build natural text
    const text = segments.map(s => s.meaning).join(' → ');

    return {
      text: text,
      segments: segments,
      unrecognized: unrecognized
    };
  }

  /**
   * Check if a glyph sequence matches a canonical pattern
   * @param {string} glyphString - Input glyph sequence
   * @returns {object|null} - Matching canonical sequence or null
   */
  matchCanonical(glyphString) {
    for (const seq of this.dictionary.sequences.canonical) {
      if (glyphString === seq.sequence) {
        return seq;
      }
      // Partial match check
      if (seq.sequence.includes(glyphString) || glyphString.includes(seq.sequence)) {
        return { ...seq, partial: true };
      }
    }
    return null;
  }

  /**
   * Tokenize text into words
   */
  tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s\u4e00-\u9fff]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 0);
  }

  /**
   * Get all available glyphs grouped by category
   */
  getGlyphPalette() {
    const palette = {};
    for (const [category, glyphs] of Object.entries(this.dictionary.categories)) {
      palette[category] = Object.keys(glyphs);
    }
    return palette;
  }
}

// Export for use in extension
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GlyphTranslator;
}
