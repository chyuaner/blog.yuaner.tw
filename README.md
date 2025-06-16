<!-- 這份檔案中，所有連結到本站的連結網址，請都添入寫死含主域名字串 -->
<!-- 此文件會同步給 /about 關於本站頁面使用 -->

新部落格主站
===

## 本站有使用的素材
### 背景
* <a href='https://zh.pngtree.com/freebackground/light-snow-landscape-train-illustration-background_967224.html'>免費的背景照片來自 zh.pngtree.com/</a>
* <https://zh.pngtree.com/freebackground/autumn-landscape-train-far-illustration-background_939895.html>
* <https://free-paper-texture.com/green-wood-chips-paper/>
* <https://free-paper-texture.com/black-wood-chips-texture/>


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
