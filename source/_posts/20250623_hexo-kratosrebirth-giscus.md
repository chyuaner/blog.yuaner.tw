---
title: 安裝留言系統Giscus到hexo kratos-rebirth (PJAX處理)
cover: >-
  Screenshot%202025-06-23%20at%2001-09-49%20%E6%88%91%E7%9A%84%E7%AC%AC%E4%B8%80%E7%AF%87%E6%96%87%E7%AB%A0%20%E5%85%83%E5%85%92%EF%BD%9E%E7%9A%84%E6%96%B0%E9%83%A8%E8%90%BD%E6%A0%BC.png
categories:
  - hexo
tags:
  - hexo
  - giscus
  - kratos-rebirth
toc: true
expire: 365
mark:
  TODO: 本篇有用到 {% collapse 如果不想處理PJAX %} 寫法，有空需回頭處理這篇的格式問題
date: 2025-06-23 18:46:43
---


## 安裝步驟
其實Step1~4之前，應該和絕大部分爬文可以爬的到的教學差不多。不過從Step5開始，因為這個theme有用到PJAX技術（PJAX會在後面說明），導致不能直接用giscus產生出來的script使用。若是在這邊卡關，可以直接跳去看[Step5 嵌入到hexo kratos-rebirth](#Step5-%E5%B5%8C%E5%85%A5%E5%88%B0hexo-kratos-rebirth)。

### Step1: 開啟Github Repo的Discussions功能
repo → `Settings` → `General` → `Features` → `Discussions`要打開
![](Screenshot%202025-06-23%20at%2001-21-37%20Generalc.png)

### Step2: 開設一個放留言專用的categories （可選）
此步驟為選用，如果不想額外開設，可直接用 Announcements

repo → Discussions → 左側Categories有個小鉛筆編輯
![](Screenshot%202025-06-23%20at%2001-25-55%20chyuaner_blog.yuaner.tw%20%C2%B7%20Discussions%20%C2%B7%20GitHubc.png)

→ New category 這邊填入方便變是的名字，其中最重要的是類型要選 Announcement 
![](Screenshot%202025-06-23%20at%2001-27-56%20New%20Discussion%20Category%20%C2%B7%20chyuaner_blog.yuaner.tw.png)

### Step3: 在Github Repo設定好，並授權Giscus APP到Github
請前往 <https://github.com/apps/giscus> 授權Giscus APP到Github。
授權時，Repository access那邊只要選擇你要存放留言的repo就可以了，不用全部都授權。

### Step4: 產生Giscus &lt;script&gt;
到 <https://giscus.app/zh-TW> 留言系統產生頁面

然後按照他的網頁指示，填入需要的資料，就會生出&lt;script&gt;碼給你貼到你的網頁上。

至於在 「頁面 ↔️ discussion 對應方式」這個地方，我是選「Discussion 的標題包含頁面的路徑名稱」，利用網址結構對應，至於[網址結構的設計建議可以參考我的上一篇](/2025/06/url-permalink-design)。

如果Step2有開設存放留言專用的categories，記得在「Discussion 分類」要選擇你要的分類。

### **Step5: 嵌入到hexo kratos-rebirth**
> 注意！因為[kratos-rebirth有用到Pjax不換頁換頁技術](https://wiki.krt.moe/posts/pjax-events/)（就是在網頁上點選站內連結，只會在局部區塊載入新頁面，不更換整個網頁），JS插入法需要額外處理！！
{.xg-alertbar .xg-alertbar-warning}

而且雖然[kratos-rebirth有提供幾家留言系統的安裝教學](https://eco.krt.moe/categories/%E8%AF%84%E8%AE%BA/)，但...截至我寫這篇的時間點，還是沒有giscus的教學，所以想說來寫一下這篇當作做個紀錄。

先說PJAX對策：
* 要嘛就是直接關閉PJAX功能避開所有後續問題，但是使用者瀏覽體驗觀感會退回到傳統換頁式網頁。
* 要嘛就是保持啟用PJAX，但是要在PJAX環境下做特殊處理。

{% collapse 如果不想處理PJAX %}

想直接關閉的話，可依照[Kratos : Rebirth官方說明](https://wiki.krt.moe/posts/configurations/#%E6%9B%B4%E6%96%B0%E6%A3%80%E6%9F%A5%E3%80%81-PJAX-%E4%B8%8E-ViewerJS)

在 `_config.kratos-rebirth.yml` 新增一項，把這個開關關掉，就會停用PJAX現代局部換頁技術
```yml /_config.kratos-rebirth.yml
# 启用页面局部更新功能
pjax: false
```

關閉之後，直接把giscus官方提供的 &lt;script&gt; 貼到 /_config.kratos-rebirth.yml :
```yml /_config.kratos-rebirth.yml
# 评论系统
comments:
  core:
    enable_at:
    # - index
      - post
      - page
    template:
      _shared: "<!--giscus script放置處-->"
      index: ""
      post: ""
      page: ""
```

這樣後面的步驟都可以全跳過了。

當然我還是希望能給使用者有更好的體驗，所以接下來我還是會以啟用PJAX的情況下來處理這個問題！
{% endcollapse %}


雖然kratos-rebirth有[官方處理PJAX的範例](https://wiki.krt.moe/posts/pjax-events/)，不過我一開始只看PJAX事件還是不知道要從哪下手，後來我是以官方提供的[DisqusJS安裝教學](https://eco.krt.moe/posts/comment-disqusjs/)視情況調整成giscus用的。

#### Step5.1: 建立 `/source/comments/giscus.js` 檔案
請對照剛剛由 giscus 官方產生器產生出來的 &lt;script&gt; ，將以下程式碼 setAttribute 那邊分別填入由giscus官方產出&lt;script&gt;裡的參數內容帶入進去。

將外嵌留言區從原本的的這幾個參數：`data-repo`, `data-repo-id`, `data-category`, `data-category-id`, `data-mapping`, `data-strict`, `data-reactions-enabled`, `data-emit-metadata`, `data-input-position`, `data-theme`, `data-lang` 都帶到下面的程式碼：

```JavaScript /source/comments/giscus.js
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

變成插入留言區的事情是包在自己的async function裡，讓外層可以隨時重複呼叫這段。
因為PJAX啟用情況下，當點選站內超連結時，不會切換整個網頁，會變成原本giscus正常的載入方式不會再被觸發到。
所以必須先包成function以後，在額外設定PJAX在局部還頁時，也要一起觸發重產giscus這段。

然後由JS產生的留言區，會插入到 `<div id='giscus_container'>` 區域。接下來的步驟就是要在合適的地方插入這個div區域。

#### Step5.2: 修改 `/_config.kratos-rebirth.yml` 檔案
##### Step5.2.1: 注入剛剛的 giscus.js 程式碼
請找到 `additional_injections.after_footer` 這一段以後，將這段加進去：
```yml /_config.kratos-rebirth.yml
additional_injections:
  head: ""
  footer: ""
  after_footer: |
    <script type="module" src="/comments/giscus.js"></script>
```

##### Step5.2.2: 設定安插#giscus_container的地方，並啟用文章的評論功能
一樣也是找到 `comments.core.template._shared` 這邊加進去。然後請將`enable_at`啟用
```yml /_config.kratos-rebirth.yml
# 留言系統
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
### Step6: 大功告成！來測試吧～
因為有改動到 `_config.kratos-rebirth.yml` 檔 ，如果你是邊開hexo server邊改的話，請記得把hexo重啟，才能確定這次改動有沒有成功生效！！

測試建議以這些情況來測：
* 請以直接打網址載入文章頁面，看看留言區有沒有載入
* 網頁載入完成之後，再隨便點一個站內連結，進入到另一篇文章，看看再不重新整理的情況下，另一篇的留言區有沒有正常載入

![](Screenshot%202025-06-23%20at%2001-09-49%20%E6%88%91%E7%9A%84%E7%AC%AC%E4%B8%80%E7%AF%87%E6%96%87%E7%AB%A0%20%E5%85%83%E5%85%92%EF%BD%9E%E7%9A%84%E6%96%B0%E9%83%A8%E8%90%BD%E6%A0%BC.png)


## 額外加入：Giscus擷取留言數，整合到kratos-rebirth文章標題區

其實你剛剛在修改`_config.kratos-rebirth.yml`檔的時候，應該有注意到其實kratos-rebirth有預留`comments.count`參數可以控制。如果有辦法從外嵌留言系統單獨取到該篇文章目前的總留言數，就可以填進`comments.count.post`。

![](Screenshot%202025-06-23%20at%2001-11-06%20%E6%88%91%E7%9A%84%E7%AC%AC%E4%B8%80%E7%AF%87%E6%96%87%E7%AB%A0%20%E5%85%83%E5%85%92%EF%BD%9E%E7%9A%84%E6%96%B0%E9%83%A8%E8%90%BD%E6%A0%BCc.png)

### Step1: 修改現有的Giscus Script

* 要把 `data-emit-metadata` 啟用為 `1`
* 在loadComments裡面的最後結束之前，插入處理留言數的邏輯。

```JavaScript /source/comments/giscus.js
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
        script.setAttribute('data-emit-metadata', '1'); // ⚠️ 就是這段要開啟
        script.setAttribute('data-input-position', 'bottom');
        script.setAttribute('data-theme', 'preferred_color_scheme');
        script.setAttribute('data-lang', 'zh-TW');
        script.setAttribute('crossorigin', 'anonymous');
        script.setAttribute('async', '');

        giscusContainer.appendChild(script);

        // ⚠️ 這段插入： 在文章頁面顯示留言數量功能
        window.addEventListener("message", function giscusMetadataListener(event) {
            if (event.origin !== "https://giscus.app") return;
            const data = event.data;
            // console.log(data); // 💬 如果要知道giscus有提供哪些資料可用，可用這段搭配瀏覽器主控台測試
            if (data?.giscus?.discussion?.totalCommentCount !== undefined) {
                // 若有留言數據
                const comment = data.giscus.discussion.totalCommentCount;
                const reply_count = data.giscus.discussion.totalReplyCount;
                const count = comment + reply_count;
                const countElem = document.getElementById("giscus_count");
                if (countElem) countElem.textContent = count;
            } else if (data?.giscus?.error === "Discussion not found") {
                // 討論串不存在，視同留言數0
                const countElem = document.getElementById("giscus_count");
                if (countElem) countElem.textContent = "0";
            }
        });
    };

    // 載入＆pjax 重新掛載
    window.loadComments = loadComments;
    window.addEventListener('pjax:success', () => {
        window.loadComments = loadComments;
    });
})();
```

### Step2: 修改 /_config.kratos-rebirth.yml 檔案
設定安插#giscus_container的地方，並啟用文章的評論功能

```yml /_config.kratos-rebirth.yml
# 留言系統
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
  # ⚠️ count這段插入
  count:
    enable_at: 
    - index
    - post
    template:
      _shared: ""
      index: ""
      # ⚠️ 重點是＃giscus_count這段
      post: "<span id='giscus_count'>?</span>"
```

## 其他更多需求：要一次拉多篇文章的留言數與列表功能
以上整個留言功能只能針對**當前這一篇**文章顯示，因為Giscus外掛會根據「現在當前網址」結構來判斷要載入哪一篇文章的留言。

如果你有更多的需求，像是：
* 首頁文章列表每篇文章項目都要顯示該篇文章總留言數
* 在aside側邊小工具多顯示最新留言清單

這種需要**一次取得多篇文章的留言數** ，那Giscus官方並沒有提供這樣的功能。
但是因為Giscus本來就是把Github Discussions當留言存放空間，所以可以自行寫程式直接去Github Discussions抓取這些資料。

不過這部份的處理會很麻煩，有空再另外開專文來詳述😉。