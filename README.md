<!-- 這份檔案中，所有連結到本站的連結網址，請都添入寫死含主域名字串 -->
<!-- 此文件會同步給 /about 關於本站頁面使用 -->

新部落格主站
===

## 常用指令

### 文章相關
#### 新增文章 (New Post)
這會在 `source/_posts/` 底下新增一篇新的文章：
```bash
npx hexo new "文章標題"
# 或簡寫：
npx hexo n "文章標題"
```

#### 新增草稿文章 (New Draft)
這會在 `source/_drafts/` 底下新增一篇草稿：
```bash
npx hexo new draft "草稿標題"
```

#### 發布草稿文章 (Publish Draft)
這會將指定的草稿（從 `source/_drafts/`）移動到正式文章目錄（`source/_posts/`）：
```bash
npx hexo publish "草稿標題"
```
或者也可以直接手動將檔案從 `source/_drafts/` 移動到 `source/_posts/` 底下。

> [!IMPORTANT]
> **執行指令時的注意事項**
> 執行任何 `npx hexo` 指令前，請務必先將終端機切換至**專案的根目錄**（即包含 `package.json` 的目錄）。若不在專案根目錄下執行，Hexo 會因為找不到專案設定檔而無法識別 `publish`、`new` 等指令，並直接顯示「無效指令」的說明文件。

### 本機預覽 (Preview Locally)
*   **預覽正式文章**：
    ```bash
    npm run server
    ```
    這會清除快取並啟動本機伺服器（預設為 `http://localhost:4000`）。
*   **預覽包含草稿文章**：
    ```bash
    npm run draft-server
    ```
    啟動本機伺服器並同時載入 `source/_drafts/` 底下的草稿。

### 產生靜態檔案與部署 (Generate & Deploy)
*   **產生靜態檔案**：
    ```bash
    npm run build
    ```
*   **部署**：
    ```bash
    npm run deploy
    ```
*   **清除快取**：
    ```bash
    npm run clean
    ```

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

### 1. 複製專案與子模組 (Clone repository with submodules)
由於本專案在 `themes` 以及 `external` 目錄中使用了客製化的 Git Submodules，在複製專案時需要一併載入：
```bash
# 複製專案並同時拉取子模組
git clone --recursive <repo_url>

# 若先前已複製過專案，可執行此指令初始化與更新子模組：
git submodule update --init --recursive
```

### 2. 安裝套件 (Install dependencies)
請確保本機已安裝 Node.js 與 npm，然後在專案根目錄下執行：
```bash
npm install
```

### 3. 本機預覽與測試 (Preview & Test)
使用以下指令在本機啟動預覽：
```bash
# 預覽正式文章
npm run server

# 預覽包括草稿文章
npm run draft-server
```
伺服器啟動後，即可在瀏覽器開啟 `http://localhost:4000` 進行預覽。

## GitHub Actions 部署與 Cloudflare CDN 快取設定

本專案使用 GitHub Actions 進行自動化建置與部署（到 GitHub Pages）。此外，在部署成功後，會自動呼叫 Cloudflare API 清除指定主機名稱（Hostname）的 CDN 快取，以確保最新文章能立即呈現。

該快取清除步驟在缺少 Secrets 設定時會自動跳過，不會影響部署流程：

### 需要設定的 Secrets
請前往您專案 GitHub 儲存庫的 `Settings` -> `Secrets and variables` -> `Actions` 下的 **Repository secrets** 中設定以下三個變數：

1. **`CLOUDFLARE_ZONE_ID`**：
   您的 Cloudflare 網域 Zone ID（可於 Cloudflare 網域的 **Overview** 頁面右側找到）。
2. **`CLOUDFLARE_API_TOKEN`**：
   具備快取清除權限的 API Token。
   * **建立與權限設定建議**：請至 Cloudflare 控制台的 **My Profile** -> **API Tokens**，點擊最底下的 **Create Custom Token**（建立自訂權杖），新增權限為：`Zone` -> `Cache Purge` -> `Edit`，並將區域資源限制在您部落格的特定網域。
3. **`CCDN_HOST`**：
   您需要清除快取的主機名稱（例如：`blog.yuaner.tw`）。

> [!NOTE]
> 如果沒有設定上述三個 Secrets，工作流依然會順利建置與部署成功，但會自動略過 Cloudflare 快取清除的步驟，並在部署日誌中印出 `Cloudflare cache purge skipped: missing required secrets.`。
