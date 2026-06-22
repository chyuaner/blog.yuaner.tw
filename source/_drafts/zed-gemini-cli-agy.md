---
title: 讓Zed編輯器繼續使用Gemini CLI（以Antigravity CLI的方式）
cover: >-
  Screenshot_20260621_021000.png
categories:
  - ['開發工具']
tags:
  - zed
  - gemini-cli
---

在現在開發工具VS Code當道，甚至Google也拿VS Code改造出自己的IDE編輯器Antigravity。

而會用Zed編輯器的人應該都是不想被VS Code效能問題折騰，因為畢竟VS Code底的，都是前端技術開發，本質上就是一個超肥重瀏覽器在支撐整個程式。要不然大家全都用Antigravity就好了。

而且Zed官方最有自信標榜的就是支援各大AI工具平台，也包含Gemini，但......

## Gemini CLI收掉了😭

不用多說，就是這兩張圖說明一切慘狀～～～

{% asset_img Screenshot_20260621_014756.png "Zed無法使用了" %}

{% asset_img Screenshot_20260621_123225.png "直接使用Gemini CLI就發現已經被強制登出了" %}

因為現有的Gemini CLI都被強制登出了，連帶影響Zed編輯器也不能使用Gemini AI來搭配編修程式碼使用，而且錯誤訊息給了很明確的說法：

```
Failed to sign in. Message: This client is no longer supported for Gemini Code Assist for individuals. To continue using Gemini, please migrate to the Antigravity suite of products: https://antigravity.google.
```

而Google官方的解法就是叫我改用Google自家的IDE Antigravity，但...我就是因為不想用VS Code和所有VS Code底的編輯器啊😭～～～

## 我也不想使用Zed內建的Zed Agent - Google AI，額度消耗太快了

其實在Gemini CLI收掉以後，我也有嘗試使用Zed內建的Zed Agent。
不過Zed Agent - Google AI基本的使用方式就是要去AI Studio那邊取得到API Key以後，填進Zed設定裡面。

不過...我明明有買Google AI Pro，但發現額度消耗異常的快，是快到不正常的程度，然後我才知道...

<div class="xg-grid">
<div class="xg-col-8 xg-col-sm-12">

Zed內建Google AI Provider（使用GEMINI_API_KEY）會使用的是：
- Google AI Studio API

不是使用Gemini CLI（Google Account OAuth）會使用的：
- Gemini App
- Google AI Pro
- Gemini Advanced

所以：
- Gemini 網頁版訂閱 ≠ API 額度
- AI Pro 訂閱 ≠ API 額度

</div>
<div class="xg-col-4 xg-col-sm-12">

{% asset_img Screenshot_20260622_055422.png "Zed Agent設定的地方" %}

</div>
</div>

因此 Zed 內建 Provider 無法直接吃我的 AI Pro 訂閱額度。
很多人都是在這裡踩坑，因此會覺得「額度一下就沒了」，因為 Zed 在走 API 計費。

## agy-acp的解法
經過我幾次爬文和密集問不同家AI交叉比對之後，總算找到可行的解法：

既然Gemini CLI收掉，但是Google官方有推出Antigravity CLI，然後有人就做出橋接轉換器，把Antigravity CLI當作ACP接到Zed編輯器。

{% link text url [external] [title] %}

https://www.reddit.com/r/google_antigravity/comments/1u215bd/acp_adapter_for_antigravity_cli/

我自己這邊實測可行，所以以下就紀錄以下步驟：

## 實際建置步驟

### 安裝Antigravity CLI
去[官方網站按照這一頁的教學](https://antigravity.google/download#antigravity-cli)，使用Google的腳本安裝在你的家目錄資料夾內。 

```bash
curl -fsSL https://antigravity.google/cli/install.sh | bash
```

他會將執行檔安裝在 `~/.local/bin/agy` ，然後我先前在Gemini CLI的已登入狀態和設定會直接沿用。

### git clone agy-acp 橋接器
先`cd`到你想放置的資料夾以後，執行以下內容：
```bash
git clone https://github.com/hicder/agy-acp.git
cd agy-acp
```

### Build建置橋接器
```bash
cargo build --release
```

### 安裝到`PATH`環境變數抓得到的
```bash
cp target/release/agy-acp /usr/local/bin/
```

其實我覺得理論上也可以放在家目錄，不過因為這台電腦只有我一個人會用，想說省事就照官方教學走。


### 設定Zed
請在家目錄編輯Zed的設定檔 `~/.config/zed/settings.json` 填入以下內容：
```json _~/.config/zed/settings.json 
"agent_servers": {
  "Antigravity CLI": {
    "type": "custom",
    "command": "agy-acp",
    "args": [],
    "env": {}
  }
}
```

### 🎉完成囉，測試吧～

設定好之後，將Zed編輯器重開，然後按下右上角的「+」圖案，選擇`External Agents`你剛剛建立好的「Antigravity CLI」，順利的話，應該會在Model清單看到熟悉的「Gemini 3.5 Flash」字樣，然後就可以開一個專案來測試囉～Ya~🎊

{% asset_img Screenshot_20260621_021000.png "agy-acp成功接入的畫面截圖" %}

## 可能會遇到的問題
### 對話沒有回應，而且模型列表出現「Unknown」

主要原因是：agy-acp橋接器沒有處理這種狀況，出錯也不會顯示錯誤訊息。
我這邊遇到的真正原因是：帳號被登出，所以我再手動使用 `agy` 指令，然後重新登入以後，再將Zed編輯器重開，就可以正常使用了。
{% asset_img Screenshot_20260622_063251.png "手動進agy重新登入" %}
