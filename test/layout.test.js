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
  const detail = fs.readFileSync(path.join(__dirname, '..', 'detail.js'), 'utf8');

  assert.match(css, /html, body, \.msh, \.ctrack, #s4grid\s*\{[^}]*scrollbar-width:\s*none/);
  assert.match(css, /\.msh\s*\{[^}]*overflow-y:\s*auto/);
  assert.match(css, /\.modal-tabs\s*\{[^}]*grid-template-columns:\s*repeat\(3/);
  assert.match(css, /\.modal-tabs\[data-active='2'\]::before/);
  assert.match(css, /@keyframes modal-tab-in/);
  assert.match(detail, /role="tablist"/);
  assert.match(detail, /role="tabpanel"/);
  assert.match(detail, /ArrowLeft.*ArrowRight/);
});

test('card dictionary keeps equal cards and full-image artwork', function() {
  assert.match(css, /\.dictionary-grid\s*\{[^}]*grid-template-columns:\s*repeat\(auto-fill/);
  assert.match(css, /\.dictionary-frame\s*\{[^}]*aspect-ratio:\s*400\s*\/\s*691/);
  assert.match(css, /\.dictionary-grid\s*\{[^}]*gap:/);
  assert.match(css, /\.dictionary-group-title\s*\{[^}]*grid-column:\s*1\s*\/\s*-1/);
});

test('topic presets and summary sheet stay compact and scrollable', function() {
  const index = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const summary = fs.readFileSync(path.join(__dirname, '..', 'summary.js'), 'utf8');

  assert.match(css, /\.topic-grid\s*\{[^}]*grid-template-columns:\s*repeat\(4/);
  assert.match(css, /@media[\s\S]*\.topic-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2/);
  assert.match(css, /\.summary-body\s*\{[^}]*overflow-y:\s*auto/);
  assert.match(index, /data-topic="general"/);
  assert.match(index, /data-topic="love"/);
  assert.match(index, /id="summaryDialog"/);
  assert.doesNotMatch(index, /topic-btn is-selected/);
  assert.doesNotMatch(summary, /메이저 카드가/);
  assert.doesNotMatch(summary, /summary-stats/);
  assert.match(summary, /summary-card-art/);
  assert.match(summary, /cardImgUrl\(entry\.card\)/);
  assert.match(summary, /wrapText\(ctx,entryText\(entry\)/);
});

test('spread choices preview their layouts and card picking keeps a tactile stage', function() {
  const index = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const app = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');

  assert.match(index, /count-preview preview-five/);
  assert.match(index, /count-preview preview-seven/);
  assert.match(index, /count-preview preview-ten/);
  assert.match(css, /\.count-btn:has\(input:checked\)/);
  assert.match(css, /\.track-card-order:not\(:empty\)\s*\{[^}]*font-size:\s*\.72rem/);
  assert.match(app, /textContent=\(order\+1\)\+'번째 카드'/);
  assert.doesNotMatch(app, /S\.shuffled\.length<\/small>/);
  assert.match(index, /id="readingOverview"/);
  assert.doesNotMatch(index, /카드는 결정을 대신하지 않습니다/);
});
