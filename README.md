# Tutor Management

Tutor Management 是一個補習班務管理專案，採用 React + Vite 前端與 Express + PostgreSQL 後端，提供課程建立、座位安排、提醒事項與繳費管理等功能。

## 功能特色

- 課程管理：新增、查看、刪除課程時段。
- 班級座位：依課程查看座位表，並為座位指派學生。
- 提醒事項：針對課程建立提醒，支援查詢與刪除。
- 繳費管理：根據學生與課程更新繳費狀態與金額。
- 登入保護：使用 JWT 保護需要登入的頁面與 API。
- 首頁展示：包含品牌首頁與社群連結。

## 技術棧

- Frontend: React 18, Vite, React Router, Tailwind CSS, Axios, Ant Design
- Backend: Express 5, PostgreSQL, `pg`, `dotenv`, `jsonwebtoken`
- Tooling: ESLint, PostCSS, Nodemon

## 專案結構

```text
Tutormanagement/
├─ client/                  # React/Vite 前端
│  ├─ src/
│  │  ├─ component/         # 可重用元件
│  │  ├─ pages/             # 頁面元件
│  │  ├─ style/             # 全域樣式
│  │  └─ api/               # API 請求相關程式
├─ server/                  # Express 後端
│  ├─ routes/               # API 路由
│  ├─ db.js                 # PostgreSQL 連線設定
│  └─ server.js             # API 入口
├─ AGENTS.md
└─ README.md
```

## 主要頁面

- `/`：首頁
- `/login`：登入頁
- `/course`：課程管理
- `/class`：班級列表
- `/class/seat/:scheduleId`：單一課程的座位、提醒與繳費管理
- `/success`：受保護頁面

## API 概覽

### 認證

- `POST /login`：登入並取得 JWT
- `GET /success`：簡單測試 API

### 課程

- `POST /course`：新增課程
- `GET /showcourse`：取得目前使用者的課程列表
- `DELETE /deletecourse/:scheduleId`：刪除課程

### 班級與座位

- `GET /class`：取得使用者的班級列表
- `GET /seat/:scheduleId`：取得指定課程的座位資料
- `PATCH /seat`：更新指定座位學生

### 提醒事項

- `POST /reminder`：新增提醒
- `GET /reminder`：取得提醒，可用 `scheduleId` 篩選
- `DELETE /reminder/:id`：刪除提醒

### 繳費

- `GET /payment/:scheduleId`：取得指定課程的繳費資料
- `PATCH /payment`：更新繳費狀態與金額

## 環境需求

- Node.js 18+
- npm 9+
- PostgreSQL 13+

## 安裝方式

先安裝根目錄依賴，再分別安裝前後端依賴：

```bash
npm install
cd client && npm install
cd ../server && npm install
```

## 環境變數

在 `server/.env` 建立設定。專案目前會使用下列變數：

```env
SECRET_KEY=your_jwt_secret

# 二選一
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB_NAME

# 或使用分開設定
db_user=postgres
db_password=your_password
db_host=localhost
db_port=5432
db_database=tutormanagement

# 如需 SSL 可開啟
DB_SSL=false
# 或
PGSSLMODE=disable
```

說明：

- 若提供 `DATABASE_URL`，後端會優先使用它。
- 若未提供 `DATABASE_URL`，則改用 `db_user`、`db_password`、`db_host`、`db_port`、`db_database`。
- 當連到 Supabase 或其他需要 SSL 的 PostgreSQL 服務時，可設 `DB_SSL=true` 或調整 `PGSSLMODE`。

## 本機開發

### 1. 啟動前端

```bash
cd client
npm run dev
```

預設會啟動 Vite 開發伺服器。

### 2. 啟動後端

```bash
cd server
npm run dev
```

後端預設使用 `nodemon` 啟動，監聽 `http://localhost:3000`。

## 建置與檢查

前端：

```bash
cd client
npm run lint
npm run build
npm run preview
```

後端：

```bash
cd server
npm test
```

注意：目前後端 `npm test` 仍是 placeholder，執行後會回傳錯誤訊息，尚未建立正式自動化測試。

## 開發注意事項

- 前端多數受保護操作會從 `localStorage` 讀取 `token`。
- 後端多數資料操作 API 需要在 `Authorization` header 帶入 `Bearer <token>`。
- `server/db.js` 已支援一般 PostgreSQL 連線字串與分離式環境變數設定。
- 現有程式以手動驗證為主，修改後建議至少執行前端 `lint` 與 `build`，並手動測試登入、課程、座位與提醒流程。

## 後續可補強方向

- 補齊自動化測試
- 統一前端 API base URL 設定
- 補上資料表 schema 與 migration
- 強化登入與密碼安全性
- 補齊部署與正式環境設定文件

