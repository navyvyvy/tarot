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

  return { shuffleDeck: shuffleDeck, calculateBirthCard: calculateBirthCard, summarizeReading: summarizeReading };
});
