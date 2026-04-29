# 프로젝트 구조 설명

## client/와 server/가 나뉜 이유 — 식당 비유

식당은 크게 두 공간으로 나뉩니다. 손님이 앉아서 메뉴를 고르고 음식을 받는 **홀**과, 음식을 실제로 만드는 **주방**입니다.

**`client/`는 홀입니다.**
손님(사용자)이 직접 보고 클릭하는 공간입니다. 메뉴판(화면)을 예쁘게 꾸미고, 손님의 주문(클릭, 입력)을 받는 일을 합니다. 주방 안에서 무슨 일이 일어나는지는 알 필요가 없습니다.

**`server/`는 주방입니다.**
손님 눈에는 보이지 않지만, 실제로 데이터를 요리(처리)하고 DB(냉장고)에서 재료를 꺼내 홀로 전달합니다. 홀의 인테리어가 어떻든 주방 운영 방식은 바뀌지 않습니다.

**둘 사이의 통로가 API입니다.**
홀 직원이 "주문서"를 주방에 넘기듯, 클라이언트는 `/api/...` 요청으로 서버에 데이터를 주고받습니다. 홀과 주방이 분리되어 있어서, 홀 인테리어를 바꿔도(React 화면 수정) 주방은 그대로고, 주방 레시피를 바꿔도(서버 로직 수정) 홀은 영향받지 않습니다.

---

## `package.json`이란?

프로젝트 안에 `package.json`이라는 파일이 여러 개 보일 겁니다. 처음엔 낯설 수 있는데, 아주 간단한 개념입니다.

**`package.json`은 프로젝트의 "안내문" 같은 파일입니다.**

새 아르바이트생이 식당에 왔을 때 건네주는 안내문을 상상해보세요. 거기엔 이런 내용이 적혀 있습니다.

- 이 가게 이름은 뭔지 (`"name"`)
- 어떤 도구를 사용하는지 — 예를 들어 "에스프레소 머신, 업소용 냉장고" (`"dependencies"`: 이 프로젝트가 필요로 하는 외부 패키지 목록)
- 가게를 열 때, 닫을 때 어떻게 하는지 — "오픈은 이렇게, 마감은 이렇게" (`"scripts"`: 자주 쓰는 명령어 단축키)

`npm install`을 실행하면 이 안내문을 보고 필요한 도구들을 자동으로 가져다 설치해줍니다. 직접 하나하나 찾아 설치할 필요가 없습니다.

이 프로젝트에는 `package.json`이 세 개 있습니다.

| 위치 | 역할 |
|------|------|
| `askme/package.json` | 전체 프로젝트를 총괄하는 안내문 |
| `packages/client/package.json` | 화면(홀) 담당 파트의 안내문 |
| `packages/server/package.json` | 서버(주방) 담당 파트의 안내문 |

각 파트가 필요한 도구와 실행 방법이 다르기 때문에 안내문도 따로 관리합니다.

---

## 전체 구조

```
askme/
├── package.json
├── .gitignore
├── packages/
│   ├── client/
│   │   ├── package.json
│   │   ├── vite.config.js
│   │   ├── index.html
│   │   └── src/
│   │       ├── main.jsx
│   │       └── App.jsx
│   └── server/
│       ├── package.json
│       ├── data/
│       │   └── askme.db
│       └── src/
│           ├── index.js
│           └── db.js
```

---

## 루트 (`askme/`)

### `package.json`
전체 모노레포를 관리하는 설정 파일.
- `"workspaces": ["packages/*"]` — npm이 `packages/` 안의 폴더들을 하나의 프로젝트로 묶어서 관리. `node_modules`가 루트에 하나만 생성됨.
- `"scripts"` — `npm run dev` 한 번으로 클라이언트와 서버를 동시에 실행 (`concurrently` 패키지 사용).

### `.gitignore`
Git에 올리지 않을 파일 목록.
- `node_modules/` — 의존성 패키지
- `dist/` — 빌드 결과물
- `*.db` — SQLite DB 파일
- `.env`, `.env.local` — 환경변수 파일

---

## 클라이언트 (`packages/client/`)

화면에 보이는 React 앱.

### `package.json`
클라이언트 전용 의존성과 스크립트 정의. 패키지 이름 `@askme/client`로 워크스페이스 내에서 식별됨.

### `vite.config.js`
React 앱의 개발 서버 설정. 핵심은 **프록시** 설정.

```js
proxy: { '/api': { target: 'http://localhost:4000' } }
```

브라우저에서 `/api/...`로 요청하면 자동으로 Express 서버(4000번 포트)로 전달. CORS 문제 없이 개발 가능.

### `index.html`
브라우저가 처음 받는 HTML 파일. `<div id="root">`가 React 앱이 붙는 자리.

### `src/main.jsx`
React의 진입점. `App` 컴포넌트를 `#root`에 마운트.

### `src/App.jsx`
실제 화면을 그리는 컴포넌트. 현재는 `/api/health`로 서버 연결 상태를 확인하는 예시가 포함됨.

---

## 서버 (`packages/server/`)

API와 DB를 담당하는 Express 앱.

### `package.json`
서버 전용 의존성(`express`)과 스크립트 정의. `node --watch`를 사용해 파일 변경 시 서버 자동 재시작 (nodemon 불필요).

### `src/db.js`
SQLite 데이터베이스 연결과 테이블 초기화 담당.
- Node.js 24 내장 `node:sqlite` 모듈 사용 (별도 설치 불필요).
- 앱 시작 시 `questions`, `answers` 테이블이 없으면 자동 생성.
- DB 파일은 `data/askme.db`에 저장.

### `src/index.js`
HTTP 요청을 받아서 처리하는 API 서버.

| 메서드 | 경로 | 설명 |
|-------|------|------|
| `GET` | `/api/health` | 서버 상태 확인 |
| `GET` | `/api/questions` | 질문 목록 조회 |
| `POST` | `/api/questions` | 질문 생성 |
| `GET` | `/api/questions/:id/answers` | 특정 질문의 답변 목록 조회 |
| `POST` | `/api/questions/:id/answers` | 답변 생성 |

### `data/askme.db`
실제 데이터가 저장되는 SQLite DB 파일. `.gitignore`에 등록되어 Git에는 포함되지 않음.

---

## 데이터 흐름

```
브라우저
  ↕ (포트 3000)
packages/client  ←── React 앱, 화면 담당
  ↕ (/api/* 프록시)
packages/server  ←── Express, API 담당
  ↕
data/askme.db    ←── SQLite, 데이터 저장
```

---

## 실행 방법

```bash
# askme/ 디렉토리에서
npm run dev        # 클라이언트 + 서버 동시 실행
npm run build      # React 프로덕션 빌드
npm run start      # 서버만 실행
```
