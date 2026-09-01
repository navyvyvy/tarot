(function(root, factory) {
  var core = factory();
  root.NORU = root.NORU || {};
  root.NORU.core = core;
  if (typeof module === 'object' && module.exports) module.exports = core;
})(typeof self !== 'undefined' ? self : globalThis, function() {
  function shuffleDeck(cards, reversedProbability, random) {
    var result = cards.slice();
    var rng = random || Math.random;

    for (var i = result.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var current = result[i];
      result[i] = result[j];
      result[j] = current;
    }

    return result.map(function(card) {
      return Object.assign({}, card, { isRev: rng() < reversedProbability });
    });
  }

  function calculateBirthCard(year, month, day, birthPairs) {
    var first = month + day + Math.floor(year / 100) + (year % 100);

    while (first > 21) {
      var digits = String(first);
      first = digits.length >= 3
        ? parseInt(digits.slice(0, 2), 10) + parseInt(digits.slice(2), 10)
        : Math.floor(first / 10) + (first % 10);
    }

    var second = Math.floor(first / 10) + (first % 10);
    if (second === 0 || second === first) second = first % 10 || first;
    return birthPairs[first] || { c: [first, second], d: '두 카드의 에너지가 함께합니다.' };
  }

  function summarizeReading(cards, topic, positions) {
    var suits = { wands: 0, cups: 0, swords: 0, pentacles: 0 };
    var majorCount = 0;
    var reversedCount = 0;
    var entries = cards.map(function(card, index) {
      if (card.type === 'major') majorCount += 1;
      else if (Object.prototype.hasOwnProperty.call(suits, card.suitCode)) suits[card.suitCode] += 1;
      if (card.isRev) reversedCount += 1;
      return {
        card: card,
        direction: card.isRev ? 'reversed' : 'upright',
        position: positions[index] || '추가 카드 ' + (index - positions.length + 1)
      };
    });
    var max = Math.max.apply(null, Object.keys(suits).map(function(key) { return suits[key]; }));
    var leaders = max ? Object.keys(suits).filter(function(key) { return suits[key] === max; }) : [];
    return {
      topic: topic,
      entries: entries,
      cardCount: cards.length,
      majorCount: majorCount,
      reversedCount: reversedCount,
      suitCounts: suits,
      dominantSuit: leaders.length === 1 ? leaders[0] : null
    };
  }

  function encodeReading(reading) {
    var topics = { general: 'g', love: 'l', career: 'c', money: 'm' };
    var decks = { major: 'm', minor: 'n', all: 'a' };
    if (!reading || !topics[reading.topic] || !decks[reading.deck] || !Array.isArray(reading.cards)) return '';
    var token = ['2', topics[reading.topic], decks[reading.deck], reading.count,
      reading.cards.map(function(card) {
        return Number(card.id).toString(36) + (card.isRev ? 'r' : 'u');
      }).join('-')].join('.');
    return decodeReading(token) ? token : '';
  }

  function decodeReading(token) {
    if (typeof token !== 'string') return null;
    var parts = token.split('.');
    var topics = { g: 'general', l: 'love', c: 'career', m: 'money' };
    var decks = { m: 'major', n: 'minor', a: 'all' };
    var count = Number(parts[3]);
    if (parts.length !== 5 || ['1', '2'].indexOf(parts[0]) < 0 || !topics[parts[1]] || !decks[parts[2]] || [1, 3, 5, 7, 10].indexOf(count) < 0) return null;
    var cards = parts[4] ? parts[4].split('-').map(function(value) {
      var match = value.match(/^([0-9a-z]+)([ur])$/);
      return match ? { id: parseInt(match[1], 36), isRev: match[2] === 'r' } : null;
    }) : [];
    var deck = decks[parts[2]];
    var ids = cards.map(function(card) { return card && card.id; });
    var validIds = ids.every(function(id) {
      return Number.isInteger(id) && id >= 0 && id < 78 && (deck === 'all' || (deck === 'major' ? id < 22 : id >= 22));
    });
    if (cards.length < count || cards.length > 78 || !validIds || new Set(ids).size !== ids.length) return null;
    return { version: Number(parts[0]), topic: topics[parts[1]], deck: deck, count: count, cards: cards };
  }

  return { shuffleDeck: shuffleDeck, calculateBirthCard: calculateBirthCard, summarizeReading: summarizeReading, encodeReading: encodeReading, decodeReading: decodeReading };
});
