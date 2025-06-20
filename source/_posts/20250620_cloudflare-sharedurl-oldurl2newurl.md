---
title: Cloudflare Worker 主域名共用新舊站，透過舊網址名單，有條件的導向到新域名
categories:
  - 架站相關
tags:
  - Cloudflare
  - CDN
  - Cloudflare Worker
toc: true
date: 2025-06-20 13:00:36
cover:
---


## 新舊站的網址規劃
主要部落格主網址就是用 blog.yuaner.tw

但是會有新舊站的問題，所以有特別加開域名來對應新舊站：
* blog-legacy.yuaner.tw 舊站用
* blog-stage.yuaner.tw 新站測試用，最後會併到不帶有stage字的主網址

然後目標： 讓這一個 blog.yuaner.tw 網址同時相容於新舊站！！
利用網址後面字串名單的方式，若使用者要瀏覽的該網址是在舊站網址名單內，就轉跳到舊站用網址，其餘都適用於新站！

## 新舊站的網址第一階段整理
我的主要目的就是為了處理舊部落格搬遷，目前已經初步以下面的方式先弄一個階段了：
1. 把目前所有的舊站都先從 blog.yuaner.tw → 調DNS對應到 blog-legacy.yuaner.tw
2. 設定原有的 blog.yuaner.tw 全部都先做301跳轉到 blog-legacy.yuaner.tw
3. 開設 blog-stage.yuaner.tw 暫時存放新部落格

然後就開始處理舊部落格那邊，包含舊部落格處理靜態化拔掉後端...同時新部落格也同步開始整理。
之後我的新部落格整理到一個段落後，就會把新部落格掛到 blog.yuaner.tw 主域名正式取代！

但我發現舊部落格有些文章連結，已經被網友分享到討論區了。
所以我的目標就是部落格系統搬遷之後，主網址正式以新部落格取代，同時還要讓舊的主網址連結還要**繼續生效**！！

## Wordpress與hexo預設的網址結構
初步檢查匯出的網址名單之後，發現wordpress預設用的網址結構和hexo預設目前已有的結構，好像運氣不錯，有巧妙的避開了。

Wordpress | hexo
--------- | -------------------
/category | /categories
/tag      | /tags
/2011/09/ | /archives/2025/06/
/feed     | /atom.xml

只有會衝突的部分，而且還是我為了刻意讓Github Pages運作刻意設定導致出現的：
* /
* /404.html

所以理論上把名單全匯入以後，替除掉衝突的這兩個，就可以讓新舊網站都共用 blog.yuaner.tw 網址，遇到舊網址就可以無縫301跳轉到 blog-legacy.yuaner.tw 了。

## 主網址共用新舊系統的方案
* 方案一：在新主機（Web server 層）做 rewrite 判斷
    * 但是我這次的部落格新系統也是沒有後端的靜態型放在Github Pages上，沒有Web server層可以處理。
* 方案二：Cloudflare Page Rules 或 Redirect Rules 設定 redirect
    * Cloudflare 支援簡單 redirect，但是免費帳號最多只能設定 20 條 Page Rules。
    * 即使用新的 Redirect Rules，也不適合大量網址條件，除非用 Workers。
* 方案三：使用 Cloudflare Workers 判斷轉向 （最終採用方案）

## Step1: 收集所有舊站的所有頁面網址名單
我的目標是：若該網址是在舊站網址名單內，就轉跳到舊站用網址，其餘都適用於新站！

### Step1.1: 爬取所有的舊網址所有頁面名單成CSV檔
拜我之前處理Wordpress網站靜態化時，[利用Wordpress Plugin - Staatic匯出打包成所有靜態網頁資料夾](https://blog-legacy.yuaner.tw/other/wordpress-to-static/)，在匯出的時候就已經在後台頁面出現名單表格了，所以我打算直接採用這個名單。

然後再使用 [Chrome擴充套件 - easyscraper](https://easyscraper.com/) ，把後台界面顯示出來的URL表整理成CSV, JSON檔案，還會幫你點擊下一頁、下一頁的幫你把全部內容都爬完。
![](Screenshot_20250620_115836.png)

### Step1.2: CSV 轉成 單一欄位的JSON Array

我用easyscraper匯出成csv檔之後，我的csv檔結構大致是這樣：
![](Screenshot_20250620_114517.png)

#### Step1.2.1: 先安裝需要用到的工具程式
```bash
sudo pacman -S csvkit jq
```

#### Step1.2.2: 主要就是把 `url` 欄位萃取出來，做成JSON Array陣列
```bash
csvcut -c url yuaner-blog-legacy-2025-06-20.csv | tail -n +2 | sort -u | jq -R . | jq -s . > yuaner-blog-legacy-2025-06-20.json
```

會輸出
![](Screenshot_20250620_114721.png)

手動把兩個會和現有新部落格用的網址後串衝突的刪掉：
* "/",
* "/404.html",

## Step2: 調整 Cloudflare Workers 自動導向跳轉
### Step2.1: 建立新的 Worker

在 `計算 （Workers)` → `Workers 和 Pages` 那邊
（或是直接網址輸入：https\://dash.cloudflare.com/&lt;帳戶識別碼&gt;/workers-and-pages）

![進入Cloudflare Worker頁面](Screenshot%202025-06-20%20at%2012-15-14%20%E8%A8%88%E7%AE%97%20%28Workers%29%20chyuaner%20Cloudflare.png)

選擇 `從 Hello World 開始!`
![選擇 從 Hello World 開始](Screenshot%202025-06-20%20at%2012-18-16%20%E8%A8%88%E7%AE%97%20(Workers)%20chyuaner%20Cloudflare.png)

### Step2.2: 貼上這段Script
```javascript
// 舊站所有頁面的網址後串名單
// 這邊把剛剛欄位萃取出來做成JSON Array陣列的檔案內容全部複製貼到這裡
const rawPaths = [
  "/2008/07/",
  "/2009/01/",
  "/2012/11/firefox%E5%B0%87%E5%88%86%E9%A0%81%E5%88%97%E7%A7%BB%E5%88%B0%E7%B6%B2%E5%9D%80%E4%B8%8B%E6%96%B9/",
  // ... 以下略
];

const legacyDomain = "https://blog-legacy.yuaner.tw"; // 要導向到舊站的域名
const mainCName = "https://blog.yuaner.tw"; // ⚠ 改成你實際的 GitHub Pages 網址

// 回傳 path 的兩種可能：含斜線、不含斜線
const normalizedPathVariants = (path) => {
  const variants = new Set();
  variants.add(path);
  if (path.endsWith("/")) {
    variants.add(path.slice(0, -1));
  } else {
    variants.add(path + "/");
  }
  return variants;
};

const legacyPaths = new Set(rawPaths);
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    for (const variant of normalizedPathVariants(path)) {
      if (legacyPaths.has(variant)) {
        return Response.redirect(`${legacyDomain}${variant}${url.search}`, 301);
      }
    }

    // 其餘交給 GitHub Pages
    const proxyUrl = `${mainCName}${path}${url.search}`;
    return fetch(proxyUrl, request);
  }
}
```

### Step2.3: 然後將這個Worker掛到HTTP 路由上
在 Dashboard `Worker 路由` 那邊
（或是直接網址輸入：https\://dash.cloudflare.com/&lt;帳戶識別碼&gt;/&lt;你的域名&gt;/workers） 

新增一個路由
![新增一個路由](Screenshot%202025-06-20%20at%2012-25-30%20Workers%20%E8%B7%AF%E7%94%B1%20yuaner.tw%20chyuaner%20Cloudflare.png)

然後把剛剛建立的Worker掛上來
![把剛剛建立的Worker掛上來](Screenshot%202025-06-20%20at%2012-25-39%20Workers%20%E8%B7%AF%E7%94%B1%20yuaner.tw%20chyuaner%20Cloudflare.png)

## Step3: 看看成果吧
整個弄好之後，就可以測試看看舊網址有沒有成功301導轉到舊站新網址去。

我這邊用了以下幾個網址來綜合測試：
* <http://blog.yuaner.tw/2012/11/firefox%E5%B0%87%E5%88%86%E9%A0%81%E5%88%97%E7%A7%BB%E5%88%B0%E7%B6%B2%E5%9D%80%E4%B8%8B%E6%96%B9/> （被分享到mobile01論壇的）
* <https://blog.yuaner.tw/life/taobao-refund/> （被分享到FB淘寶人社團的）
* <https://blog.yuaner.tw/2011/09/> （舊站彙整頁面）
* <https://blog.yuaner.tw/archives/2025/06> （新站彙整頁面）
* <https://blog.yuaner.tw/tag/linux/> （舊站Tag頁面）
* <https://blog.yuaner.tw/tags/linux/> （新站Tag頁面）

這樣就可以兼顧新系統用主網址，同時又繼續讓舊系統舊網址完美相容了！！