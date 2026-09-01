const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const core = require('../core.js');
const deckCatalog = require('../card.js');

test('shuffleDeck shuffles copies without mutating the source', function() {
  const source = [{ id: 1 }, { id: 2 }, { id: 3 }];
  const values = [0, 0, 0, 0, 0];
  const shuffled = core.shuffleDeck(source, 0.5, function() { return values.shift(); });

  assert.deepEqual(source, [{ id: 1 }, { id: 2 }, { id: 3 }]);
  assert.deepEqual(shuffled.map(function(card) { return card.id; }), [2, 3, 1]);
  assert.ok(shuffled.every(function(card) { return card.isRev; }));
  assert.notEqual(shuffled[0], source[1]);
});

test('calculateBirthCard keeps the reduction and resolves hidden pairs', function() {
  const pairs = { 12: { c: [12, 3], d: 'pair' }, 9: { c: [18, 9], d: 'hidden pair' } };
  assert.deepEqual(core.calculateBirthCard(1990, 1, 1, pairs), pairs[12]);
  assert.deepEqual(core.calculateBirthCard(2000, 1, 6, pairs), pairs[9]);
  assert.deepEqual(core.calculateBirthCard(2000, 1, 1, {}), {
    c: [4, 4],
    d: '두 카드의 에너지가 함께합니다.'
  });
});

test('summarizeReading counts directions and only reports a unique dominant suit', function() {
  const reading = core.summarizeReading([
    { type: 'major', isRev: true },
    { type: 'minor', suitCode: 'cups', isRev: false },
    { type: 'minor', suitCode: 'cups', isRev: false }
  ], 'love', ['과거', '현재', '미래']);

  assert.equal(reading.topic, 'love');
  assert.equal(reading.cardCount, 3);
  assert.equal(reading.majorCount, 1);
  assert.equal(reading.reversedCount, 1);
  assert.equal(reading.dominantSuit, 'cups');
  assert.deepEqual(reading.entries.map(function(entry) { return entry.position; }), ['과거', '현재', '미래']);
  assert.deepEqual(reading.entries.map(function(entry) { return entry.direction; }), ['reversed', 'upright', 'upright']);

  const tie = core.summarizeReading([
    { type: 'minor', suitCode: 'cups' },
    { type: 'minor', suitCode: 'wands' }
  ], 'general', []);
  assert.equal(tie.dominantSuit, null);
});

test('shared reading tokens preserve the exact spread and reject invalid data', function() {
  const token = core.encodeReading({
    topic: 'love',
    deckId: 'rws',
    pool: 'all',
    count: 3,
    cards: [
      { id: 6, isRev: false },
      { id: 36, isRev: true },
      { id: 21, isRev: false }
    ]
  });

  assert.deepEqual(core.decodeReading(token), {
    version: 3,
    topic: 'love',
    deckId: 'rws',
    pool: 'all',
    count: 3,
    cards: [
      { id: 6, isRev: false },
      { id: 36, isRev: true },
      { id: 21, isRev: false }
    ]
  });
  assert.equal(token.split('.')[0], '3');
  assert.deepEqual(core.decodeReading('1.l.a.3.6u-10r-lu'), {
    version: 1,
    topic: 'love',
    deckId: 'rws',
    pool: 'all',
    count: 3,
    cards: [
      { id: 6, isRev: false },
      { id: 36, isRev: true },
      { id: 21, isRev: false }
    ]
  });
  assert.deepEqual(core.decodeReading('2.l.a.3.6u-10r-lu'), Object.assign({}, core.decodeReading('1.l.a.3.6u-10r-lu'), { version: 2 }));
  assert.equal(core.decodeReading('3.l.bad.deck.a.3.6u-10r-lu'), null);
  assert.equal(core.decodeReading('1.l.m.3.6u-36r-21u'), null);
  assert.equal(core.decodeReading('broken'), null);
});

test('all 78 configured card images exist locally', function() {
  const deck = deckCatalog.get('rws');
  const assets = deck.assets();
  assert.equal(assets.length, 78);
  assert.equal(new Set(assets).size, 78);
  assets.forEach(function(asset) {
    assert.ok(fs.existsSync(path.join(__dirname, '..', asset)), asset);
  });
});

test('deck catalog keeps card lookup and pool selection behind one interface', function() {
  const deck = deckCatalog.get('rws');
  assert.equal(deckCatalog.defaultId, 'rws');
  assert.equal(deck.shortName, '웨이트');
  assert.equal(deck.tradition, '라이더–웨이트–스미스');
  deck.setCards([{ id: 0, type: 'major' }, { id: 22, type: 'minor', suitCode: 'wands', numCode: 'ace' }]);
  assert.equal(deck.card(22).suitCode, 'wands');
  assert.deepEqual(deck.cards('major').map(function(card) { return card.id; }), [0]);
  assert.deepEqual(deck.cards('minor').map(function(card) { return card.id; }), [22]);
  assert.equal(deck.image(deck.card(22)), './assets/Wands01.webp');

  const secondDeck = deckCatalog.register({
    id: 'test-deck',
    name: 'Test Deck',
    shortName: 'Test',
    tradition: 'Test Tradition',
    description: 'Test description',
    assetRoot: './assets/decks/test',
    images: { major_0: 'test.webp' },
    cards: [{ id: 0, type: 'major', name: 'Test Card' }]
  });
  assert.equal(secondDeck.shortName, 'Test');
  assert.equal(secondDeck.tradition, 'Test Tradition');
  assert.equal(secondDeck.description, 'Test description');
  assert.equal(secondDeck.card(0).name, 'Test Card');
  assert.equal(secondDeck.image(secondDeck.card(0)), './assets/decks/test/test.webp');
});

test('service worker shell references real project files', function() {
  const source = fs.readFileSync(path.join(__dirname, '..', 'sw.js'), 'utf8');
  const shell = source.match(/const APP_SHELL = \[([\s\S]*?)\];/)[1];
  const files = Array.from(shell.matchAll(/'\.\/([^']*)'/g), function(match) { return match[1]; });

  files.filter(Boolean).forEach(function(file) {
    const localFile = file.split('?')[0];
    assert.ok(fs.existsSync(path.join(__dirname, '..', localFile)), file);
  });
  assert.match(source, /importScripts\('\.\/card\.js'\)/);
  assert.match(source, /const CARD_CACHE_NAME = 'noru-cards-v1'/);
  assert.match(source, /self\.NORU\.deckCatalog\.get\(deckId\)/);
  assert.doesNotMatch(source, /CARD_CONFIG|CARD_ASSETS/);
  assert.match(source, /CACHE_ALL_CARDS/);
  assert.doesNotMatch(shell, /assets\//);
  assert.match(source, /cache\.addAll\(APP_SHELL\)/);
});

test('spread meanings and card symbolism stay complete', function() {
  const source = fs.readFileSync(path.join(__dirname, '..', 'locale', 'ko.js'), 'utf8');
  const sandbox = { window: {} };
  vm.runInNewContext(source, sandbox);
  const locale = sandbox.window.LOCALE;

  assert.deepEqual(Array.from(locale.spreads[10].pos), [
    '현재 상황', '교차하는 영향', '의식적인 목표', '상황의 기반', '지나가는 과거',
    '가까운 미래', '질문자의 태도', '주변 환경', '희망과 두려움', '최종 결과'
  ]);
  assert.doesNotMatch(locale.spreads[3].desc, /가장 오래된/);
  assert.doesNotMatch(locale.spreads[10].desc, /15세기/);
  assert.equal(locale.spreads[7].pos[3], '의지와 해결책');
  assert.ok(Object.values(locale.spreads).flatMap(function(spread) { return spread.pos; }).every(function(position) {
    return locale.positionGuides[position];
  }));
  assert.equal(locale.symbolism.major.length, 22);
  assert.equal(Object.keys(locale.symbolism.minor).length, 56);
  assert.ok(locale.symbolism.major.every(Boolean));
  assert.ok(Object.values(locale.symbolism.minor).every(Boolean));
  assert.equal(locale.readingNotes.major.length, 22);
  assert.ok(locale.readingNotes.major.every(function(note) { return note.focus && note.question; }));
  assert.ok(locale.major.every(function(card) { return card.keywords.length >= 3 && card.up && card.rv && card.lv && card.ca; }));
  assert.equal(Object.keys(locale.minorData).length, 56);
  assert.ok(Object.values(locale.minorData).every(function(card) { return card.up && card.rv && card.lv && card.ca; }));
  assert.equal(Object.keys(locale.minorKeywords).length, 56);
  assert.ok(Object.values(locale.minorKeywords).every(function(keywords) { return keywords.length >= 3; }));
  assert.ok(locale.suits.every(function(suit) { return suit.guide && suit.reverseLove && suit.reverseCareer; }));
  assert.ok(locale.numbers.every(function(number) { return number.meaning && number.question; }));
  assert.deepEqual(Array.from(locale.birthPairs[9].c), [18, 9]);
  assert.ok([1, 2, 3, 4, 5, 6, 7, 8, 9].every(function(number) { return locale.birthPairs[number].c.length === 2; }));
  assert.ok(Object.values(locale.topics).every(function(topic) { return topic.label && topic.resultTitle && topic.summary; }));

  const app = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  assert.doesNotMatch(app, /celtic-cross-pair|is-crossing/);
  assert.match(app, /\[0,2,2\],\[1,3,2\]/);
});
