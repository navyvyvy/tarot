(function(root, factory) {
  var images = factory();
  var decks = Object.create(null);
  var defaultDeckId = 'rws';

  function cardKey(card) {
    return card.type === 'major'
      ? 'major_' + card.id
      : 'minor_' + card.suitCode + '_' + card.numCode;
  }

  function createDeck(definition) {
    var allCards = [];
    var assetRoot = (definition.assetRoot || './assets').replace(/\/$/, '');
    return {
      id: definition.id,
      name: definition.name,
      shortName: definition.shortName || definition.name,
      tradition: definition.tradition || '',
      description: definition.description || '',
      previewCardId: definition.previewCardId || 0,
      setCards: function(cards) {
        allCards = cards.slice();
      },
      cards: function(pool) {
        if (pool === 'major') return allCards.filter(function(card) { return card.type === 'major'; });
        if (pool === 'minor') return allCards.filter(function(card) { return card.type === 'minor'; });
        return allCards.slice();
      },
      card: function(id) {
        return allCards.find(function(card) { return card.id === id; }) || null;
      },
      image: function(card) {
        return assetRoot + '/' + (definition.images[cardKey(card)] || 'default.webp');
      },
      assets: function() {
        return Object.values(definition.images).map(function(filename) { return assetRoot + '/' + filename; });
      }
    };
  }

  function register(definition) {
    if (!definition || !definition.id || decks[definition.id]) return null;
    decks[definition.id] = createDeck(definition);
    if (definition.cards) decks[definition.id].setCards(definition.cards);
    return decks[definition.id];
  }

  var catalog = {
    defaultId: defaultDeckId,
    register: register,
    get: function(id) { return decks[id] || null; },
    list: function() { return Object.keys(decks).map(function(id) { return decks[id]; }); }
  };

  register({
    id: 'rws',
    name: '유니버설 웨이트',
    shortName: '웨이트',
    tradition: '라이더–웨이트–스미스',
    description: '장면이 또렷해 처음 읽기 쉬운 덱',
    previewCardId: 0,
    images: images
  });
  root.NORU = root.NORU || {};
  root.NORU.deckCatalog = catalog;
  if (typeof module === 'object' && module.exports) module.exports = catalog;
})(typeof self !== 'undefined' ? self : globalThis, function() {
  return {
    "major_0": "RWS_Tarot_00_Fool.webp",
    "major_1": "RWS_Tarot_01_Magician.webp",
    "major_2": "RWS_Tarot_02_High_Priestess.webp",
    "major_3": "RWS_Tarot_03_Empress.webp",
    "major_4": "RWS_Tarot_04_Emperor.webp",
    "major_5": "RWS_Tarot_05_Hierophant.webp",
    "major_6": "RWS_Tarot_06_Lovers.webp",
    "major_7": "RWS_Tarot_07_Chariot.webp",
    "major_8": "RWS_Tarot_08_Strength.webp",
    "major_9": "RWS_Tarot_09_Hermit.webp",
    "major_10": "RWS_Tarot_10_Wheel_of_Fortune.webp",
    "major_11": "RWS_Tarot_11_Justice.webp",
    "major_12": "RWS_Tarot_12_Hanged_Man.webp",
    "major_13": "RWS_Tarot_13_Death.webp",
    "major_14": "RWS_Tarot_14_Temperance.webp",
    "major_15": "RWS_Tarot_15_Devil.webp",
    "major_16": "RWS_Tarot_16_Tower.webp",
    "major_17": "RWS_Tarot_17_Star.webp",
    "major_18": "RWS_Tarot_18_Moon.webp",
    "major_19": "RWS_Tarot_19_Sun.webp",
    "major_20": "RWS_Tarot_20_Judgement.webp",
    "major_21": "RWS_Tarot_21_World.webp",

    "minor_wands_ace": "Wands01.webp", "minor_wands_2": "Wands02.webp", "minor_wands_3": "Wands03.webp",
    "minor_wands_4": "Wands04.webp", "minor_wands_5": "Wands05.webp", "minor_wands_6": "Wands06.webp",
    "minor_wands_7": "Wands07.webp", "minor_wands_8": "Wands08.webp", "minor_wands_9": "Wands09.webp",
    "minor_wands_10": "Wands10.webp", "minor_wands_page": "Wands11.webp", "minor_wands_knight": "Wands12.webp",
    "minor_wands_queen": "Wands13.webp", "minor_wands_king": "Wands14.webp",

    "minor_cups_ace": "Cups01.webp", "minor_cups_2": "Cups02.webp", "minor_cups_3": "Cups03.webp",
    "minor_cups_4": "Cups04.webp", "minor_cups_5": "Cups05.webp", "minor_cups_6": "Cups06.webp",
    "minor_cups_7": "Cups07.webp", "minor_cups_8": "Cups08.webp", "minor_cups_9": "Cups09.webp",
    "minor_cups_10": "Cups10.webp", "minor_cups_page": "Cups11.webp", "minor_cups_knight": "Cups12.webp",
    "minor_cups_queen": "Cups13.webp", "minor_cups_king": "Cups14.webp",

    "minor_swords_ace": "Swords01.webp", "minor_swords_2": "Swords02.webp", "minor_swords_3": "Swords03.webp",
    "minor_swords_4": "Swords04.webp", "minor_swords_5": "Swords05.webp", "minor_swords_6": "Swords06.webp",
    "minor_swords_7": "Swords07.webp", "minor_swords_8": "Swords08.webp", "minor_swords_9": "Swords09.webp",
    "minor_swords_10": "Swords10.webp", "minor_swords_page": "Swords11.webp", "minor_swords_knight": "Swords12.webp",
    "minor_swords_queen": "Swords13.webp", "minor_swords_king": "Swords14.webp",

    "minor_pentacles_ace": "Pents01.webp", "minor_pentacles_2": "Pents02.webp", "minor_pentacles_3": "Pents03.webp",
    "minor_pentacles_4": "Pents04.webp", "minor_pentacles_5": "Pents05.webp", "minor_pentacles_6": "Pents06.webp",
    "minor_pentacles_7": "Pents07.webp", "minor_pentacles_8": "Pents08.webp", "minor_pentacles_9": "Pents09.webp",
    "minor_pentacles_10": "Pents10.webp", "minor_pentacles_page": "Pents11.webp", "minor_pentacles_knight": "Pents12.webp",
    "minor_pentacles_queen": "Pents13.webp", "minor_pentacles_king": "Pents14.webp"
  };
});
