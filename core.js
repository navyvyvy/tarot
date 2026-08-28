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

  return { shuffleDeck: shuffleDeck, calculateBirthCard: calculateBirthCard };
});
