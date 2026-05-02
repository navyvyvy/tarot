# 🦌 NORU — 타로 카드 웹 앱

> 새벽 안개 속 노루처럼, 고요히 운명과 마주하다.

라이더-웨이트 타로 덱을 기반으로 한 한국어 타로 리딩 웹 애플리케이션입니다.  
단일 HTML 파일 구조로 별도 빌드 없이 바로 실행됩니다.

---

## ✨ 주요 기능

### 타로 리딩
- **5가지 스프레드** — 원 카드 · 쓰리 카드 · 파이브 크로스 · 매직 세븐 (육망성) · 켈틱 크로스 (10장)
- **3종 덱** — 메이저 아르카나(22장) / 마이너 아르카나(56장) / 전체 78장
- **역방향 확률 슬라이더** — 0~100% 자유 조절 (기본값 50%, 전통 타로 기준)
- 카드 클릭 시 상세 해석 모달 (정방향 · 역방향 · 연애 · 직업)
- 모달 내 카드 이미지 클릭 시 전체화면 확대
- 결과 확인 후 추가 카드 뽑기
- 모바일 터치 드래그 + 마우스 드래그 + 휠 스크롤

### 탄생 카드
- 생년월일로 나만의 타로 탄생 카드 계산 (Labyrinthos 방식)
- 메이저 아르카나 1~21번 전체 해석 (1~9 단일 카드 포함)
- 숫자 19 → 태양 · 수레바퀴 · 마법사 3장 삼위일체 처리

### 카드 이미지
- Wikimedia Commons **라이더-웨이트 1909년판** 공개도메인 이미지
- 78장 전체 URL 직접 매핑
- 로드 실패 시 수트별 색상 플레이스홀더 자동 표시

---

## 🗂️ 파일 구조

```
/
├── index.html        # 앱 본체
├── manifest.json     # PWA 매니페스트
├── sw.js             # Service Worker (오프라인 캐싱)
├── icon-192.svg      # PWA 아이콘 192×192
├── icon-512.svg      # PWA 아이콘 512×512
├── locale/
│   └── ko.js         # 한국어 언어 파일 (번역 시 복사)
├── README.md
└── LICENSE
```

---

## 🚀 실행 방법

### 로컬
```bash
npx serve .
# 또는
python3 -m http.server 8080
```

### 배포
GitHub Pages, Vercel, Netlify 등 정적 호스팅에 전체 파일 업로드.  
PWA 설치는 **HTTPS 환경**에서만 활성화됩니다.

### 버전 업데이트
```html
<!-- index.html — 이 값만 올리면 SW 캐시 자동 갱신 -->
<meta name="app-version" content="1.1.0">
```

---

## 🌐 다국어 지원 (i18n)

모든 UI 문자열, 카드 이름, 해석 텍스트가 `locale/ko.js`에 분리되어 있습니다.

### 번역 방법
```bash
cp locale/ko.js locale/en.js
# en.js 안의 텍스트 번역
```

`index.html` 로드 태그 교체:
```html
<script src="locale/en.js"></script>
```

`applyLocale()` 가 `data-i18n` 마킹된 HTML 요소를 자동 갱신하고  
`document.documentElement.lang/dir` 도 locale 설정에 따라 자동 변경됩니다.

### locale 파일 구조
| 키 | 내용 |
|---|---|
| `ui` | 버튼, 레이블, 힌트, 오버레이 등 모든 UI 문자열 |
| `ui.minorNameFmt` | 카드 이름 포맷 (`ko: '{suit}의 {num}'` / `en: '{num} of {suit}'`) |
| `ui.majorNumPrefix` | 메이저 번호 접두어 (`ko/en: 'No.'` / `ja: '第'`) |
| `ui.minorFallback` | 데이터 없을 때 fallback 템플릿 |
| `major` | 메이저 아르카나 22장 (name, keywords, up, rv, lv, ca) |
| `minorData` | 마이너 아르카나 56장 고유 해석 (`'wands.ace'` ~ `'pentacles.king'`) |
| `spreads` | 스프레드 정의 및 위치 설명 |
| `suits` | 수트 데이터 (code, n, e, t) |
| `numbers` | 숫자 데이터 (code, label) |
| `birthPairs` | 탄생 카드 페어 해석 |

### 언어 독립적 카드 키
마이너 아르카나는 코드 기반 키를 사용합니다:
```
'wands.ace' ~ 'wands.king'
'cups.ace'  ~ 'cups.king'
'swords.ace' ~ 'swords.king'
'pentacles.ace' ~ 'pentacles.king'
```

---

## 📱 PWA 지원

- 홈 화면 추가 (Android · iOS)
- **오프라인 지원** — 앱 셸 + 방문한 카드 이미지 캐시
- 바로가기: 타로 리딩 / 탄생 카드 (`?mode=tarot`, `?mode=birth`)
- 브라우저 주소창 테마 색상 적용
- iOS Safari `apple-mobile-web-app-capable` 지원

### 캐싱 전략
| 리소스 | 전략 |
|---|---|
| index.html · manifest · 아이콘 · locale | Cache First (앱 셸) |
| Wikimedia 카드 이미지 | Network First + 캐시 폴백 |
| Google Fonts · jsDelivr | Cache First |

---

## 🛠️ 기술 스택

| 항목 | 내용 |
|---|---|
| 언어 | HTML · CSS · Vanilla JS (빌드 도구 없음) |
| 폰트 | Pretendard (본문) · Cinzel (제목) · Libre Baskerville (이탤릭) |
| 이미지 | Wikimedia Commons CDN (lazy loading) |
| 아이콘 | 인라인 SVG (초승달 디자인) |
| 배경 | Canvas API 별 파티클 (백그라운드 탭 자동 중지) |
| 상태 관리 | `window.NORU.state` 단일 객체 |

---

## ♿ 접근성

- WCAG 2.1 기준 적용
- `role`, `aria-label`, `aria-checked`, `aria-valuenow` 등 50개+ aria 속성
- 모달 포커스 트랩 — 열릴 때 포커스 이동, 닫힐 때 원래 요소 복귀
- Tab 키로 모달 내 포커스 순환
- `maximum-scale` 제거 → 모바일 핀치 줌 허용
- ESC 키로 모달/확대 닫기
- 에러 토스트 `aria-live="polite"` — 스크린리더 지원

---

## 🔧 주요 기술 구현

| 구현 | 설명 |
|---|---|
| `cardName(card)` | `minorNameFmt` 포맷으로 언어별 어순 자동 처리 |
| 에러 토스트 | try-catch 에러 시 사용자 시각적 알림 (3초 자동 소멸) |
| `window.NORU` | `NORU.state`, `NORU.anim` 네임스페이스 점진적 모듈화 |
| SW 버전 관리 | `<meta name="app-version">` 한 곳만 수정으로 캐시 자동 갱신 |
| 개발/프로덕션 로거 | `localhost`에서만 console 출력, 배포 시 완전 억제 |
| `ANIM` 상수 | 셔플/공개/탄생카드 딜레이를 상수로 중앙 관리 |

---

## 🃏 카드 데이터

### 메이저 아르카나 (22장)
광대(0)부터 세계(21)까지 각 카드별 고유 해석: 정방향 / 역방향 / 연애·관계 / 직업·금전

### 마이너 아르카나 (56장)
완드 · 컵 · 소드 · 펜타클 × 14장 = 56장, 카드별 개별 고유 해석 수록

### 탄생 카드 페어 테이블
| 합산 | 카드 | 합산 | 카드 |
|---|---|---|---|
| 21 | 세계 + 여황제 | 10 | 수레바퀴 + 마법사 |
| 20 | 심판 + 여사제 | 19 | 태양 + 수레바퀴 + 마법사 ✦ |
| 18 | 달 + 은둔자 | 17 | 별 + 힘 |
| 16 | 탑 + 전차 | 15 | 악마 + 연인 |
| 14 | 절제 + 교황 | 13 | 죽음 + 황제 |
| 12 | 매달린 남자 + 여황제 | 11 | 정의 + 여사제 |
| 1~9 | 단일 카드 | | |

✦ 트리오 카드

---

## 📄 라이선스

이 프로젝트는 **Apache License 2.0** 하에 배포됩니다. 자세한 내용은 [LICENSE](./LICENSE) 파일을 참고하세요.

카드 이미지: [Wikimedia Commons](https://commons.wikimedia.org/) — Public Domain (1909년판 라이더-웨이트 덱)
