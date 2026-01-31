/**
 * Glyph Translator - Popup Controller
 */

let translator = null;
let currentMode = 'text-to-glyph';
let currentLang = 'en';
let lastResult = null;

// DOM Elements
const elements = {
  inputText: document.getElementById('input-text'),
  outputText: document.getElementById('output-text'),
  inputLabel: document.getElementById('input-label'),
  outputLabel: document.getElementById('output-label'),
  langSelect: document.getElementById('lang-select'),
  confidenceBadge: document.getElementById('confidence-badge'),
  glossSection: document.getElementById('gloss-section'),
  glossText: document.getElementById('gloss-text'),
  unmatchedSection: document.getElementById('unmatched-section'),
  unmatchedText: document.getElementById('unmatched-text'),
  translateBtn: document.getElementById('translate-btn'),
  clearBtn: document.getElementById('clear-btn'),
  copyBtn: document.getElementById('copy-btn'),
  copyWithGlossBtn: document.getElementById('copy-with-gloss-btn'),
  modeTextToGlyph: document.getElementById('mode-text-to-glyph'),
  modeGlyphToText: document.getElementById('mode-glyph-to-text')
};

// Initialize
async function init() {
  // Load dictionary
  const dictionary = await loadDictionary();
  translator = new GlyphTranslator(dictionary);
  
  // Bind events
  bindEvents();
  
  // Load saved state
  loadState();
  
  console.log('Glyph Translator initialized');
}

async function loadDictionary() {
  try {
    const response = await fetch(chrome.runtime.getURL('lib/glyph-dictionary.json'));
    if (!response.ok) throw new Error('Failed to load dictionary');
    return await response.json();
  } catch (err) {
    console.error('Dictionary load error:', err);
    // Return minimal fallback
    return { categories: {}, sequences: { canonical: [] } };
  }
}

function bindEvents() {
  // Mode toggle
  elements.modeTextToGlyph.addEventListener('click', () => setMode('text-to-glyph'));
  elements.modeGlyphToText.addEventListener('click', () => setMode('glyph-to-text'));
  
  // Language select
  elements.langSelect.addEventListener('change', (e) => {
    currentLang = e.target.value;
    saveState();
  });
  
  // Translate
  elements.translateBtn.addEventListener('click', translate);
  elements.inputText.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      translate();
    }
  });
  
  // Clear
  elements.clearBtn.addEventListener('click', clear);
  
  // Copy
  elements.copyBtn.addEventListener('click', () => copyResult(false));
  elements.copyWithGlossBtn.addEventListener('click', () => copyResult(true));
}

function setMode(mode) {
  currentMode = mode;
  
  // Update UI
  elements.modeTextToGlyph.classList.toggle('active', mode === 'text-to-glyph');
  elements.modeGlyphToText.classList.toggle('active', mode === 'glyph-to-text');
  
  if (mode === 'text-to-glyph') {
    elements.inputLabel.textContent = 'Enter text';
    elements.outputLabel.textContent = 'Glyph output';
    elements.inputText.placeholder = 'Type or paste natural language...';
    elements.copyWithGlossBtn.classList.remove('hidden');
  } else {
    elements.inputLabel.textContent = 'Enter glyphs';
    elements.outputLabel.textContent = 'Text output';
    elements.inputText.placeholder = 'Paste glyph sequence...';
    elements.copyWithGlossBtn.classList.add('hidden');
  }
  
  // Clear output when switching modes
  elements.outputText.value = '';
  hideExtras();
  saveState();
}

function translate() {
  const input = elements.inputText.value.trim();
  
  if (!input) {
    elements.outputText.value = '';
    hideExtras();
    return;
  }
  
  if (currentMode === 'text-to-glyph') {
    lastResult = translator.textToGlyph(input, currentLang);
    
    elements.outputText.value = lastResult.glyphs || '🧠⚠️ No matches found';
    
    // Show confidence
    if (lastResult.glyphs) {
      elements.confidenceBadge.textContent = `${lastResult.confidence}%`;
      elements.confidenceBadge.classList.remove('hidden', 'low', 'very-low');
      if (lastResult.confidence < 30) {
        elements.confidenceBadge.classList.add('very-low');
      } else if (lastResult.confidence < 60) {
        elements.confidenceBadge.classList.add('low');
      }
    }
    
    // Show gloss
    if (lastResult.gloss && lastResult.gloss.length > 0) {
      elements.glossText.textContent = lastResult.gloss.join(' → ');
      elements.glossSection.classList.remove('hidden');
    }
    
    // Show unmatched
    if (lastResult.unmatched && lastResult.unmatched.length > 0) {
      elements.unmatchedText.textContent = lastResult.unmatched.join(', ');
      elements.unmatchedSection.classList.remove('hidden');
    }
    
  } else {
    lastResult = translator.glyphToText(input, currentLang);
    
    elements.outputText.value = lastResult.text || 'No recognized glyphs';
    elements.confidenceBadge.classList.add('hidden');
    
    // Show unrecognized
    if (lastResult.unrecognized && lastResult.unrecognized.length > 0) {
      elements.unmatchedText.textContent = `Unrecognized: ${lastResult.unrecognized.join(' ')}`;
      elements.unmatchedSection.classList.remove('hidden');
    }
    
    elements.glossSection.classList.add('hidden');
  }
  
  saveState();
}

function clear() {
  elements.inputText.value = '';
  elements.outputText.value = '';
  lastResult = null;
  hideExtras();
  elements.inputText.focus();
}

function hideExtras() {
  elements.confidenceBadge.classList.add('hidden');
  elements.glossSection.classList.add('hidden');
  elements.unmatchedSection.classList.add('hidden');
}

async function copyResult(includeGloss) {
  let textToCopy = elements.outputText.value;
  
  if (includeGloss && lastResult && lastResult.gloss) {
    textToCopy = `${lastResult.glyphs}\n\n[Gloss: ${lastResult.gloss.join(' → ')}]`;
  }
  
  try {
    await navigator.clipboard.writeText(textToCopy);
    
    // Visual feedback
    const btn = includeGloss ? elements.copyWithGlossBtn : elements.copyBtn;
    const originalText = btn.textContent;
    btn.textContent = 'Copied!';
    btn.classList.add('copy-success');
    
    setTimeout(() => {
      btn.textContent = originalText;
      btn.classList.remove('copy-success');
    }, 1000);
    
  } catch (err) {
    console.error('Copy failed:', err);
  }
}

// State persistence
function saveState() {
  chrome.storage.local.set({
    glyphTranslatorState: {
      mode: currentMode,
      lang: currentLang,
      input: elements.inputText.value
    }
  });
}

function loadState() {
  chrome.storage.local.get('glyphTranslatorState', (data) => {
    if (data.glyphTranslatorState) {
      const state = data.glyphTranslatorState;
      
      if (state.mode) {
        setMode(state.mode);
      }
      
      if (state.lang) {
        currentLang = state.lang;
        elements.langSelect.value = state.lang;
      }
      
      if (state.input) {
        elements.inputText.value = state.input;
      }
    }
  });
}

// Start
document.addEventListener('DOMContentLoaded', init);
