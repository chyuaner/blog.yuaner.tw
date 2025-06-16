---
title: 有架設的相關工具服務
date: 2025-06-15 10:16:21
toc: true
---

## 假圖產生器
### 基本用法
* `<img src="https://fimg.yuaner.tw/300/">`
* `<img src="https://fimg.yuaner.tw/250x100/">`
* `<img src="https://fimg.yuaner.tw/250x100/ff0000/">`
* `<img src="https://fimg.yuaner.tw/350x200/ff0000/000">`
* `<img src="https://fimg.yuaner.tw/350x200/ff0000,128/000,255">`
* `<img src="https://fimg.yuaner.tw/350x200/?text=Hello">`
* `<img src="https://fimg.yuaner.tw/200x100/?retina=1&text=こんにちは&font=noto">`
* `<img src="https://fimg.yuaner.tw/350x200/?text=World&font=lobster">`

## 本站CSS相關
以下內容已經整理過，可獨立使用，不依賴theme提供的功能。

### 排版
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

### alertbar
檔案：　[alertbar.css](/css/alertbar.css)

額外使用render引擎：
* markdown-it-attrs
* markdown-it-container

#### 原生HTML寫法
```markdown
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
```

#### Markdown引擎簡化寫法
```markdown
<!-- 使用div render寫法，有用到markdown-it-container -->
::: xg-alertbar xg-alertbar-success
這是 **xg-alertbar-success** 樣式，使用div render寫法，有用到markdown-it-container
:::

<!-- 使用div render寫法，有用到markdown-it-container，多行多要素 -->
::: xg-alertbar xg-alertbar-error
這是 **xg-alertbar-error** 樣式，原生HTML混Markdown寫法

* 並產生多行
* 並產生多行
* 並產生多行
:::

<!-- 有用到markdown-it-attrs，跑在p要素裡 -->
這是 **xg-alertbar-info** 樣式，有用到markdown-it-attrs，跑在&lt;p&gt;要素裡 {.xg-alertbar .xg-alertbar-info}
```

#### 預覽
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
這是 **xg-alertbar-error** 樣式，原生HTML混Markdown寫法

* 並產生多行
* 並產生多行
* 並產生多行
:::

<!-- 有用到markdown-it-attrs，跑在p要素裡 -->
這是 **xg-alertbar-info** 樣式，有用到markdown-it-attrs，跑在&lt;p&gt;要素裡 {.xg-alertbar .xg-alertbar-info}

## Echo Server
```
curl -d "param1=value1&param2=value2" -X POST https://echo.yuaner.tw/send-data
````

不過因為有掛Reverse Proxy，不確定回傳偵測到的IP位址是否正確，我暫時沒有心力確認，所以請自行判斷。