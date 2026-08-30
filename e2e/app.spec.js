const { test, expect } = require('@playwright/test');

function watchErrors(page) {
  const errors = [];
  page.on('console', function(message) {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', function(error) { errors.push(error.message); });
  return errors;
}

test('메인 화면과 카드 사전이 넘침 없이 동작한다', async function({ page }) {
  const errors = watchErrors(page);
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'NORU' })).toBeVisible();
  await expect(page.getByRole('button', { name: /카드 사전/ })).toBeVisible();
  expect(await page.evaluate(function() { return document.documentElement.scrollWidth <= document.documentElement.clientWidth; })).toBe(true);

  await page.getByRole('button', { name: /카드 사전/ }).click();
  await expect(page.getByRole('heading', { name: '카드 사전' })).toBeVisible();
  await expect(page.getByRole('button', { name: /카드 해석 보기/ })).toHaveCount(78);
  await expect(page.getByRole('heading', { name: '메이저 아르카나 · 22장' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '마이너 아르카나 · 56장' })).toBeVisible();
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
  expect(errors).toEqual([]);
});

test('선택한 카드는 스프레드에서의 순서를 보여준다', async function({ page }) {
  await page.goto('/?mode=tarot');
  await page.getByRole('button', { name: /스프레드 선택/ }).click();
  await page.getByText('쓰리 카드', { exact: true }).click();
  await page.getByRole('button', { name: '카드 섞기' }).click();

  const deckCards = page.locator('.track-card');
  await expect(deckCards.first()).not.toContainText('/ 22');
  await deckCards.first().click();
  await expect(deckCards.first()).toContainText('1번째 카드');
  await deckCards.nth(1).click();
  await expect(deckCards.nth(1)).toContainText('2번째 카드');
  await deckCards.first().click();
  await expect(deckCards.nth(1)).toContainText('1번째 카드');
});

test('서비스 워커는 앱 셸만 먼저 캐시한다', async function({ page }) {
  await page.goto('/');
  await page.evaluate(async function() { await navigator.serviceWorker.ready; });
  await expect.poll(async function() {
    return page.evaluate(async function() {
      const cache = await caches.open('noru-v28');
      return (await cache.keys()).length;
    });
  }).toBeGreaterThan(0);

  const cached = await page.evaluate(async function() {
    const cache = await caches.open('noru-v28');
    return (await cache.keys()).map(function(request) { return request.url; });
  });
  expect(cached.filter(function(url) { return url.includes('/assets/'); }).length).toBeLessThanOrEqual(3);
});

test('주제 프리셋에서 요약을 열고 공유 이미지를 저장한다', async function({ page }, testInfo) {
  const errors = watchErrors(page);
  await page.addInitScript(function() {
    Object.defineProperty(Navigator.prototype, 'share', { value: undefined, configurable: true });
    Object.defineProperty(Navigator.prototype, 'canShare', { value: undefined, configurable: true });
  });
  await page.goto('/');

  await page.getByRole('button', { name: /애정 관계와 감정의 흐름/ }).click();
  await expect(page.getByRole('heading', { name: '어떤 덱으로 카드를 펼쳐볼까요?' })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('heading', { name: '오늘은 무엇을 살펴볼까요?' })).toBeVisible();
  await expect(page.locator('.mode-card.is-selected, .topic-btn.is-selected')).toHaveCount(0);
  await expect(page.locator('.topic-btn[aria-pressed="true"]')).toHaveCount(0);
  await page.getByRole('button', { name: /애정 관계와 감정의 흐름/ }).click();
  await page.getByRole('button', { name: /스프레드 선택/ }).click();
  await page.goBack();
  await expect(page.getByRole('heading', { name: '어떤 덱으로 카드를 펼쳐볼까요?' })).toBeVisible();
  await page.getByRole('button', { name: /스프레드 선택/ }).click();
  await expect(page.locator('.count-preview')).toHaveCount(5);
  await page.getByRole('button', { name: '카드 섞기' }).click();
  if (testInfo.project.name === 'desktop') await expect(page.getByText('카드를 섞고 있어요...')).toBeVisible();

  const deckCards = page.locator('.track-card');
  await deckCards.first().click();
  await expect(deckCards.first()).toHaveClass(/is-selected/);
  await page.getByRole('button', { name: '선택한 카드 펼치기' }).click();
  await expect(page.getByText('애정 주제')).toBeVisible();
  await expect(page.getByRole('heading', { name: '종합 평가' })).toBeVisible();
  await expect(page.locator('#readingOverview')).not.toBeEmpty();
  await expect(page.locator('#s4')).not.toContainText('카드는 결정을 대신하지 않습니다');
  await page.getByRole('button', { name: '결과 요약 보기' }).click();
  await expect(page.getByRole('dialog', { name: '관계와 감정' })).toBeVisible();
  await expect(page.locator('.summary-card')).toHaveCount(1);
  await expect(page.locator('.summary-card-art img')).toHaveCount(1);
  await expect(page.getByRole('dialog')).not.toContainText('선택을 찾아보세요');
  await expect(page.locator('.summary-stats')).toHaveCount(0);
  await expect(page.getByRole('dialog')).not.toContainText('메이저 카드가');

  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: '결과 이미지 공유' }).click();
  const image = await download;
  expect(image.suggestedFilename()).toMatch(/^noru-love-\d+\.png$/);
  await image.saveAs(testInfo.outputPath('share.png'));
  const chunks = [];
  for await (const chunk of await image.createReadStream()) chunks.push(chunk);
  const png = Buffer.concat(chunks);
  expect(png.readUInt32BE(16)).toBe(1080);
  expect(png.readUInt32BE(20)).toBeGreaterThanOrEqual(1350);
  expect(png.length).toBeGreaterThan(20_000);
  expect(errors).toEqual([]);
});
