const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const css = fs.readFileSync(path.join(__dirname, '..', 'css', 'style.css'), 'utf8');

test('card art and result labels are not cropped', function() {
  const cardImageRule = css.match(/\.card-image\s*\{([^}]*)\}/)[1];
  const resultLabelRule = css.match(/\.result-label\s*\{([^}]*)\}/)[1];

  assert.match(cardImageRule, /object-fit:\s*contain/);
  assert.doesNotMatch(resultLabelRule, /white-space:\s*nowrap/);
  assert.doesNotMatch(css, /\.result-grid-celtic \.result-label[^}]*display:\s*none/);
});

test('compact screens preserve the spread instead of crushing it', function() {
  assert.doesNotMatch(css, /html\s*\{[^}]*min-width:\s*320px/);
  assert.match(css, /#s4grid\s*\{[^}]*overflow-x:\s*auto/);
  assert.match(css, /\.result-grid-celtic\s*\{[^}]*min-width:/);
});

test('shuffle and reveal overlays both animate', function() {
  assert.match(css, /\.sh-c:nth-child\(1\)[^}]*animation:/);
  assert.match(css, /\.rv-c:nth-child\(1\)[^}]*animation:/);
});

test('Korean spread labels wrap on words and seven-card previews have room', function() {
  const spreadLabelRule = css.match(/\.spread-label\s*\{([^}]*)\}/)[1];
  const resultLabelRule = css.match(/\.result-label\s*\{([^}]*)\}/)[1];

  assert.match(spreadLabelRule, /word-break:\s*keep-all/);
  assert.match(resultLabelRule, /word-break:\s*keep-all/);
  assert.match(css, /\.spread-col-seven\s+\.spread-label\s*\{[^}]*width:\s*56px/);
});

test('main menu hover motion stays pointer-only and transform-based', function() {
  const hoverMedia = css.match(/@media \(hover: hover\) and \(pointer: fine\)\s*\{([\s\S]*?)\n\}/)[1];

  assert.match(hoverMedia, /\.mode-card:hover/);
  assert.match(hoverMedia, /\.mode-card:hover \.mode-visual/);
  assert.doesNotMatch(hoverMedia, /(?:width|height|margin|top|left):/);
});

test('scrollbars stay hidden and card details use accessible tabs', function() {
  const app = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');

  assert.match(css, /html, body, \.msh, \.ctrack, #s4grid\s*\{[^}]*scrollbar-width:\s*none/);
  assert.match(css, /\.msh\s*\{[^}]*overflow-y:\s*auto/);
  assert.match(css, /\.modal-tabs\s*\{[^}]*grid-template-columns:\s*repeat\(3/);
  assert.match(css, /\.modal-tabs\[data-active='2'\]::before/);
  assert.match(css, /@keyframes modal-tab-in/);
  assert.match(app, /role="tablist"/);
  assert.match(app, /role="tabpanel"/);
  assert.match(app, /ArrowLeft.*ArrowRight/);
});
