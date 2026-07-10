# Repository Guidelines

## 專案結構與模組配置

本專案包含 React/Vite 前端與 Express/PostgreSQL 後端。

- `client/`：前端應用程式、Vite 設定、Tailwind/PostCSS 設定與 ESLint 設定。
- `client/src/pages/`：頁面層級元件，例如 `Home.jsx`、`Class.jsx`、`Seat.jsx`。
- `client/src/component/`：可重用 UI 元件，例如 `Navbar.jsx`、`Sidebar.jsx` 與表單元件。
- `client/src/api/`：前端 API 請求輔助程式。
- `client/src/style/`：全域與應用程式 CSS。
- `server/`：Express API 入口與資料庫連線設定。
- `server/routes/`：依功能領域拆分的路由，例如 `class.js`、`payment.js`、`user.js`。
- `server/.env`：本機資料庫與執行環境設定；請勿提交密碼或金鑰。

## 建置、測試與開發指令

請在對應的 package 目錄執行指令。

```bash
cd client && npm run dev
```
啟動 Vite 前端開發伺服器。

```bash
cd client && npm run build
cd client && npm run preview
```
建置前端正式版，並預覽建置後的輸出。

```bash
cd client && npm run lint
```
對 JavaScript 與 JSX 檔案執行 ESLint。

```bash
cd server && npm run dev
```
使用 `nodemon` 啟動 Express 後端，預設監聽 `3000` port。

## 程式風格與命名慣例

JSX 與 JavaScript 區塊使用兩個空白縮排。React 元件檔案使用 PascalCase，例如 `AddCourse.jsx`、`ProtectedRoute.jsx`；後端路由檔案使用小寫功能名稱，例如 `class.js`、`reminder.js`。前端使用 ES modules 與 JSX；後端目前使用 CommonJS（`require`、`module.exports`）。修改既有檔案時，請沿用周圍的分號風格。路由處理函式應保持簡短，資料庫連線集中透過 `server/db.js` 管理。

## 測試指南

目前尚未建立可用的自動化測試。後端的 `npm test` 仍是 placeholder，執行後會回傳錯誤。在加入測試前，請至少用 `npm run lint`、`npm run build`，並手動檢查受影響的 API 路由或 UI 頁面。新增測試時，建議放在接近被測程式碼的位置，並使用 `*.test.js` 或 `*.test.jsx` 命名。

## Commit 與 Pull Request 規範

近期提交多採用 Conventional Commits 風格，例如 `feat: 新增繳費狀態功能` 或 `fix: 修正登入導向`。標題請簡短、明確，優先描述實際變更。Pull Request 應說明使用者可見的變更、列出驗證步驟、連結相關 issue；若修改前端畫面，請附上截圖。

## 安全性與設定提醒

請勿將 `.env`、`node_modules` 或建置輸出提交到版本控制。資料庫設定可使用 `DATABASE_URL`，或使用 `server/db.js` 讀取的 `db_*` 變數。連接需要 SSL 的託管 PostgreSQL 服務時，請設定 `DB_SSL=true` 或 `PGSSLMODE`。


## 教學互動準則
當使用者是在詢問程式碼邏輯、架構、除錯方向或概念問題時，先用引導式提問幫助使用者思考，不要直接給完整答案。
除非使用者明確要求直接解答、直接給程式碼，或已經表示想看標準答案，才直接提供完整答案。

回答這類問題時，優先：
- 先確認使用者目前理解到哪裡
- 提供 1 到 3 個引導問題
- 先給提示，不要立即揭曉完整結論
- 若使用者卡住，再逐步增加提示

避免在使用者只問「這是什麼」或「為什麼這樣寫」時，直接把完整結論一次講完。
優先採用蘇格拉底式引導，讓使用者先自行推論。