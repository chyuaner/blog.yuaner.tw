---
title: CSS為你的網站文章添加 AlertBar
cover: sample.png
categories:
  - CSS
tags:
  - CSS
  - hexo
toc: true
date: 2025-06-22 02:31:46
---


檔案：　[alertbar.css](/css/alertbar.css)

以下列出三種可用方式，分別以其他非hexo部落格系統可以相容的程度來排：
原生HTML > markdown-it-attrs > markdown-it-container

目前有整理出
* xg-alertbar xg-alertbar-warning
* xg-alertbar xg-alertbar-info
* xg-alertbar xg-alertbar-success
* xg-alertbar xg-alertbar-error

可以套用於div、blockquote、p的標籤。（&lt;p&gt; 是屬於內文標籤，整體區塊會縮排到文章內部）

另外我把class名稱取名為 `xg-` 開頭，是為了避開之後如果和其他CSS Framework混用的時候可能會產生衝突、功能被覆蓋掉的問題，想盡量能和大部分的Framework和lib混合用。

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

> 這是 **xg-alertbar-success** 樣式，使用markdown-it-attrs，跑在&lt;blockquote&gt;要素
{.xg-alertbar .xg-alertbar-success}

::: xg-alertbar xg-alertbar-error
這是 **xg-alertbar-error** 樣式，使用div render寫法，有用到markdown-it-container

* 並產生多行
* 並產生多行
* 並產生多行
:::

<!-- 有用到markdown-it-attrs，跑在p要素裡 -->
這是 **xg-alertbar-info** 樣式，有用到markdown-it-attrs，跑在&lt;p&gt;要素裡 {.xg-alertbar .xg-alertbar-info}


## 以原生HTML的方式使用
優點：
* 最佳相容性！只要是正常的瀏覽器應該都支援。
* 因為是由瀏覽器處理的，站長不需要額外安裝外掛，可直接使用
缺點：
* 原始碼可讀性比較差，若內容很多，不容易直接從原始碼

```html
<!-- 原生HTML寫法 -->
<div class="xg-alertbar xg-alertbar-warning">
    這是 <strong>xg-alertbar-warning</strong> 樣式，原生HTML寫法
</div>

<!-- 原生HTML混Markdown寫法 -->
<div class="xg-alertbar xg-alertbar-info">
<div>

這是 **xg-alertbar-info** 樣式，原生HTML，內文混Markdown寫法

* 並產生多行
* 並產生多行
* 並產生多行
</div>
</div>
```

## 以markdown-it-attrs
優點：
* 可讀性最好，接近習慣的Markdown語法，以原始的Markdown語法再功能擴充
* 相容性次要好
    * hexo安裝markdown-it-attrs就能使用
    * [hugo有支援Markdown attributes](https://gohugo.io/content-management/markdown-attributes/)

缺點：
* 已經不是標準寫法，是Markdown再額外擴充的，也不是HTML可直接解析的。
* 無法處理多行內容

### 使用方式
```markdown
> 這是 **xg-alertbar-success** 樣式，使用markdown-it-attrs，跑在&lt;blockquote&gt;要素
{.xg-alertbar .xg-alertbar-success}

這是 **xg-alertbar-info** 樣式，有用到markdown-it-attrs，跑在&lt;p&gt;要素裡 {.xg-alertbar .xg-alertbar-info}
```

### 適用於hexo的 安裝方法
#### Step1. 安裝 markdown-it-attrs
```bash
npm install hexo-renderer-markdown-it markdown-it-attrs markdown-it-bracketed-spans --save
```
#### Step2. 在 _config.yml 設定檔加上以下段落
```yml _config.yml
markdown:
  plugins:
    - markdown-it-attrs
    - markdown-it-bracketed-spans
    - markdown-it-anchor
  # 不確定哪些會影響markdown-it-container，我就先把我目前設定有的先貼上來
  render: 
    html: true
    xhtmlOut: true
    breaks: true
    linkify: true
    typographer: true
```

## 以markdown-it-container
優點：
* 可讀性最好，格式是自己定義的
* 可以處理多行內容，能處理的功能需求較多

缺點：
* 需要自己定義render規則結構
* 支援性最差，若未來更換部落格系統，可能這寫法會不相容
    * 已知hugo不支援，而且也沒有擴充套件可以讓hugo支援

### 使用方式
```markdown
::: xg-alertbar xg-alertbar-success
這是 **xg-alertbar-success** 樣式，使用div render寫法，有用到markdown-it-container
:::

::: xg-alertbar xg-alertbar-error
這是 **xg-alertbar-error** 樣式，使用div render寫法，有用到markdown-it-container

* 並產生多行
* 並產生多行
* 並產生多行
:::
```

### 適用於hexo的 安裝方法
#### Step1. 安裝 markdown-it-container
```bash
npm install hexo-renderer-markdown-it markdown-it-container --save
```
#### Step2. 在 _config.yml 設定檔加上以下段落
```yml _config.yml
markdown:
  plugins:
    - markdown-it-container
  # 不確定哪些會影響markdown-it-container，我就先把我目前設定有的先貼上來
  render: 
    html: true
    xhtmlOut: true
    breaks: true
    linkify: true
    typographer: true
```

#### Step3. 建立 scripts/markdown-it.js 並加上以下段落
```javascript scripts/markdown-it.js
const container = require('markdown-it-container');

hexo.extend.filter.register('markdown-it:renderer', md => {
  // 一個空字串的 container，用來處理 ::: {.class}
  md.use(container, '', {
    validate: () => true,
    render(tokens, idx) {
      const token = tokens[idx];
      if (token.nesting === 1) {
        // 開始 tag
        const info = token.info.trim();
        return `<div${info ? ` class="${info.replace(/^\{\.|\}$/g, '').replace(/\s*\./g, ' ').trim()}"` : ''}>\n<div>\n`;
      } else {
        // 結尾 tag
        return '</div></div>\n';
      }
    },
  });
});
```

## 至於其他方案的考量？
### 我為什麼不使用kratos-rebirth theme內建的AlertBar組件功能？
其實這個主題[有提供提示横幅 (AlertBar)的功能](https://wiki.krt.moe/posts/tag-widgets/)：提示横幅是以横幅形式出现的提示信息。

用下面這個寫法就可以直接做到：
```
{% alertbar primary "这是 `primary` 样式" %}
{% alertbar success "这是 `success` 样式" %}
{% alertbar info "这是 `info` 样式" %}
{% alertbar warning "这是 `warning` 样式" %}
{% alertbar danger "这是 `danger` 样式" %}
```

而且不用額外安裝CSS和做其他換Markdown render引擎這類的麻煩事。

但...就這個「但」... 一旦使用這寫法，就是註定和hexo kratos-rebirth綁死！
已經實測當不使用 kratos-rebirth theme 更換別的theme時，這個寫法會造成直接壞掉！而且不是不相容的時候被跳過，是在Build的時候就直接crash了。

### hugo有提供shortcode，為什麼我不處理讓hexo支援？
其實我的確有考慮未來等到我有心力自己寫theme時，就順便換系統到hugo，但... hugo的shortcode寫法比Markdown還不直覺，而且也不能在hugo更換render引擎成markdown-it。

還有後來多研究hugo渲染引擎之後才發現，hugo設計架構雖然漂亮，但反而擴充能力還比hexo差，難怪hugo都推出這麼久，擴充生態圈的豐富度還追不上hexo的原因了...