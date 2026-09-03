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
      guide: definition.guide || '',
      status: definition.status || '',
      available: definition.available !== false,
      previewImage: definition.previewImage || '',
      previewCardId: definition.previewCardId || 0,
      featuredCards: definition.featuredCards || {},
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
    tradition: '라이더-웨이트-스미스',
    description: '장면이 또렷해 처음 읽기 쉬운 덱',
    guide: '인물과 배경의 장면이 구체적이라 카드 한 장의 분위기와 사건 흐름을 함께 읽기 좋습니다.',
    previewCardId: 0,
    featuredCards: { general: 18, love: 6, career: 7, money: 64, birth: 19, dictionary: 2 },
    images: images
  });

  var marseilleImages = {};
  [
    '00_Le_Mat', '01_Le_Bateleur', '02_La_Papesse', '03_L_Imperatrice',
    '04_L_Empereur', '05_Le_Pape', '06_L_Amoureux', '07_Le_Chariot',
    '08_La_Justice', '09_L_Ermite', '10_La_Roue_de_Fortune', '11_La_Force',
    '12_Le_Pendu', '13_La_Mort', '14_Temperance', '15_Le_Diable',
    '16_La_Maison_Dieu', '17_L_Etoile', '18_La_Lune', '19_Le_Soleil',
    '20_Le_Jugement', '21_Le_Monde'
  ].forEach(function(filename, id) {
    marseilleImages['major_' + id] = filename + '.jpg';
  });
  var marseilleSuits = { wands: 'Wands', cups: 'Cups', swords: 'Swords', pentacles: 'Pents' };
  var marseilleRanks = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'page', 'knight', 'queen', 'king'];
  Object.keys(marseilleSuits).forEach(function(suit) {
    marseilleRanks.forEach(function(rank, index) {
      marseilleImages['minor_' + suit + '_' + rank] = marseilleSuits[suit] + String(index + 1).padStart(2, '0') + '.jpg';
    });
  });

  register({
    id: 'marseille',
    name: '타로 드 마르세유',
    shortName: '마르세유',
    tradition: '프랑스 전통 도상',
    description: '수와 인물의 방향을 중심으로 읽는 고전 덱',
    guide: '메이저의 선명한 상징과 마이너의 수 배열을 중심으로 읽습니다. 정의는 8번, 힘은 11번입니다.',
    assetRoot: './assets/decks/marseille',
    previewCardId: 0,
    featuredCards: { general: 18, love: 6, career: 7, money: 64, birth: 19, dictionary: 2 },
    images: marseilleImages
  });

  var etteillaImages = {};
  for (var etteillaMajorId = 0; etteillaMajorId < 22; etteillaMajorId += 1) {
    etteillaImages['major_' + etteillaMajorId] = 'major_' + etteillaMajorId + '.jpg';
  }
  Object.keys(marseilleSuits).forEach(function(suit) {
    marseilleRanks.forEach(function(rank) {
      etteillaImages['minor_' + suit + '_' + rank] = 'minor_' + suit + '_' + rank + '.jpg';
    });
  });

  register({
    id: 'etteilla',
    name: '그랑 에테이야',
    shortName: '에테이야',
    tradition: '에테이야 점술 체계',
    description: '정방향과 역방향을 함께 설계한 고전 점술 덱',
    guide: '정방향과 역방향에 서로 다른 뜻을 붙이는 에테이야 고유의 1-78 체계로 읽습니다.',
    assetRoot: './assets/decks/etteilla',
    previewCardId: 1,
    featuredCards: { general: 20, love: 13, career: 11, money: 70, birth: 1, dictionary: 2 },
    images: etteillaImages
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
