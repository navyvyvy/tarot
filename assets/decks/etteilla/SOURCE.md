# Grand Etteilla I

## Images

- Download: [Benebell Wen, Etteilla Tarot Downloads](https://benebellwen.com/etteilla/downloads/)
- Edition: *Le Grand Etteilla* images reproduced in Julia Orsini's book, commonly called Etteilla I
- Rights: the download page identifies the historical card images as public domain and permits reuse, modification, and commercial use
- Local processing: all 78 cards were resized to 480 px wide and encoded as JPEG

The local filenames follow NORU's shared card keys. The trumps retain the deck's own 1-21 and 78 order.

## Meanings

The authoritative text used for interpretation is Julia Orsini, *Le grand Etteilla, ou l'art de tirer les cartes* ([Wellcome Collection record and scan](https://wellcomecollection.org/works/yugj6zt9), catalogued as Paris, [1850?], French, Public Domain Mark). The title page itself is undated, so 1850 is a catalogue estimate. A second public-domain copy is preserved by [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Le_grand_Etteilla,_ou,_l%27art_de_tirer_les_cartes_..._Le_tout_recueilli_..._(IA_b29321220).pdf).

The book supplies two different layers of evidence:

- Individual explanations for all 78 cards begin on printed page 53. They describe card-specific imagery, practical readings, and selected neighbouring-card combinations.
- The synonym table on printed pages 153-188 gives separate natural and reversed vocabularies for every card. It explicitly says that the suitable word must be chosen from the surrounding cards, so a single keyword is not a complete reading.

No public-domain English translation was identified or used. The available modern English translation is [copyrighted](https://www.lulu.com/shop/mm-d-odoucet-and-mlle-lemarchand-and-julia-orsini-and-marius-h%C3%B8gnesen/the-grand-etteilla/paperback/product-6nw4e8.html), so Korean text should be translated from the French public-domain source. Modern love, career, reading-focus, and reflection copy is editorial application, not a quotation or historical claim, and should remain traceable to each card's source meanings.

## Data requirements

Each card should preserve its number, French head and tail labels, Korean upright and reversed summaries, direction-specific synonyms, card-specific symbolism, and source page. Applied love and career text should be written separately for each direction. Reusing one sentence template for all 78 cards is insufficient even when the inserted keyword pair is historically correct.

To remain compatible with the current renderer, the smallest useful record is:

```js
{
  number: 1,
  name: '카오스',
  original: { upright: 'Etteilla', reversed: 'Le Questionnant', figure: 'Le Chaos' },
  keywords: ['발견', '명상', '깊은 사고'],
  reversedKeywords: ['철학', '지혜', '성찰'],
  up: '카드별 정방향 해설',
  rv: '카드별 역방향 해설',
  symbolism: '실제 도상에 근거한 설명',
  lv: '정방향 관계 해석',
  reverseLove: '역방향 관계 해석',
  ca: '정방향 일과 금전 해석',
  reverseCareer: '역방향 일과 금전 해석',
  readingKey: '주변 카드와 함께 볼 핵심',
  reflection: '현재 상황에 맞춘 질문',
  sourcePages: [53, 54, 154]
}
```
