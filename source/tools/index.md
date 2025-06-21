---
title: 在新部落格寫文用的相關工具
date: 2025-06-15 10:16:21
toc: true
---
## 本站寫文風格
基本上都是以Markdown為主，相關定義class之類的attribute，都是用Markdown擴充語法

### Cover封面圖
<div class="xg-grid">
<div class="xg-col-5 xg-col-sm-12">

![圖片放置處](https://fimg.yuaner.tw/1200x725)
</div>
<div class="xg-col-7 xg-col-sm-12">

**1200x725** 應該是最佳考量！！

* 本theme文章列表封面原始尺寸: 240x145
* Facebook摘文最佳尺寸：1200x630
</div>
</div>


## 預留用圖片網址
* https://fimg.yuaner.tw/300/
* https://fimg.yuaner.tw/250x100/
* https://fimg.yuaner.tw/250x100/ff0000/
* https://fimg.yuaner.tw/350x200/ff0000/000
* https://fimg.yuaner.tw/350x200/ff0000,128/000,255
* https://fimg.yuaner.tw/350x200/?text=Hello
* https://fimg.yuaner.tw/200x100/?retina=1&text=こんにちは&font=noto
* https://fimg.yuaner.tw/350x200/?text=World&font=lobster

## 本站CSS相關
以下內容已經整理過，可獨立使用，不依賴theme提供的功能。

### 排版
#### 預覽
<div class="post-content">
<div class="xg-grid">
<div class="xg-col-8 xg-col-sm-12">

左邊主文
* 主文條列1
* 主文條列2
* 主文條列3

</div>
<div class="xg-col-4 xg-col-sm-12">

右側放置處（可放圖片）
![圖片放置處](https://fimg.yuaner.tw/300)

</div>
</div>
</div>

#### 用法說明
檔案：　[grid.css](/css/grid.css)

```markdown
<div class="post-content">
<div class="xg-grid">
<div class="xg-col-8 xg-col-sm-12">

左邊主文
* 主文條列1
* 主文條列2
* 主文條列3

</div>
<div class="xg-col-4 xg-col-sm-12">

右側放置處（可放圖片）
![圖片放置處](https://fimg.yuaner.tw/300)

</div>
</div>
</div>
```

### AlertBar
詳細介紹文： [CSS為你的網站文章添加 AlertBar](/2025/06/css-xg-alertbar)

<!-- 原生HTML寫法 -->
<div class="xg-alertbar xg-alertbar-warning">
    這是 <strong>.xg-alertbar-warning</strong> 樣式，原生HTML寫法
</div>

<!-- 原生HTML混Markdown寫法 -->
<div class="xg-alertbar xg-alertbar-info">
<div>

這是 **xg-alertbar-info** 樣式，原生HTML混Markdown寫法

* 並產生多行
* 並產生多行
* 並產生多行
</div>
</div>

<!-- 使用div render寫法，有用到markdown-it-container -->
::: xg-alertbar xg-alertbar-success
這是 **xg-alertbar-success** 樣式，使用div render寫法，有用到markdown-it-container
:::

<!-- 使用div render寫法，有用到markdown-it-container，多行多要素 -->
::: xg-alertbar xg-alertbar-error
這是 **xg-alertbar-error** 樣式，使用div render寫法，有用到markdown-it-container

* 並產生多行
* 並產生多行
* 並產生多行
:::

<!-- 有用到markdown-it-attrs，跑在p要素裡 -->
這是 **xg-alertbar-info** 樣式，有用到markdown-it-attrs，跑在&lt;p&gt;要素裡 {.xg-alertbar .xg-alertbar-info}

#### 本站寫法
```markdown
> 這是 **xg-alertbar-success** 樣式，使用markdown-it-attrs，跑在&lt;blockquote&gt;要素
{.xg-alertbar .xg-alertbar-success}

::: xg-alertbar xg-alertbar-success
這是 **xg-alertbar-success** 樣式，使用div render寫法，有用到markdown-it-container
:::

::: xg-alertbar xg-alertbar-error
這是 **xg-alertbar-error** 樣式，使用div render寫法，有用到markdown-it-container

* 並產生多行
* 並產生多行
* 並產生多行
:::

這是 **xg-alertbar-info** 樣式，有用到markdown-it-attrs，跑在&lt;p&gt;要素裡 {.xg-alertbar .xg-alertbar-info}
```

### 仿造萌娘百科用的防劇透格式
詳細介紹文： [CSS為你的網站文章添加防劇透用的黑幕、模糊效果](/2025/06/css-heimu)

#### spoiler Heimu 黑幕

<div class="xg-grid">
<div class="xg-col-9 xg-col-sm-12">

這段字是[防止被劇透的黑幕設計]{.heimu}測試

直接做整段防止被劇透的黑幕設計測試 {.heimu}
</div>
<div class="xg-col-3 xg-col-sm-12">

![圖片放置處](https://fimg.yuaner.tw/100) {.heimu}
</div>
</div>

##### 本站寫法
```markdown
這段字是[防止被劇透的黑幕設計]{.heimu}測試

直接做整段防止被劇透的黑幕設計測試 {.heimu}

![圖片放置處](https://fimg.yuaner.tw/100) {.heimu}
```

#### spoiler Blur 模糊

<div class="xg-grid">
<div class="xg-col-9 xg-col-sm-12">

這段字是[防止被劇透的模糊文字設計]{.hovers-blur}測試

直接做整段防止被劇透的模糊文字設計測試 {.hovers-blur}
</div>
<div class="xg-col-3 xg-col-sm-12">

![圖片放置處](https://fimg.yuaner.tw/100) {.hovers-blur}
</div>
</div>

##### 本站寫法
```markdown
這段字是[防止被劇透的模糊文字設計]{.hovers-blur}測試

直接做整段防止被劇透的模糊文字設計測試 {.hovers-blur}

![圖片放置處](https://fimg.yuaner.tw/100) {.hovers-blur}
```

## Echo Server
```
curl -d "param1=value1&param2=value2" -X POST https://echo.yuaner.tw/send-data
````

不過因為有掛Reverse Proxy，不確定回傳偵測到的IP位址是否正確，我暫時沒有心力確認，所以請自行判斷。