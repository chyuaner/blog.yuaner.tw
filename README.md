<!-- 這份檔案中，所有連結到本站的連結網址，請都添入寫死含主域名字串 -->
<!-- 此文件會同步給 /about 關於本站頁面使用 -->

新部落格主站
===

## 本站寫文風格
* 基本上都是以Markdown為主，相關定義class之類的attribute，都是用Markdown擴充語法。
* 盡量不要使用 hexo 專有語法： `{% link text url [external] [title] %}`、`{% post_link slug [title] %}` 這類的，會導致之後若要換系統搬移文章的話，會衍生需要額外自行撰寫解析器的麻煩。

### Cover封面圖
**1200x725** 應該是最佳考量！！

* 本theme文章列表封面原始尺寸： 240x145
* Facebook摘文最佳尺寸： 1200x630

## 本站有使用的素材
### 背景
* <a href='https://zh.pngtree.com/freebackground/light-snow-landscape-train-illustration-background_967224.html'>免費的背景照片來自 zh.pngtree.com/</a>
* <https://zh.pngtree.com/freebackground/autumn-landscape-train-far-illustration-background_939895.html>
* <https://free-paper-texture.com/green-wood-chips-paper/>
* <https://free-paper-texture.com/black-wood-chips-texture/>

## repo的檔案結構
原則上以原始hexo檔案結構為主，不過根據需求，有擴增一些資料夾：

* external: 有自行修改過的npm套件，以git submodule的形式，配合package.json連結進來
* scripts: hexo處理時需要依賴的JS檔
* tools: 不給hexo處理，但需要額外給外部工具用js執行腳本
* themes: 本站用的主題，因為也有自行改過，故以git submodule的形式拉進來。
* source/assets: 自行調整的網站佈景需要用到的圖片資源都放這
* source/js/giscus.js: 雖然名義上是處理留言系統，但因為有綁定pjax載入邏輯很難拆開，故所有需要換頁功能要做的事情都塞在這份裡面。
* source/fontawesome: 雖然是從npm安裝，但是為了給全站讀到要用的檔案，有囮外用腳本自動複製到這邊，並設定gitignore

其他應該都是hexo原始結構與kratos-rebirth衍生的設定結構，可從官方教學對照。

## 有額外安裝的Plugin
* hexo-generator-feed
    * ~~hexo-feed~~ (當備用)
* hexo-hide-posts
* hexo-include-markdown
* @fortawesome/fontawesome-free
* ~~hexo-renderer-marked~~ (更換render引擎)
* hexo-renderer-markdown-it
    * markdown-it-anchor
    * markdown-it-attrs
    * markdown-it-bracketed-spans
    * markdown-it-container

## 有額外調整的部分

* 修改post建立時的檔名規則 & 網址規則
* 調整assets圖片資源檔架構
* 建立Github Action workflows自動建置
    * 因為有客製化kratos-rebirth，配合修改script
    * 有使用 hexo-include-markdown ，發現無db.json時會壞掉，所以再補上腳本補上空檔案
* 使用giscus用Github Discussions存放留言內容
* 自建Firebase來存放views_count開啟次數統計
    * 重要教學: <https://www.jingjies-blog.com/blog/2022/06/22/add-view-counter-to-Hexo-in-Express/>
* 使用 hexo-include-markdown ，將 source 資料夾外部的README.md連結進來當作about頁面使用

## 留言系統 giscus
### 有額外處理的部分
* 因為本主題有pjax動態載入，不能直接取用giscus官方程式碼範例，有以kratos-rebirth給的 [comment-disqus範例](https://eco.krt.moe/posts/comment-disqus/) 為基礎修改使用。
* 額外加入留言數，拉出給post header使用。

## kratos-rebirth theme
### 有自行修改的部分
* 繁體中文化
* 更改404
* footer文案

## 在本機安裝建置
