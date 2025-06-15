---
title: 有架設的相關工具服務
date: 2025-06-15 10:16:21
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
```html
<div class="xg-alertbar xg-alertbar-warning">
    這次所有舊文章不會搬家到新系統去！
</div>
<div class="xg-alertbar xg-alertbar-info">

**xg-alertbar-info** 樣式
</div>
```

#### 預覽
<div class="xg-alertbar xg-alertbar-warning">
    這次所有舊文章不會搬家到新系統去！
</div>
<div class="xg-alertbar xg-alertbar-info">

**xg-alertbar-info** 樣式
</div>

## Echo Server
```
curl -d "param1=value1&param2=value2" -X POST https://echo.yuaner.tw/send-data
````

不過因為有掛Reverse Proxy，不確定回傳偵測到的IP位址是否正確，我暫時沒有心力確認，所以請自行判斷。