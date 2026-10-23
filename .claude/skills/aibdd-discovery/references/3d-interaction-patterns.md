# 3D 互動的 Gherkin 詞彙與模式

當 `tech_flavor: threejs` 時，Behavior Design（Step 5）產出 Feature Files 需使用此詞彙。

## 標準動詞

### 使用者操作（When）

| 操作類型 | Gherkin 句型 |
|---------|-------------|
| 點擊 3D 物件 | `When 使用者 點擊 3D 場景中的 "<物件名>" 模型` |
| 滑鼠拖拉旋轉 | `When 使用者 旋轉相機到 "<視角>" 視角` |
| 滾輪縮放 | `When 使用者 縮放至 "<近/遠>" 距離` |
| 懸停 3D 物件 | `When 使用者 懸停在 "<物件名>" 上` |
| 雙指縮放（手機） | `When 使用者 以雙指縮放場景` |
| 選取物件 | `When 使用者 選取 "<物件名>"` |
| 切換視角 | `When 使用者 切換到 "<視角名稱>" 視角` |

### 系統回饋（Then）

| 回饋類型 | Gherkin 句型 |
|---------|-------------|
| 顯示標記點 | `Then 3D 場景應顯示 "<區域>" 的標記點` |
| 播放動畫 | `Then 場景應播放 "<動畫名稱>" 動畫` |
| 切換材質 | `Then 3D 模型應切換為 "<材質名稱>" 材質` |
| 顯示資訊 | `Then 應顯示 "<物件名>" 的資訊面板` |
| 相機移動 | `Then 相機應飛行到 "<物件名>" 的正面視角` |
| 高亮物件 | `Then "<物件名>" 應以高亮材質顯示` |
| 顯示載入狀態 | `Then 3D 場景應顯示載入進度條` |
| 渲染完成 | `Then 3D 場景應完成渲染（無載入動畫）` |
| WebGL fallback | `Then 頁面應顯示 "<靜態圖片>" 作為 3D 場景替代` |

## Feature File 模式

### 3D 場景載入

```gherkin
@ignore @query
Feature: 3D 場景初始化

  Rule: 後置（回應）- 場景應在首次進入時完成載入

    Example: 頁面載入後 3D 場景渲染完成
      Given 使用者訪問首頁
      When 頁面完成載入
      Then 3D 場景應完成渲染（無載入動畫）
      And 場景應顯示 "地球" 模型

  Rule: 後置（狀態）- WebGL 不支援時應顯示 fallback

    Example: 瀏覽器不支援 WebGL 時顯示靜態圖片
      Given 使用者的瀏覽器不支援 WebGL
      When 使用者訪問首頁
      Then 頁面應顯示 "earth-fallback.jpg" 作為 3D 場景替代
```

### 物件互動

```gherkin
@ignore @command
Feature: 行星選取

  Rule: 後置（狀態）- 點擊行星後應顯示其資訊面板

    Example: 點擊地球模型後資訊面板顯示
      Given 3D 場景已完成渲染
      When 使用者 點擊 3D 場景中的 "地球" 模型
      Then 應顯示 "地球" 的資訊面板
      And 資訊面板應包含：
        | 欄位       | 值          |
        | 行星名稱   | 地球        |
        | 直徑       | 12,742 km   |

  Rule: 後置（狀態）- 選取行星後相機應飛向該行星

    Example: 選取火星後相機移動
      Given 3D 場景已完成渲染
      When 使用者 選取 "火星"
      Then 相機應飛行到 "火星" 的正面視角
```

### 相機控制

```gherkin
@ignore @command
Feature: 相機視角控制

  Rule: 前置（狀態）- 旋轉拖拉只在無選取物件時生效

    Example: 拖拉旋轉場景視角
      Given 3D 場景已完成渲染
      And 無物件被選取
      When 使用者 旋轉相機到 "北半球" 視角
      Then 場景應顯示從北極俯視的地球
```

## Portfolio Diorama 互動模式（portfolio_type: isometric_diorama）

當專案為 Isometric Miniature World 個人作品集時，使用以下詞彙與模式。

### 額外動詞

| 操作類型 | Gherkin 句型 |
|---------|-------------|
| 懸停 Portfolio Zone | `When 使用者 懸停在 "<Zone 名稱>" 區域上` |
| 點擊 Portfolio Zone | `When 使用者 點擊 "<Zone 名稱>" 區域` |
| 透過固定導覽跳轉 | `When 使用者 點擊導覽選單中的 "<區域名稱>"` |

| 回饋類型 | Gherkin 句型 |
|---------|-------------|
| Zone 浮起 | `Then "<Zone 名稱>" 區域應微幅浮起並顯示高亮` |
| 攝影機移動 | `Then 攝影機應平滑移動到 "<Zone 名稱>" 區域` |
| 開啟資訊面板 | `Then 應開啟 "<Zone 名稱>" 的資訊面板` |
| Idle 動畫暫停 | `Then 場景的環境動畫應暫停（Reduced Motion 模式）` |

### Feature File 模式（Portfolio 專用）

```gherkin
@ignore @command
Feature: Portfolio Zone 探索

  Rule: 後置（狀態）- 點擊 Zone 後攝影機移動並開啟資訊面板

    Example: 點擊 Projects 區域
      Given 3D 場景已完成渲染
      When 使用者 點擊 "Projects" 區域
      Then 攝影機應平滑移動到 "Projects" 區域
      And 應開啟 "Projects" 的資訊面板

  Rule: 後置（狀態）- 懸停 Zone 時出現浮起高亮

    Example: 懸停 About Me 區域
      Given 3D 場景已完成渲染
      When 使用者 懸停在 "About Me" 區域上
      Then "About Me" 區域應微幅浮起並顯示高亮

@ignore @query
Feature: 固定導覽選單

  Rule: 後置（狀態）- 導覽選單永遠可見，不依賴 3D 操作

    Example: 透過導覽跳轉到 Experience
      Given 使用者位於頁面任意位置
      When 使用者 點擊導覽選單中的 "Experience"
      Then 攝影機應平滑移動到 "Experience" 區域
      And 應開啟 "Experience" 的資訊面板

@ignore @query
Feature: Reduced Motion 支援

  Rule: 後置（狀態）- 偵測到 prefers-reduced-motion 時停用動畫

    Example: Reduced Motion 模式下場景靜止
      Given 使用者系統開啟了 prefers-reduced-motion
      When 使用者訪問作品集頁面
      Then 場景的環境動畫應暫停（Reduced Motion 模式）
      And 3D 場景應完成渲染（無載入動畫）
```

## 測試策略說明

> **重要**：3D Canvas 內容是像素，無法用 CSS selector 定位。
>
> E2E 測試策略建議：
> - **不測**：3D 場景的視覺細節（材質顏色、光影效果）
> - **測**：頁面結構（Canvas 是否存在、Overlay 文字是否正確）
> - **測**：使用者操作後的 2D UI 狀態變化（資訊面板是否出現）
> - **測**：API 呼叫是否發生（MSW 攔截驗證）
>
> 3D 物件的互動驗證應降級為 Unit Test（驗證 raycasting 邏輯、動畫計算），
> 而非 E2E（Playwright 的 `page.mouse.move()` 無法可靠模擬 3D 互動）。
