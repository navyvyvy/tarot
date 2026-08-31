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
  const app = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');

  assert.match(css, /\.sh-c:nth-child\(1\)[^}]*animation:/);
  assert.match(css, /\.rv-c:nth-child\(1\)[^}]*animation:/);
  assert.match(css, /\.card-back-image\s*\{[^}]*object-fit:\s*fill/);
  assert.match(app, /CARD_BACK_URL='data:image\/svg\+xml/);
  assert.match(app, /cy="300" r="72"/);
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
  const dictionary = fs.readFileSync(path.join(__dirname, '..', 'dictionary.js'), 'utf8');

  assert.match(css, /\.dictionary-grid\s*\{[^}]*grid-template-columns:\s*repeat\(auto-fill/);
  assert.match(css, /\.dictionary-frame\s*\{[^}]*aspect-ratio:\s*400\s*\/\s*691/);
  assert.match(css, /\.dictionary-grid\s*\{[^}]*gap:/);
  assert.match(css, /\.dictionary-group-title\s*\{[^}]*grid-column:\s*1\s*\/\s*-1/);
  assert.match(css, /\.dictionary-card\s*\{[^}]*text-align:\s*center/);
  assert.match(dictionary, /function groupKey\(card\)/);
  assert.match(dictionary, /group\.textContent=suitName\(card\)/);
  assert.doesNotMatch(dictionary, /dictionary-type/);
});

test('topic presets and shared result use one readable result sheet', function() {
  const index = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const summary = fs.readFileSync(path.join(__dirname, '..', 'summary.js'), 'utf8');

  assert.match(css, /\.topic-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2/);
  assert.match(css, /@media[\s\S]*\.mode-row, \.topic-grid\s*\{[^}]*grid-template-columns:\s*1fr/);
  assert.match(css, /\.reading-cards\.is-many\s*\{[^}]*grid-template-columns:\s*repeat\(2/);
  assert.match(css, /\.reading-card-art img\s*\{[^}]*object-fit:\s*contain/);
  assert.match(index, /data-topic="general"/);
  assert.match(index, /data-topic="love"/);
  assert.match(index, /<strong>전체 흐름<\/strong>/);
  assert.doesNotMatch(index, /id="mT"|birth-method-note/);
  assert.match(index, /id="readingCards"/);
  assert.match(index, /id="extraReadings"/);
  assert.match(index, /id="s4extraGrid"/);
  assert.match(index, /id="resultExtras"/);
  assert.match(index, /id="shareReading"/);
  assert.match(index, /<details class="result-info"/);
  assert.match(index, /<dialog class="reading-dialog" id="readingDetails"/);
  assert.match(index, /id="openReadingDetails"/);
  assert.match(index, /id="openExtraDetails"/);
  assert.match(index, /id="shareDialog"/);
  assert.match(index, /class="share-dialog-actions"><button class="btn-save-image" id="saveReadingImage"/);
  assert.match(index, /class="reading-actions"><button class="btn-share"[^>]+>결과 공유<\/button><button class="btn-reset" id="rst4"/);
  assert.match(index, /class="sr-only" id="readingSpreadTitle">선택한 카드/);
  assert.doesNotMatch(index, /id="summaryDialog"|결과 요약 보기/);
  assert.doesNotMatch(index, /topic-btn is-selected/);
  assert.doesNotMatch(summary, /메이저 카드가/);
  assert.doesNotMatch(summary, /summary-stats/);
  assert.doesNotMatch(summary, /이 요약은 선택을 대신/);
  assert.match(summary, /reading-card-art/);
  assert.match(summary, /createShareUrl/);
  assert.match(summary, /decodeReading/);
  assert.match(summary, /cardImgUrl\(entry\.card\)/);
  assert.match(summary, /function drawCard\(entry,image,x,y\)/);
  assert.match(summary, /summary\.mainEntries/);
  assert.match(summary, /summary\.extraEntries/);
  assert.match(css, /#s3 \.hint\s*\{[^}]*max-width:\s*none/);
  assert.match(css, /#s4:has\(\.result-grid-flex \.result-card:only-child\)\s*\{[^}]*--cw:\s*168px/);
  assert.match(css, /\.reading-detail-trigger\s*\{/);
  assert.doesNotMatch(css, /\.result-extra-grid \.result-frame\s*\{/);
  assert.match(css, /body:has\(#s4\.ON\) \.wrap > header\s*\{/);
});

test('spread choices preview their layouts and card picking keeps a tactile stage', function() {
  const index = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const app = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');

  assert.match(index, /count-preview preview-five/);
  assert.match(index, /count-preview preview-seven/);
  assert.match(index, /count-preview preview-ten/);
  assert.match(css, /\.count-btn:has\(input:checked\)/);
  assert.match(css, /\.preview-row-flex\s*\{[^}]*align-self:\s*center/);
  assert.match(index, /마음이 가는 카드를 고르세요\. 옆으로 밀면 다른 카드도 볼 수 있어요\./);
  assert.match(css, /\.count-btn\s*\{[^}]*justify-items:\s*center[^}]*text-align:\s*center/);
  assert.match(css, /\.sp-info h3\s*\{[^}]*text-align:\s*center/);
  assert.match(css, /\.sp-info p\s*\{[^}]*text-align:\s*center/);
  assert.match(css, /\.sp-info\.ON\s*\{[^}]*min-height:\s*362px/);
  assert.match(css, /\.sp-tags\s*\{[^}]*justify-content:\s*center/);
  assert.match(css, /body:has\(#s2\.ON\) \.wrap > header[^\{]*body:has\(#s3\.ON\) \.wrap > header/);
  assert.match(css, /\.topic-btn:hover\s*\{[^}]*transform:\s*translateY\(-3px\)/);
  assert.match(css, /\.arr span\s*\{[^}]*font:[^}]*1\.8rem\/1/);
  assert.match(css, /\.track-card-order:not\(:empty\)\s*\{[^}]*font-size:\s*\.72rem/);
  assert.match(app, /textContent=\(order\+1\)\+'번째 카드'/);
  assert.match(app, /scrollIntoView\(\{behavior:REDUCED_MOTION\?'auto':'smooth',block:'nearest',inline:'center'\}\)/);
  assert.doesNotMatch(app, /scrollTr\(d\)[\s\S]{0,180}behavior:[^}]*smooth/);
  assert.doesNotMatch(app, /S\.shuffled\.length<\/small>/);
  assert.match(index, /id="readingOverview"/);
  assert.doesNotMatch(index, /카드는 결정을 대신하지 않습니다/);
});

test('result cards reveal in sequence and keep their metadata hierarchy', function() {
  const index = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const app = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  const summary = fs.readFileSync(path.join(__dirname, '..', 'summary.js'), 'utf8');

  assert.match(app, /Math\.min\(order, 8\) \* 145/);
  assert.match(app, /mkCard\(card,'추가 '\+\(index\+1\),undefined,S\.count\+index\)/);
  assert.match(app, /<span class="result-label">[\s\S]*<span class="result-frame">[\s\S]*<span class="result-name">[\s\S]*<span class="result-badges">/);
  assert.doesNotMatch(app, /result-label is-reversed/);
  assert.match(css, /\.result-badges\s*\{/);
  assert.match(css, /\.result-badges\s*\{[^}]*flex-direction:\s*column/);
  assert.match(css, /\.result-keywords\s*\{/);
  assert.match(css, /\.result-direction\.is-reversed\s*\{[^}]*color:\s*var\(--danger\)/);
  assert.match(css, /\.reading-card\s*\{[^}]*grid-template-areas:\s*"summary copy"/);
  assert.match(css, /\.reading-card-art \.result-name\s*\{[^}]*text-align:\s*center/);
  assert.match(css, /\.reading-card-copy\s*\{[^}]*text-align:\s*left/);
  assert.match(css, /\.reading-card-copy \.result-badges\s*\{[^}]*align-items:\s*flex-start/);
  assert.match(css, /\.result-info summary span\s*\{[^}]*width:\s*17px[^}]*height:\s*17px/);
  assert.match(index, /id="overviewSwitch"[^>]*hidden/);
  assert.match(index, /추가 카드의 카드별 해석/);
  assert.match(summary, /extraOverview/);
  assert.match(index, /id="shareOverviewSwitch"/);
  assert.match(summary, /data-share-overview/);
  assert.doesNotMatch(css, /\.result-label\.is-reversed/);
});

test('navigation buttons share one hierarchy without decorative arrows', function() {
  const index = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

  assert.doesNotMatch(index, /[←→]/);
  assert.match(css, /\.btn-go, \.btn-rev, \.btn-more, \.btn-share, \.btn-save-image, \.m-close, \.back-btn, \.btn-reset\s*\{/);
  assert.match(css, /\.btn-go, \.btn-rev, \.btn-more, \.btn-share, \.btn-save-image, \.m-close, \.back-btn, \.btn-reset\s*\{[^}]*font:\s*700\s*\.82rem/);
  assert.match(css, /\.back-btn, \.btn-reset, \.btn-save-image\s*\{/);
  assert.match(css, /\.result-topic\s*\{[^}]*font:[^}]*1\.4rem/);
  assert.match(css, /\.reading-heading h2\s*\{[^}]*font:\s*700\s*\.76rem/);
});
