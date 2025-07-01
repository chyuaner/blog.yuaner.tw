---
title: 在網站上插入Matomo網站追蹤（AdBlock應對 與 Pjax不換頁載入處理）
cover: >-
  Screenshot%202025-07-01%20at%2017-15-29%20%E5%85%83%E5%85%92%EF%BD%9E%E7%9A%84%E6%96%B0%E9%83%A8%E8%90%BD%E6%A0%BC%20-%202025-06-30%20-%20%E7%B6%B2%E7%AB%99%E5%88%86%E6%9E%90%E5%A0%B1%E8%A1%A8%20-%20Matomo.png
categories:
  - - hexo部落格架設經驗
    - theme
    - Kratos:Rebirth
tags:
  - hexo
  - kratos-rebirth
toc: true
date: 2025-07-01 19:31:44
---


應該很多網站經營者都會希望知道彷刻在你的網站的動向如何，最有名的選擇是Google Analytics以外，也可以選擇自己自架Matomo。

![](Screenshot%202025-07-01%20at%2017-15-29%20%E5%85%83%E5%85%92%EF%BD%9E%E7%9A%84%E6%96%B0%E9%83%A8%E8%90%BD%E6%A0%BC%20-%202025-06-30%20-%20%E7%B6%B2%E7%AB%99%E5%88%86%E6%9E%90%E5%A0%B1%E8%A1%A8%20-%20Matomo.png)

## Step1: 安裝Matomo
我是用官方提供的Docker Compose方式安裝在雲端主機上

https://github.com/matomo-org/docker/tree/master/.examples/nginx


至於安裝的步驟，這邊就不贅述了，相關教學文應該很好查。
不過要特別說的部份是，在用Docker安裝的時候還踩了不少坑...


### 繞了遠路: 不小心裝到非官方 bitnami版本
我一開始是Google搜尋，看到[搜尋排名最前面的Docker Hub就是這個](https://hub.docker.com/r/bitnami/matomo)，然後就誤以為是官方，然後就誤踩到這個版本的坑...

<div class="post-content">
<div class="xg-grid">
<div class="xg-col-6 xg-col-sm-12">

然後這個版本會有自動部屬初始化腳本，造成剛建立時有進入初始化Wizard界面，但我還沒做完，就自己莫名其妙重開後，我被擋在登入畫面進不去了。（實際上是 bitnami 的初始化還在進行中）

然後我又沒有指定env管理者帳密 `MATOMO_USERNAME` `MATOMO_PASSWORD` `MATOMO_EMAIL` ，造成初始化之後以他內定的預設帳密建立後，我自己卻不知道，就被鎖在外面了。

然後雖然是找到原因了，但是這時才發現我誤用到這個非Matomo官方的版本，而且我又很不想直接把帳密寫在docker-compose.yml設定檔裡，所以我還是放棄用這版本了。
</div>

<div class="xg-col-6 xg-col-sm-12">

![](Screenshot%202025-07-01%20at%2018-30-18%20matomo%20docker%20compose%20-%20Google%20%E6%90%9C%E5%B0%8B.png)
</div>
</div>

### 官方版docker compose資料長期存放位置
[官方compose範例](https://github.com/matomo-org/docker/tree/master/.examples/nginx)是把DB資料庫獨立成一個comtainer設計，DB container我本來是設定資料夾映射，讓資料庫資料本體直接存在外層檔案裡。

不過實測發現效能實在太差到幾乎不能用（我的VPS本來就效能不好），所以我最後還是以docker volume的形式存放。

## Step2: 產生網站追蹤碼
基本上沒什麼好說的，就是正常操作在Matomo建立新網站之後，他就會給你追蹤碼，讓你插入到網頁中。
如果日後還要回頭補追蹤碼的話，可以在Matomo後台按下右上的齒輪設定按鈕，然後 `網站` → `追蹤程式碼` 也一樣可以把追蹤用的Code叫出來。

![](Screenshot%202025-07-01%20at%2017-46-01%20%E8%BF%BD%E8%B9%A4%E7%A8%8B%E5%BC%8F%E7%A2%BC%20-%20%E7%AE%A1%E7%90%86%E4%B8%AD%E5%BF%83%20-%20Matomo.png)

產生之後就可以貼到你的網站了！

### 使用者可能會用AdBlock擋掉廣告過濾器擋掉
像我平常就常駐會啟用AdBlock瀏覽網頁（除了有些網站亂插廣告還擋住主內容這種以外，更讓我無法接受的是偷插挖礦程式嚴重拖累我電腦效能），相信也有很高比例的使用者應該也會裝這種東西。但對於經營網站的我來說反而就會變成連同我想追蹤訪客動向的也會一起被擋掉，所以有特別針對這個問題處理。

![](Screenshot_20250620_083702.png)

我遇到被廣告過濾器擋掉的規則有：
* `/piwik.$image,script,domain=~matomo.org|~piwik.org|~piwik.pro|~piwikpro.de`
* `/matomo.js$domain=~github.com`
* `/matomo.php?action_name=`
* `/track.php?`



間單講就是你的追蹤網址，不能有一些關鍵字，像是 `piwik`、`matomo`、`track`等關鍵字，不然很高機率會被AdBlock擋掉。

#### 處理對策：改網址避開這些關鍵字
我的matomo主機是掛在Reverse Proxy底下，所以我直接針對Reverse Proxy設定

* /traak.js → /matomo.js
* /traak.php → /matomo.php

PS. traak？我拼錯字了？ 對，我是故意的，因為track正確的單字反而會被廣告過濾器擋掉

![](Screenshot%202025-06-20%20at%2009-03-23%20Nginx%20Proxy%20Manager.png)


然後把Matomo給你的JS追蹤碼針對 matomo.js matomo.php 這兩個改掉

```html
<!-- Matomo -->
<script>
  var _paq = window._paq = window._paq || [];
  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  (function() {
    var u="//track.yuaner.tw/";
    _paq.push(['setTrackerUrl', u+'traak.php']); //⚠️要改掉的部份
    _paq.push(['setSiteId', '1']);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.async=true; g.src=u+'traak.js'; s.parentNode.insertBefore(g,s); //⚠️要改掉的部份
  })();
</script>
<!-- End Matomo Code -->
```

## Step3: 安裝到你的網站
原則上只要把這段追蹤碼貼到你的網站，就會開始追蹤訪客動向。像是要安插在 `</head>` 或是`</body>` 之前都可以。

### Pjax局部載入技術的換頁處理重點
如果是傳統換頁式網頁，那直接把追蹤碼貼上去就可以直接使用了。

但是如果你的全站是依賴Pjax（AJAX）不換頁換頁的方式，會變成第一次載入網站以後還正常，但在網站內點站內連結換頁之後，會因為沒有重刷整個頁面，造成追蹤碼沒有實際隨著切換頁面觸發更新，所以要額外應對處理。

找出按站內連結後會觸發局部載入的JavaScript關鍵處理點，然後插入下面這段，讓站內局部換頁時一併觸發Matomo追蹤更新：
```javascript
_paq.push(['setCustomUrl', window.location.href]);
_paq.push(['setDocumentTitle', document.title]);
_paq.push(['trackPageView']);
```


### 嵌入到hexo kratos-rebirth

> 注意！因為[kratos-rebirth有用到Pjax不換頁換頁技術](https://wiki.krt.moe/posts/pjax-events/)（就是在網頁上點選站內連結，只會在局部區塊載入新頁面，不更換整個網頁），JS插入法需要額外處理！！
{.xg-alertbar .xg-alertbar-warning}

基本上可以參考 {% post_link new-blog-is-opened "我先前寫過的文章，有提到外嵌留言Pjax處理的方式" %} 

這次我是直接跟著外嵌留言刷新時的觸發點，直接混在裡面處理的：

```javascript
(() => {
    // 載入＆pjax 重新掛載
    window.loadComments = loadComments;
    // 處理Matomo追蹤更新
    _paq.push(['setCustomUrl', window.location.href]);
    _paq.push(['setDocumentTitle', document.title]);
    _paq.push(['trackPageView']);
    window.addEventListener('pjax:success', () => {
        window.loadComments = loadComments;
    });
    window.addEventListener('pjax:complete', () => {
        // 處理Matomo追蹤更新
        _paq.push(['setCustomUrl', window.location.href]);
        _paq.push(['setDocumentTitle', document.title]);
        _paq.push(['trackPageView']);
    });
})();
```

## Step4: 完成！測試！
測試囉～～～！！！

其實如果沒有特別設定要擋localhost的話，在本地端就可以先開你的網頁，然後進入Matomo後台看看有沒有開始有追蹤資料進來。

你也可以搭配瀏覽器開發者工具的「網路」看看有沒有網站追蹤的封包流量，看看會不會被AdBlock擋掉。

當然網站上線上傳以後，也要記得測試確認資料有沒有進來！