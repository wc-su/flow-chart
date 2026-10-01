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

## 資料與狀態（遷移中確認的規則，陸續補充）

- 座標：`x`、`y` 一律是 start、end 中比較小的（左上角），`width`、`height` 一律是正數。
  畫圖中、縮放中 start 可能比 end 大；放開滑鼠（`endDraw`）後，flowline 以外會整理成
  start 左上、end 右下，flowline 保留畫的方向（箭頭）
- redux-undo 的 filter 只收 `init`、`deleteShape`、`endDraw`；`draw`、`changeShape`
  是過程中的即時更新、`clear` 放進去會讓清空可以被 undo，都不能放進 filter
