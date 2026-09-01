const { test, expect } = require('@playwright/test');

function watchErrors(page) {
  const errors = [];
  page.on('console', function(message) {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', function(error) { errors.push(error.message); });
  return errors;
}

test('메인 화면과 카드 사전이 넘침 없이 동작한다', async function({ page }, testInfo) {
  const errors = watchErrors(page);
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'NORU' })).toBeVisible();
  await expect(page.getByRole('button', { name: /카드 사전/ })).toBeVisible();
  if (testInfo.project.name === 'desktop') {
    const topicButton = page.getByRole('button', { name: /전체 흐름 지금의 상황과 앞으로의 흐름/ });
    await topicButton.hover();
    expect(await topicButton.evaluate(button => getComputedStyle(button).transform)).not.toBe('none');
  }
  expect(await page.evaluate(function() { return document.documentElement.scrollWidth <= document.documentElement.clientWidth; })).toBe(true);

  await page.getByRole('button', { name: /카드 사전/ }).click();
  await expect(page.getByRole('heading', { name: '카드 사전' })).toBeVisible();
  await expect(page.getByRole('button', { name: /카드 해석 보기/ })).toHaveCount(78);
  await expect(page.getByRole('button', { name: /카드 해석 보기/ }).first()).not.toContainText(/메이저|마이너/);
  await expect(page.getByRole('heading', { name: '메이저 아르카나 · 22장' })).toBeVisible();
  for (const suit of ['완드', '컵', '소드', '펜타클']) await expect(page.getByRole('heading', { name: suit + ' · 14장' })).toBeVisible();
  expect(await page.locator('.dictionary-card strong').first().evaluate(function(name) { return getComputedStyle(name).textAlign; })).toBe('center');
  await page.getByLabel('카드 종류').selectOption('minor');
  await expect(page.getByRole('button', { name: /카드 해석 보기/ })).toHaveCount(56);
  await page.getByLabel('카드 종류').selectOption('cups');
  await expect(page.getByRole('button', { name: /카드 해석 보기/ })).toHaveCount(14);
  await page.getByLabel('카드 종류').selectOption('all');

  await page.getByLabel('카드 검색').fill('여사제');
  await expect(page.getByRole('button', { name: /여사제 카드 해석 보기/ })).toHaveCount(1);
  await page.getByRole('button', { name: /여사제 카드 해석 보기/ }).click();
  await expect(page.getByRole('dialog', { name: /여사제/ })).toBeVisible();
  await expect(page.getByRole('tab', { name: '관계·직업' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('켈틱 크로스는 열 장을 겹치지 않게 보여준다', async function({ page }) {
  const errors = watchErrors(page);
  await page.goto('/?mode=tarot');
  await page.getByRole('button', { name: /스프레드 선택/ }).click();
  await page.getByText('켈틱 크로스', { exact: true }).click();
  await page.getByRole('slider', { name: '역방향 카드 비율' }).fill('100');
  await page.getByRole('button', { name: '카드 섞기' }).click();

  const deckCards = page.locator('.track-card');
  for (let i = 0; i < 10; i += 1) await deckCards.nth(i).click();
  await page.getByRole('button', { name: '선택한 카드 펼치기' }).click();

  const grid = page.locator('.result-grid-celtic');
  await expect(grid.getByRole('button')).toHaveCount(10);
  const boxes = await grid.locator('.result-frame').evaluateAll(function(frames) {
    return frames.map(function(frame) {
      const box = frame.getBoundingClientRect();
      return { left: box.left, right: box.right, top: box.top, bottom: box.bottom };
    });
  });
  const overlaps = boxes.some(function(box, index) {
    return boxes.slice(index + 1).some(function(other) {
      return Math.min(box.right, other.right) - Math.max(box.left, other.left) > 1
        && Math.min(box.bottom, other.bottom) - Math.max(box.top, other.top) > 1;
    });
  });
  expect(overlaps).toBe(false);
  await grid.getByRole('button').nth(1).click();
  await page.getByRole('tab', { name: '관계·직업' }).click();
  await expect(page.locator('.modal-context-note')).toHaveCount(2);
  await expect(page.locator('.modal-context-note').first()).toContainText('이 카드의 역방향 의미');
  const overview = await page.locator('#readingOverview').textContent();
  const names = await grid.locator('.result-name').allTextContents();
  for (const name of names) expect(overview).toContain(name);
  expect(errors).toEqual([]);
});

test('선택한 카드와 추가 카드는 같은 크기로 결과에 모인다', async function({ page }, testInfo) {
  await page.goto('/?mode=tarot');
  await page.getByRole('button', { name: /스프레드 선택/ }).click();
  const spreadHeights = [];
  for (let index = 0; index < 5; index += 1) {
    await page.locator('.count-btn').nth(index).click();
    await page.waitForTimeout(280);
    spreadHeights.push(await page.locator('#spInfo').evaluate(function(info) { return Math.round(info.getBoundingClientRect().height); }));
  }
  expect(Math.max(...spreadHeights) - Math.min(...spreadHeights)).toBeLessThanOrEqual(1);
  expect(await page.locator('.wrap > header').evaluate(function(header) { return header.getBoundingClientRect().height; })).toBeLessThan(60);
  await page.locator('.count-btn').nth(1).click();
  await page.getByRole('button', { name: '카드 섞기' }).click();

  const deckCards = page.locator('.track-card');
  await expect(deckCards.first()).not.toContainText('/ 22');
  await deckCards.first().click();
  await expect(deckCards.first()).toContainText('1번째 카드');
  await deckCards.nth(1).click();
  await expect(deckCards.nth(1)).toContainText('2번째 카드');
  await deckCards.first().click();
  await expect(deckCards.nth(1)).toContainText('1번째 카드');
  await deckCards.first().click();
  await deckCards.nth(2).click();
  await page.getByRole('button', { name: '선택한 카드 펼치기' }).click();
  await expect(page.locator('#s4grid .result-card')).toHaveCount(3);
  await expect(page.locator('#readingSpreadTitle')).toHaveClass(/sr-only/);
  await expect(page.locator('#readingOverview')).toContainText('과거에는');
  const mainMeanings = await page.evaluate(function() {
    return S.revealed.slice(0, S.count).map(function(card) {
      const text = card.isRev ? card.rv : card.up;
      const sentence = String(text || '').match(/^[^.!?]+[.!?]?/);
      return sentence ? sentence[0].trim() : '';
    });
  });
  for (const meaning of mainMeanings) await expect(page.locator('#readingOverview')).toContainText(meaning);
  if (testInfo.project.name === 'desktop') {
    const fitsViewport = await page.evaluate(function() {
      return document.getElementById('s4').getBoundingClientRect().bottom <= innerHeight + 1;
    });
    expect(fitsViewport).toBe(true);
  }
  await page.getByRole('button', { name: '추가 카드' }).click();
  await page.locator('.track-card').first().click();
  await page.getByRole('button', { name: '결과에 추가하기' }).click();
  await expect(page.locator('#s4extraGrid .result-card')).toHaveCount(1);
  const extraMeaning = await page.evaluate(function() {
    const card = S.revealed[S.count];
    const text = card.isRev ? card.rv : card.up;
    const sentence = String(text || '').match(/^[^.!?]+[.!?]?/);
    return sentence ? sentence[0].trim() : '';
  });
  await expect(page.locator('#readingOverview')).toContainText(extraMeaning);
  const resultWidths = await page.locator('#s4 .result-frame').evaluateAll(function(frames) { return frames.map(function(frame) { return parseFloat(getComputedStyle(frame).width); }); });
  expect(new Set(resultWidths.map(Math.round)).size).toBe(1);
  if (testInfo.project.name === 'desktop') {
    const compactScroll = await page.evaluate(function() {
      return document.documentElement.scrollHeight - innerHeight;
    });
    expect(compactScroll).toBeLessThanOrEqual(280);
  }
});

test('탄생연도는 현재 연도부터 120년 전까지 제공한다', async function({ page }) {
  await page.goto('/?mode=birth');
  const currentYear = await page.evaluate(function() { return new Date().getFullYear(); });
  const years = await page.locator('#bYear option').evaluateAll(function(options) {
    return options.map(function(option) { return option.value; }).filter(Boolean);
  });

  expect(years).toHaveLength(121);
  expect(years[0]).toBe(String(currentYear));
  expect(years[years.length - 1]).toBe(String(currentYear - 120));

  await page.locator('#bYear').selectOption(String(currentYear - 120));
  await page.locator('#bMonth').selectOption('1');
  await page.locator('#bDay').selectOption('1');
  await page.getByRole('button', { name: '나의 탄생 카드 찾기' }).click();
  await expect(page.locator('#birthRes .result-card').first()).toBeVisible();
});

test('서비스 워커는 앱 셸만 먼저 캐시한다', async function({ page }) {
  await page.goto('/');
  await page.evaluate(async function() { await navigator.serviceWorker.ready; });
  await expect.poll(async function() {
    return page.evaluate(async function() {
      const cache = await caches.open('noru-app-v64');
      return (await cache.keys()).length;
    });
  }).toBeGreaterThan(0);

  const cached = await page.evaluate(async function() {
    const cache = await caches.open('noru-app-v64');
    return (await cache.keys()).map(function(request) { return request.url; });
  });
  expect(cached.filter(function(url) { return url.includes('/assets/'); }).length).toBeLessThanOrEqual(3);
});

test('78장 덱을 저장하면 실제로 오프라인에서 카드가 열린다', async function({ page }) {
  test.slow();
  await page.goto('/');
  await page.evaluate(async function() {
    await navigator.serviceWorker.ready;
    await caches.delete('noru-cards-v1');
  });

  await page.getByRole('button', { name: '오프라인으로 저장' }).click();
  await expect(page.locator('#offlineStatus')).toHaveText('78장 저장 완료');

  const cacheState = await page.evaluate(async function() {
    const cache = await caches.open('noru-cards-v1');
    const requests = await cache.keys();
    const responses = await Promise.all(requests.map(function(request) { return cache.match(request); }));
    return {
      count: requests.filter(function(request) { return request.url.includes('/assets/'); }).length,
      complete: responses.every(Boolean)
    };
  });
  expect(cacheState).toEqual({ count: 78, complete: true });

  await page.context().setOffline(true);
  try {
    await page.reload();
    await page.getByRole('button', { name: /카드 사전/ }).click();
    const image = page.locator('.dictionary-frame img').first();
    await expect(image).toBeVisible();
    await expect.poll(function() { return image.evaluate(function(node) { return node.naturalWidth; }); }).toBeGreaterThan(0);
  } finally {
    await page.context().setOffline(false);
  }
});

test('주제 프리셋 결과를 링크로 복원하고 같은 내용의 이미지를 저장한다', async function({ page }, testInfo) {
  const errors = watchErrors(page);
  await page.addInitScript(function() {
    Object.defineProperty(Navigator.prototype, 'share', { value: undefined, configurable: true });
    Object.defineProperty(Navigator.prototype, 'canShare', { value: undefined, configurable: true });
    Object.defineProperty(Navigator.prototype, 'clipboard', {
      value: { writeText: function(value) { window.__sharedUrl = value; return Promise.resolve(); } },
      configurable: true
    });
  });
  await page.goto('/');

  await page.getByRole('button', { name: /관계 흐름 서로의 감정과 관계의 방향/ }).click();
  await expect(page.getByRole('heading', { name: '어떤 카드까지 섞을까요?' })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('heading', { name: '오늘은 무엇을 살펴볼까요?' })).toBeVisible();
  await expect(page.locator('.mode-card.is-selected, .topic-btn.is-selected')).toHaveCount(0);
  await expect(page.locator('.topic-btn[aria-pressed="true"]')).toHaveCount(0);
  await page.getByRole('button', { name: /관계 흐름 서로의 감정과 관계의 방향/ }).click();
  await page.getByRole('button', { name: /스프레드 선택/ }).click();
  await page.goBack();
  await expect(page.getByRole('heading', { name: '어떤 카드까지 섞을까요?' })).toBeVisible();
  await page.getByRole('button', { name: /스프레드 선택/ }).click();
  await expect(page.locator('.count-preview')).toHaveCount(5);
  await page.getByRole('button', { name: '카드 섞기' }).click();
  if (testInfo.project.name === 'desktop') await expect(page.getByText('카드를 섞고 있어요...')).toBeVisible();

  const deckCards = page.locator('.track-card');
  await expect(page.locator('#hint')).toHaveText('마음이 가는 카드를 고르세요. 옆으로 밀면 다른 카드도 볼 수 있어요.');
  expect(await deckCards.locator('.card-back-image').evaluateAll(images => images.filter(image => !image.complete || image.naturalWidth === 0).length)).toBe(0);
  if (testInfo.project.name === 'desktop') {
    await page.getByRole('button', { name: '다음 카드' }).click();
    expect(await page.locator('#ctrack').evaluate(track => track.scrollLeft)).toBeGreaterThan(250);
  }
  await deckCards.first().click();
  await expect(deckCards.first()).toHaveClass(/is-selected/);
  await page.getByRole('button', { name: '선택한 카드 펼치기' }).click();
  await expect(page.locator('#s4topic')).toHaveText('결과');
  await expect(page.locator('#readingOverviewTopic')).toHaveText('관계 흐름');
  await expect(page.getByRole('heading', { name: '원 카드' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '종합 평가' })).toBeVisible();
  await expect(page.locator('#readingOverview')).not.toBeEmpty();
  await expect(page.locator('#s4grid .result-label')).toHaveText('1. 지금의 메시지');
  await expect(page.locator('#s4grid .result-name')).not.toBeEmpty();
  await expect(page.locator('#s4grid .result-badge')).toHaveCount(3);
  await expect(page.locator('#s4grid .result-direction')).toHaveText(/정방향|역방향/);
  await expect(page.locator('#s4desc')).toBeHidden();
  await page.locator('.result-info summary').click();
  await expect(page.locator('#s4desc')).toBeVisible();
  await page.locator('.result-info summary').click();
  await expect(page.locator('#s4')).not.toContainText('카드는 결정을 대신하지 않습니다');
  await expect(page.locator('#readingCards .reading-card')).toHaveCount(1);
  await expect(page.locator('#readingCards')).toBeHidden();
  await page.getByRole('button', { name: '카드별 해석 모아 보기' }).click();
  await expect(page.getByRole('dialog', { name: '카드별 해석' })).toBeVisible();
  await expect(page.locator('#readingCards')).toBeVisible();
  await expect(page.locator('#readingCards .reading-card-art .result-name')).not.toBeEmpty();
  await expect(page.locator('#readingCards .reading-card-copy .result-label')).toHaveText('1. 지금의 메시지');
  await expect(page.locator('#readingCards .reading-card-copy p')).toContainText('지금의 메시지 자리의');
  await expect(page.locator('#readingCards .result-direction')).toHaveCount(1);
  await expect(page.locator('#readingCards .result-keywords .result-badge')).toHaveCount(2);
  await expect(page.locator('#readingCards .reading-card-art .result-name')).toHaveCSS('text-align', 'center');
  await expect(page.locator('#readingCards .reading-card-copy')).toHaveCSS('text-align', 'left');
  await page.locator('#readingDetailsClose').click();
  expect(await page.locator('.result-frame').evaluate(function(frame) { return frame.getBoundingClientRect().width; })).toBeGreaterThan(120);
  await expect(page.locator('#s4')).not.toContainText('이 요약은 선택을 대신');
  const cardName = await page.locator('#readingCards .reading-card-art .result-name').textContent();
  const mainOverview = await page.locator('#readingOverview').textContent();

  await page.getByRole('button', { name: '추가 카드' }).click();
  await page.locator('.track-card').first().click();
  await page.getByRole('button', { name: '결과에 추가하기' }).click();
  await expect(page.locator('#readingCards .reading-card')).toHaveCount(1);
  await expect(page.locator('#extraReadings .reading-card')).toHaveCount(1);
  await expect(page.locator('#s4extraGrid .result-card')).toHaveCount(1);
  await expect(page.locator('#s4extraGrid')).toBeVisible();
  await expect(page.locator('#extraReadings')).toBeHidden();
  await expect(page.locator('#overviewSwitch')).toBeVisible();
  await expect(page.getByRole('button', { name: '추가 카드 포함' })).toHaveAttribute('aria-pressed', 'true');
  const combinedOverview = await page.locator('#readingOverview').textContent();
  expect(combinedOverview).not.toBe(mainOverview);
  await page.getByRole('button', { name: '처음 결과' }).click();
  await expect(page.locator('#readingOverview')).toHaveText(mainOverview);
  await page.getByRole('button', { name: '추가 카드 포함' }).click();
  await expect(page.locator('#readingOverview')).toHaveText(combinedOverview);
  await page.getByRole('button', { name: '카드별 해석 모아 보기' }).click();
  await expect(page.getByRole('dialog', { name: '카드별 해석' })).toBeVisible();
  await expect(page.getByRole('tab', { name: '선택한 카드' })).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('tab', { name: '추가 카드' }).click();
  await expect(page.locator('#readingCards')).toBeHidden();
  await expect(page.locator('#extraReadings')).toBeVisible();
  await expect(page.locator('#extraReadings .reading-card-copy .result-label')).toHaveText('추가 1');
  await page.locator('#readingDetailsClose').click();
  const extraCardName = await page.locator('#extraReadings .reading-card-art .result-name').textContent();

  await page.getByRole('button', { name: '결과 공유' }).click();
  const shareDialog = page.getByRole('dialog', { name: '원 카드' });
  await expect(shareDialog).toBeVisible();
  await expect(page.locator('#sharePreviewCards .share-preview-card')).toHaveCount(1);
  await expect(page.locator('#sharePreviewExtraCards .share-preview-card')).toHaveCount(1);
  await expect(shareDialog.getByRole('button', { name: '추가 카드 포함' })).toHaveAttribute('aria-pressed', 'true');
  await shareDialog.getByRole('button', { name: '처음 결과' }).click();
  await expect(page.locator('#sharePreviewOverview')).toHaveText(mainOverview);
  await expect(page.locator('#sharePreviewExtra')).toBeHidden();
  await shareDialog.getByRole('button', { name: '추가 카드 포함' }).click();
  await expect(page.locator('#sharePreviewOverview')).toHaveText(combinedOverview);
  await expect(page.locator('#sharePreviewExtra')).toBeVisible();
  expect(await page.evaluate(function() { return window.__sharedUrl; })).toBeUndefined();
  await page.getByRole('button', { name: '공유하기' }).click();
  await expect(page.getByText('결과 링크를 복사했습니다.')).toBeVisible();
  const sharedUrl = await page.evaluate(function() { return window.__sharedUrl; });
  expect(sharedUrl).toMatch(/^https:\/\/navyvyvy\.github\.io\/tarot\/\?reading=/);
  expect(new URL(sharedUrl).searchParams.get('view')).toBe('all');
  await page.goto('/' + new URL(sharedUrl).search);
  await expect(page.locator('body')).toHaveClass(/shared-result-page/);
  await expect(page.getByRole('dialog', { name: '원 카드' })).toBeVisible();
  await expect(page.locator('.wrap')).toBeHidden();
  await expect(page.locator('#sharePreviewCards .share-preview-card figcaption span')).toContainText(cardName);
  await expect(page.locator('#sharePreviewExtraCards .share-preview-card figcaption span')).toContainText(extraCardName);
  await expect(page.locator('#sharePreviewOverview')).toHaveText(combinedOverview);
  await expect(page.getByRole('link', { name: '내 타로 보기' })).toHaveAttribute('href', './?mode=tarot');

  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: '이미지 저장' }).click();
  const image = await download;
  expect(image.suggestedFilename()).toMatch(/^noru-love-\d+\.png$/);
  await image.saveAs(testInfo.outputPath('share.png'));
  const chunks = [];
  for await (const chunk of await image.createReadStream()) chunks.push(chunk);
  const png = Buffer.concat(chunks);
  expect(png.readUInt32BE(16)).toBe(1080);
  expect(png.readUInt32BE(20)).toBeGreaterThanOrEqual(1350);
  expect(png.length).toBeGreaterThan(20_000);
  await page.getByRole('link', { name: '내 타로 보기' }).click();
  await expect(page.getByRole('heading', { name: '어떤 카드까지 섞을까요?' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('처음으로 버튼은 진입 쿼리를 지우고 첫 화면으로 돌아간다', async function({ page }) {
  for (const entry of [['tarot', '#bk1'], ['birth', '#bk5'], ['birth', '#rst5'], ['dictionary', '#bk6']]) {
    await page.goto('/?mode=' + entry[0] + '&qa=retain-probe');
    await page.locator(entry[1]).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('heading', { name: '오늘은 무엇을 살펴볼까요?' })).toBeVisible();
  }

  await page.goto('/?mode=tarot&qa=retain-probe');
  await page.evaluate(function() { show('s4'); });
  await page.locator('#rst4').click();
  await expect(page).toHaveURL(/\/$/);
});
