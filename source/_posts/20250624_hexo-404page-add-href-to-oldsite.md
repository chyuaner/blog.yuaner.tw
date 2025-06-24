---
title: hexo kratos-rebirth 404頁面 插入超連結引導使用者前往搬移後網址
cover: >-
  Screenshot%202025-06-24%20at%2015-08-21%20%E9%80%99%E5%80%8B%E9%A0%81%E9%9D%A2%E8%B5%B0%E4%B8%9F%E4%BA%86%E5%91%A2%E2%80%A6%20%E5%85%83%E5%85%92%EF%BD%9E%E7%9A%84%E6%96%B0%E9%83%A8%E8%90%BD%E6%A0%BC.png
categories:
  - hexo
tags:
  - hexo
  - kratos-rebirth
date: 2025-06-24 15:32:08
---


雖然我已經做過[舊網址後綴字串名單自動導向到新網址](/2025/06/cloudflare-sharedurl-oldurl2newurl)的處理，但還是被打臉了，後來我從網站追蹤分析那邊看到有些舊網址不是100%都會有效的導向到舊站，當不會自動導向過去的話，使用者就會看到本站的404找不到網頁去了。（尤其是網址帶有中文字會更嚴重）
![404頁面](Screenshot%202025-06-24%20at%2015-08-21%20%E9%80%99%E5%80%8B%E9%A0%81%E9%9D%A2%E8%B5%B0%E4%B8%9F%E4%BA%86%E5%91%A2%E2%80%A6%20%E5%85%83%E5%85%92%EF%BD%9E%E7%9A%84%E6%96%B0%E9%83%A8%E8%90%BD%E6%A0%BC.png)

我也有嘗試在Cloudflare修正，但還是無效，然後這樣來來回回修感覺會花過多心力在處理這個上面，就乾脆想說乾脆對本站404頁面下手好了，想說既然不是100%有效的自動導向過去，那我乾脆對404頁面多添加訊息告知使用者網址已經換了。

額外我有寫一段小小的JavaScript，是會依照使用者網址的後面字段，插入一個超連結會導向到另一個域名同樣後字段，例如：
https://blog.yuaner.tw/old/%E7%9B%AE%E5%89%8D%E6%AE%98%E7%95%99%E7%9A%84%E6%98%9F%E9%9A%9B%E8%AD%AF%E7%8E%8B%E5%AD%97%E5%85%B8%E6%AA%94/ → 
https://blog-legacy.yuaner.tw/old/%E7%9B%AE%E5%89%8D%E6%AE%98%E7%95%99%E7%9A%84%E6%98%9F%E9%9A%9B%E8%AD%AF%E7%8E%8B%E5%AD%97%E5%85%B8%E6%AA%94/

## 處理方式
我是使用hexo Kratos : Rebirth theme，本身有自帶404頁面。不過因為我有客製化404頁面的需求，所以我直接對theme原檔修改處理。

## Step1: 修改404.ejs
最主要是新增 `theme.additional_injections.page404_content` ，讓我可以由主題外的設定檔可以填入我想要的自定義內容，不用把內容寫死在主題包內。

```html /themes/kratos-rebirth/layout/_pages/404.ejs
<div class="page404">
    <div class="kratos-hentry kratos-page-inner clearfix">
        <div class="col-md-7">
            <img src="<%- url_theme_cdn('images/404.webp') %>" loading="eager" decoding="auto" />
        </div>
        <div class="col-md-5 text-center errtxt">
          <h3>404 沒有這個頁面喔～</h3>
          <h4>你迷路了嗎？要不要試著回到首頁找一找呀～？</h4>
        </div>
        
        <div class="col-md-5">
          <!-- 额外的追加注入项 -->
          <% if (theme.additional_injections.page404_content) { %>
            <%- theme.additional_injections.page404_content %>
          <% } %>
        </div>

        <div class="col-md-5 text-center">
            <p>
                <a href="javascript:history.go(-1)" class="back-p">回到上一頁</a>
                <a href="<%- url_for() %>" class="back-index">回到首頁</a>
            </p>
        </div>
    </div>
</div>
```

## Step2: 在kratos-rebirth注入404頁面要顯示的內容

```yml /_config.kratos-rebirth.yml
additional_injections:
  page404_content: |
    <p>PS. 如果你是從舊連結舊網址過來的，舊文章已經移到另一個網址去了，<a id="try-to-oldsite-url" href="#">你要不要嘗試前往舊站看看啊</a>？</p>
    <script>
      document.addEventListener('DOMContentLoaded', function () {
        const fullPath = location.pathname + location.search;
        const tryToOldSiteA = document.getElementById('try-to-oldsite-url');
        if (tryToOldSiteA) {
          tryToOldSiteA.href = 'https://blog-legacy.yuaner.tw' + fullPath;
        }
      });
    </script>
```