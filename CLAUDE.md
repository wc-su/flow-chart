# Flow Chart

## 專案背景

- 2022 年開發的作品集專案
- 目前正在遷移：改用 Vite 打包，並把部分程式改成現代寫法
  （Redux Toolkit、React 19、React Router v7）

## 技術

React 19 · Vite · Redux Toolkit + redux-undo · React Router v7 · Firebase · Vitest

## 常用指令

- `npm run dev` / `npm run build` / `npm run test:run` / `npm run lint`

## 慣例

- AI 協作方式：以說明、建議、code review 為主，程式碼由我撰寫；
  除非明確說「幫我修改」或「幫我新增」，否則不直接改動或新增檔案，一律先詢問
- commit 訊息用中文，格式 `type: 描述`（feat / chore / style …）
- 分支命名 `feat/xxx`
- 程式碼註解、測試名稱的標點：括號固定用半形 `()`；冒號前面是中文用全形 `：`，
  前面不是中文（英文、`)` 等）用半形 `:`；中英文之間加空格

## 測試

- 測試檔放在被測檔案旁邊（`xxx.test.js`）
- 預期值用手算的數字，不在測試裡用程式的公式重算
