# intro-v3.html 코드 설명 (초보자용)

---

## 전체 구조 한눈에 보기

```
intro-v3.html
├── <head>       → 설정 + CSS 스타일 전체
├── <body>
│   ├── .bg-layer    → 배경 빛 효과 (3개 빛 덩어리)
│   ├── .wrapper     → 카드 3개를 세로로 담는 컨테이너
│   │   ├── 프로필 카드
│   │   ├── 기술 스택 카드
│   │   └── 프로젝트 카드
│   └── <script>     → 스크롤 애니메이션 동작
```

---

## CSS 상세 설명

### 1. CSS 변수 — 색깔을 한 곳에서 관리 (10~17행)

```css
:root {
  --bg: #1a1a2e;
  --text: #e0e0e0;
  --accent: #818cf8;
}
```

`:root`는 "페이지 전체"를 의미합니다. `--변수명` 형식으로 색깔을 저장해두면 나중에 `var(--bg)` 처럼 꺼내 쓸 수 있습니다. 색을 바꾸고 싶을 때 이 한 곳만 수정하면 페이지 전체에 반영됩니다.

---

### 2. 리셋 — 브라우저 기본값 초기화 (8행)

```css
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
```

- `*` : 모든 요소에 적용
- `margin: 0; padding: 0` : 브라우저마다 다른 기본 여백을 0으로 통일
- `box-sizing: border-box` : `width: 200px`으로 설정하면 테두리·패딩 포함해서 딱 200px이 됩니다. (기본값은 내용물만 200px이라 테두리가 추가되면 더 커짐)

---

### 3. 배경 Orb 애니메이션 — 흐릿한 빛이 천천히 움직이는 효과 (30~76행)

**구조부터 이해하기:**

```html
<div class="bg-layer">   ← 화면 전체를 덮는 고정 레이어
  <div class="orb orb-1"></div>  ← 파란 빛 덩어리
  <div class="orb orb-2"></div>  ← 보라 빛 덩어리
  <div class="orb orb-3"></div>  ← 하늘 빛 덩어리
</div>
```

```css
/* bg-layer: 화면에 고정(fixed)되어 스크롤해도 안 움직임 */
.bg-layer {
  position: fixed;      /* 스크롤해도 제자리 */
  inset: 0;             /* top:0 right:0 bottom:0 left:0 의 축약 */
  z-index: 0;           /* 카드보다 뒤에 위치 */
  pointer-events: none; /* 마우스 클릭이 통과됨 (카드 클릭 방해 안 함) */
}
```

```css
.orb {
  position: absolute; /* bg-layer 기준으로 위치 지정 */
  border-radius: 50%; /* 완벽한 원 */
  filter: blur(90px); /* 90px만큼 흐리게 → 빛 번짐 효과 */
  opacity: 0.3;       /* 30% 투명도 → 은은하게 */
}
```

```css
.orb-1 {
  width: 520px; height: 520px;
  background: radial-gradient(circle, #6366f1, transparent 70%);
  /* radial-gradient: 원의 중심에서 퍼져나가는 그라데이션
     중심은 #6366f1(보라색), 70% 지점부터 투명해짐 */
  animation: drift1 14s ease-in-out infinite;
  /* drift1 애니메이션을 14초 간격, 부드럽게, 무한 반복 */
}
```

```css
@keyframes drift1 {
  0%, 100% { transform: translate(0, 0); }      /* 시작/끝: 제자리 */
  50%       { transform: translate(40px, 30px); } /* 중간: 오른쪽 40px, 아래 30px 이동 */
}
/* 0% → 50% → 100% 순서로 실행되므로: 제자리 → 이동 → 다시 제자리 반복 */
```

> **핵심 원리:** 원 3개가 서로 다른 속도(14s, 18s, 16s)로 움직여서 겹치는 부분이 계속 달라져 배경이 살아있는 것처럼 보입니다.

---

### 4. Flexbox / Grid — 요소 배치의 핵심

**Flexbox** (한 방향 배치):

```css
.wrapper {
  display: flex;
  flex-direction: column; /* 카드를 세로로 쌓기 */
  gap: 26px;              /* 카드 사이 26px 간격 */
}

.profile-layout {
  display: flex;
  align-items: center; /* 세로 중앙 정렬 */
  gap: 36px;           /* 아바타와 텍스트 사이 36px */
}
```

**Grid** (격자 배치):

```css
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  /* auto-fill: 공간이 허락하는 만큼 열을 자동으로 만들기
     minmax(170px, 1fr): 각 열은 최소 170px, 최대 동등 비율 */
  gap: 14px;
}

.projects-grid {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 정확히 2열, 각각 동등한 너비 */
  gap: 18px;
}
```

---

### 5. 카드 hover 애니메이션 — 마우스를 올리면 떠오르는 효과 (91~117행)

```css
.card {
  /* 초기 상태 (숨겨진 상태 - JS가 나중에 보여줌) */
  opacity: 0;                  /* 완전 투명 */
  transform: translateY(36px); /* 36px 아래로 내려가 있음 */

  /* hover 시 변화에 걸리는 시간 설정 */
  transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
}

.card.revealed {
  /* JS가 이 클래스를 추가하면 보임 */
  opacity: 1;
  transform: translateY(0); /* 제자리로 올라옴 */
}

.card:hover {
  transform: translateY(-10px); /* 10px 위로 떠오름 */
  border-color: rgba(129, 140, 248, 0.4); /* 테두리가 보라색으로 */
  box-shadow:
    0 24px 64px rgba(99, 102, 241, 0.22),       /* 아래쪽 그림자 (x y 번짐 색) */
    0 0 0 1px rgba(192, 132, 252, 0.15) inset;  /* 안쪽 1px 테두리 발광 */
}
```

> `transition`이 없으면 변화가 즉시(딱!) 일어납니다. `transition: 0.35s ease`를 쓰면 0.35초에 걸쳐 부드럽게(ease = 처음엔 빠르게, 끝엔 천천히) 변합니다.

---

### 6. 아바타 회전 링 — 가장 복잡한 트릭 (156~171행)

```css
.avatar-ring {
  position: absolute;
  inset: -5px; /* 아바타보다 5px씩 더 크게 */
  border-radius: 50%;
  background: conic-gradient(#6366f1, #c084fc, #38bdf8, #6366f1);
  /* conic-gradient: 원의 중심을 기준으로 시계방향으로 색이 돌아가는 그라데이션 */
  animation: ringRotate 3.5s linear infinite; /* 3.5초마다 한 바퀴 */
}

.avatar-ring::after {
  content: '';         /* 내용 없는 가짜 요소 생성 */
  position: absolute;
  inset: 3px;          /* 링보다 3px씩 작게 */
  border-radius: 50%;
  background: var(--bg); /* 배경색으로 칠해서 링처럼 보이게 */
}

@keyframes ringRotate {
  to { transform: rotate(360deg); } /* 0deg → 360deg (한 바퀴 회전) */
}
```

**원리 도식:**
```
[avatar-ring: 큰 컬러 원]
  [::after: 배경색 원으로 가운데를 덮음]
    → 결과: 컬러 링만 보임
```

---

### 7. 그라데이션 텍스트 — 이름에 색이 입혀지는 효과 (196~205행)

```css
.profile-info h1 {
  background: linear-gradient(135deg, #e0e7ff 0%, #c4b5fd 50%, #93c5fd 100%);
  /* 135도 방향으로: 흰색→보라→하늘 그라데이션 */

  -webkit-background-clip: text; /* 배경을 텍스트 모양으로 자르기 */
  -webkit-text-fill-color: transparent; /* 텍스트 자체는 투명하게 */
  background-clip: text; /* 표준 버전 */
}
```

> **원리:** 텍스트를 투명하게 만들고, 뒤에 있는 그라데이션 배경이 텍스트 모양으로만 보이게 자릅니다.

---

### 8. 기술 뱃지 브랜드 컬러 — rgba() 이해하기 (292~295행)

```css
.chip-html { background: rgba(228, 77, 38, 0.12); color: #fb923c; }
/*                         R    G   B  투명도
   rgba(228,77,38) = HTML 로고의 주황-빨간색
   0.12 = 12% 불투명 (매우 연하게) → 배경에 은은하게 깔림
   color는 진하게 → 텍스트는 잘 보이게 */
```

각 기술의 공식 색상을 기반으로 합니다:

| 기술 | 색상 코드 | 설명 |
|------|-----------|------|
| HTML | `#e44d26` | 주황빨강 |
| CSS | `#2965f1` | 파랑 |
| JavaScript | `#f7df1e` | 노랑 |
| Python | `#3776ab` | 하늘 |

---

### 9. ::before 가짜 요소 — 프로젝트 카드 컬러 배너 (332~339행)

```css
.proj-header {
  position: relative; /* ::before의 기준점이 됨 */
  overflow: hidden;   /* 삐져나온 부분 자르기 */
}

.proj-header::before {
  content: '';        /* 빈 가짜 요소 생성 (없으면 화면에 안 나옴) */
  position: absolute;
  inset: 0;           /* 부모 크기와 동일하게 꽉 채움 */
}

.ph-purple::before {
  background: linear-gradient(135deg, #6366f1, #c084fc); /* 보라 그라데이션 */
  opacity: 0.85;
}
```

> `::before`와 `::after`는 HTML을 건드리지 않고 CSS만으로 만드는 가짜 요소입니다. 주로 장식용으로 씁니다.

---

### 10. 반응형 디자인 — 화면 크기에 따라 레이아웃 변경 (406~413행)

```css
@media (max-width: 640px) {
  /* 화면 너비가 640px 이하일 때 (모바일) 아래 규칙 적용 */
  .profile-layout {
    flex-direction: column; /* 가로 배치 → 세로 배치로 변경 */
    text-align: center;
  }
  .projects-grid {
    grid-template-columns: 1fr; /* 2열 → 1열로 변경 */
  }
}
```

> PC는 2열 그리드, 모바일은 1열로 자동 전환됩니다.

---

## JavaScript 간단 설명 (505~531행)

```javascript
// IntersectionObserver: "이 요소가 화면에 보이기 시작했나?" 를 감지하는 API
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {  // 화면에 들어왔다면
      setTimeout(() => {
        entry.target.classList.add('revealed'); // 'revealed' 클래스 추가
        // → CSS에서 opacity:0이 opacity:1로, translateY(36px)가 0으로 변함
      }, i * 100); // i번째 카드는 i×100ms 뒤에 등장 (순차 등장 효과)
    }
  });
}, { threshold: 0.12 }); // 요소가 12% 이상 화면에 보일 때 감지
```

---

## 핵심 CSS 개념 요약

| 개념 | 용도 | 예시 위치 |
|------|------|-----------|
| `position: fixed` | 스크롤해도 화면에 고정 | 배경 Orb |
| `position: absolute` | 부모 기준으로 위치 지정 | 아바타 링 |
| `@keyframes` | 애니메이션 동작 정의 | float, rotate |
| `transition` | 상태 변화를 부드럽게 | hover 효과 |
| `backdrop-filter: blur` | 뒤 배경을 흐리게 (유리 효과) | 카드 |
| `::before / ::after` | CSS만으로 만드는 가짜 요소 | 컬러 배너 |
| `rgba()` | 투명도 포함한 색상 | 은은한 배경색 |
| `@media` | 화면 크기별 다른 스타일 | 모바일 대응 |

---

## 추가 설명 1 — 호버 애니메이션 한 줄씩 분석

### 대상 코드 (91~117행)

```css
/* ① 카드의 기본 상태 */
.card {
  opacity: 0;
  transform: translateY(36px);
  transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
}

/* ② JS가 클래스를 추가하면 나타남 */
.card.revealed {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.65s ease, transform 0.65s ease,
              box-shadow 0.35s ease, border-color 0.35s ease;
}

/* ③ 마우스를 올렸을 때 */
.card:hover {
  transform: translateY(-10px);
  border-color: rgba(129, 140, 248, 0.4);
  box-shadow:
    0 24px 64px rgba(99, 102, 241, 0.22),
    0 0 0 1px rgba(192, 132, 252, 0.15) inset;
}
```

---

### ① 기본 상태 — 숨겨진 채로 대기

```css
opacity: 0;
```
카드를 완전히 투명하게 만듭니다. 페이지를 처음 열면 카드가 안 보이는 이유입니다. (JS가 나중에 보이게 바꿔줍니다.)

```css
transform: translateY(36px);
```
카드를 제자리보다 36px 아래로 내려놓습니다. 나중에 위로 올라오는 등장 효과를 주기 위한 준비입니다.
- `transform` : 요소를 실제로 이동/회전/크기 변환하는 속성
- `translateY(36px)` : Y축(세로) 방향으로 36px 이동. 양수 = 아래, 음수 = 위

```css
transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
```
세 가지 속성이 변할 때 0.35초에 걸쳐 부드럽게 변하도록 설정합니다.
- `transition: 속성명 시간 가속도곡선` 형식
- `ease` : 시작할 때 빠르게, 끝날 때 천천히 (자연스러운 느낌)
- 콤마(,)로 여러 속성을 동시에 지정할 수 있습니다

> **주의:** `.card` 에 transition을 쓴 이유는 **hover가 끝날 때** (마우스가 떠날 때)도 부드럽게 돌아오게 하기 위해서입니다.

---

### ② .revealed — JS가 추가하는 클래스

```css
opacity: 1;
```
투명도를 1(완전 불투명)로 바꿉니다. 카드가 나타납니다.

```css
transform: translateY(0);
```
36px 아래에 있던 카드를 제자리(0)로 올립니다. opacity와 함께 바뀌므로 "아래에서 올라오며 나타나는" 효과가 됩니다.

```css
transition: opacity 0.65s ease, transform 0.65s ease,
            box-shadow 0.35s ease, border-color 0.35s ease;
```
등장 애니메이션(opacity, transform)은 0.65초로 여유 있게, hover 효과(box-shadow, border-color)는 0.35초로 빠르게 설정합니다. 두 상황에 맞게 속도를 다르게 준 것입니다.

---

### ③ :hover — 마우스를 올렸을 때

```css
transform: translateY(-10px);
```
카드를 위로 10px 들어 올립니다. 음수값이므로 위 방향입니다.
transition이 있으므로 0.35초에 걸쳐 부드럽게 올라갑니다.

```css
border-color: rgba(129, 140, 248, 0.4);
```
카드 테두리를 보라색(40% 불투명)으로 바꿉니다. 기본 상태의 `rgba(255,255,255,0.08)`에서 바뀌어 카드가 강조됩니다.

```css
box-shadow:
  0 24px 64px rgba(99, 102, 241, 0.22),
  0 0 0 1px rgba(192, 132, 252, 0.15) inset;
```
그림자를 두 겹으로 만듭니다. `box-shadow` 값의 구조는 다음과 같습니다:

```
box-shadow: X이동 Y이동 번짐크기 색상
```

| 값 | 의미 |
|----|------|
| `0 24px 64px rgba(99,102,241,0.22)` | 아래쪽 24px, 64px 퍼짐의 보라 그림자 (카드가 떠있는 느낌) |
| `0 0 0 1px rgba(192,132,252,0.15) inset` | 안쪽(inset) 1px 보라 테두리 (은은한 내부 발광) |

---

### 전체 흐름 정리

```
페이지 로드
  → opacity:0, translateY(36px) 상태로 대기
  → JS가 화면에 보이면 .revealed 추가
  → 0.65초에 걸쳐 위로 올라오며 나타남

마우스 올림 (:hover 활성화)
  → translateY(-10px): 위로 10px 이동 (0.35s)
  → border-color 변경: 보라 테두리 (0.35s)
  → box-shadow 추가: 아래 그림자 + 내부 발광 (0.35s)

마우스 떼기 (:hover 비활성화)
  → 모든 값이 다시 원래대로 부드럽게 복귀
```

---

## 추가 설명 2 — @media 쿼리와 반응형 디자인

### @media 쿼리란?

브라우저 창의 크기에 따라 **다른 CSS를 적용**하는 기능입니다. 같은 HTML 파일 하나로 PC, 태블릿, 모바일에서 모두 적절하게 보이게 만드는 핵심 기술입니다.

```css
@media (조건) {
  /* 조건이 참일 때만 이 안의 CSS가 적용됨 */
}
```

---

### 기본 문법

```css
/* 화면 너비가 640px 이하일 때 */
@media (max-width: 640px) { ... }

/* 화면 너비가 1024px 이상일 때 */
@media (min-width: 1024px) { ... }

/* 641px ~ 1023px 사이일 때 */
@media (min-width: 641px) and (max-width: 1023px) { ... }
```

---

### v3에서 사용된 @media (406~413행) 한 줄씩 분석

```css
@media (max-width: 640px) {
```
화면 너비가 640px 이하일 때 (스마트폰 크기) 이 블록 안의 규칙을 적용합니다. 640px은 일반적인 모바일 기준선입니다.

```css
  .wrapper { padding: 40px 16px 60px; }
```
PC에서는 `padding: 64px 20px 80px`이었는데, 모바일은 화면이 좁으므로 좌우 패딩을 16px로 줄여 콘텐츠 공간을 최대한 확보합니다.

```css
  .card { padding: 24px 20px; }
```
카드 내부 여백도 `36px 40px`에서 `24px 20px`으로 줄입니다. 좁은 화면에서 텍스트가 더 넓게 쓰일 수 있습니다.

```css
  .profile-layout { flex-direction: column; text-align: center; gap: 24px; }
```
PC에서는 아바타와 텍스트가 **가로(row)** 로 나란히 배치됩니다. 모바일에서는 `flex-direction: column`으로 **세로(column)** 로 쌓습니다. `text-align: center`로 텍스트를 가운데 정렬합니다.

```
PC:    [아바타]  [이름 / 소개]
모바일:  [아바타]
         [이름]
         [소개]
```

```css
  .pill-row { justify-content: center; }
```
상태 알림 pill들을 가운데 정렬합니다. 세로 배치가 됐을 때 왼쪽으로 치우치지 않도록 합니다.

```css
  .projects-grid { grid-template-columns: 1fr; }
```
PC에서는 `1fr 1fr` (2열)이었던 프로젝트 카드를 `1fr` (1열)로 바꿉니다. 모바일에서 두 카드가 나란히 있으면 너무 좁아지기 때문입니다.

```
PC:     [프로젝트 1]  [프로젝트 2]
모바일: [프로젝트 1]
        [프로젝트 2]
```

```css
  .profile-info h1 { font-size: 1.65rem; }
```
PC에서 `2.1rem`이었던 이름 글자 크기를 `1.65rem`으로 줄입니다. 좁은 화면에서 글자가 잘리거나 두 줄로 어색하게 넘어가는 것을 방지합니다.

---

### 반응형 적용 전후 비교

| 요소 | PC (640px 초과) | 모바일 (640px 이하) |
|------|----------------|---------------------|
| 프로필 배치 | 가로 (아바타 + 텍스트 나란히) | 세로 (아바타 위, 텍스트 아래) |
| 프로젝트 카드 | 2열 그리드 | 1열 (세로로 쌓임) |
| 이름 글자 크기 | 2.1rem | 1.65rem |
| 카드 여백 | 36px 40px | 24px 20px |
| pill 정렬 | 왼쪽 정렬 | 가운데 정렬 |

---

### CSS 우선순위 이해하기

`@media` 쿼리는 CSS 파일 아래쪽에 작성합니다. CSS는 **나중에 작성된 규칙이 앞의 규칙을 덮어씁니다.**

```css
/* 먼저 작성: 기본(PC) 스타일 */
.projects-grid {
  grid-template-columns: 1fr 1fr; /* 2열 */
}

/* 나중에 작성: 모바일 조건부 스타일 → 조건 맞으면 위 규칙을 덮어씀 */
@media (max-width: 640px) {
  .projects-grid {
    grid-template-columns: 1fr; /* 1열로 덮어씀 */
  }
}
```

> **Mobile First vs Desktop First**
> - **Desktop First** (v3에서 사용): PC 스타일을 기본으로 작성하고, `max-width`로 모바일 예외를 추가
> - **Mobile First**: 모바일 스타일을 기본으로 작성하고, `min-width`로 PC 스타일을 추가
> 어느 쪽이든 결과는 같지만, 모바일 트래픽이 많은 서비스는 Mobile First를 선호합니다.
