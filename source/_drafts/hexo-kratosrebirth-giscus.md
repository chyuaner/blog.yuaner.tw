---
title: 安裝留言系統Giscus到hexo kratos-rebirth
cover:
categories:
    - hexo
tags:
    - hexo
    - giscus
    - kratos-rebirth
---

## 安裝步驟
### 開啟Github Repo的Discussions功能
### 開設一個放留言專用的categories （可選）
此步驟為選用，如果不想額外開設，可直接用 Announcements

### 在Github Repo設定好，並授權giscus APP到Github
### 產生giscus
至於在 「頁面 ↔️ discussion 對應方式」這個地方，我是選「Discussion 的標題包含頁面的路徑名稱」，利用網址結構對應，至於網址結構的設計建議可以參考我的上一篇。

### 嵌入到hexo kratos-rebirth
> 注意！因為[kratos-rebirth有用到Pjax不換頁換頁技術](https://wiki.krt.moe/posts/pjax-events/)（就是在網頁上點選站內連結，只會在局部區塊載入新頁面，不更換整個網頁），JS插入法需要額外處理！！
{.xg-alertbar .xg-alertbar-warning}

而且雖然[kratos-rebirth有提供幾家留言系統的安裝教學](https://eco.krt.moe/categories/%E8%AF%84%E8%AE%BA/)，但...截至我寫這篇的時間點，還是沒有giscus的教學，我是以官方提供的[DisqusJS安裝教學](https://eco.krt.moe/posts/comment-disqusjs/)視情況調整成giscus用的。

#### 建立 /source/js/giscus.js 檔案
```JavaScript /source/js/giscus.js
(() => {
    const loadComments = async () => {
        const giscusContainer = document.getElementById('giscus_container');
        if (!giscusContainer) return;

        // 清空 iframe
        while (giscusContainer.firstChild) {
            giscusContainer.removeChild(giscusContainer.firstChild);
        }

        // 重建 script
        const script = document.createElement('script');
        script.src = 'https://giscus.app/client.js';
        script.setAttribute('data-repo', '[在此輸入儲存庫名稱]');
        script.setAttribute('data-repo-id', '[在此輸入儲存庫 ID]');
        script.setAttribute('data-category', '[在此輸入分類名稱]');
        script.setAttribute('data-category-id', '[在此輸入分類 ID]');
        script.setAttribute('data-mapping', 'pathname');
        script.setAttribute('data-strict', '0');
        script.setAttribute('data-reactions-enabled', '1');
        script.setAttribute('data-emit-metadata', '0');
        script.setAttribute('data-input-position', 'bottom');
        script.setAttribute('data-theme', 'preferred_color_scheme');
        script.setAttribute('data-lang', 'zh-TW');
        script.setAttribute('crossorigin', 'anonymous');
        script.setAttribute('async', '');

        giscusContainer.appendChild(script);
    };

    // 載入＆pjax 重新掛載
    window.loadComments = loadComments;
    window.addEventListener('pjax:success', () => {
        window.loadComments = loadComments;
    });
})();
```

由JavaScript來處理插入留言區的事情，將留言區插入到 #giscus_container 區域。
而重點就是pjax那邊要控制好，

#### 修改 /_config.kratos-rebirth.yml 檔案
這份檔有兩個地方需要修改

##### 注入剛剛的 giscus.js 程式碼
```yml /_config.kratos-rebirth.yml
additional_injections:
  head: ""
  footer: ""
  after_footer: |
    <script type="module" src="/js/giscus.js"></script>
```

##### 設定安插#giscus_container的地方，並啟用文章的評論功能
```yml /_config.kratos-rebirth.yml
# 评论系统
comments:
  core:
    enable_at:
    # - index
      - post
      - page
    template:
      _shared: "<div id='giscus_container' class='kr-comments' data-path='$PATH' data-full-path='$PATH_FULL'></div>"
      index: ""
      post: ""
      page: ""
```

## 順便擷取留言數，整合到kratos-rebirth標題區的

## 其他進階用法
其他可以
不過要做的事情複雜很多，有空再另外開專文來詳述。

