---
title: 利用Docker快速建立一個超乾淨的環境
cover: Gemini_Generated_Image_fogmx4fogmx4fogm.png
categories: Linux
tags:
  - docker
show_copyright: true
copyright_notice_template:
  本篇教學主文依據 <a rel="license nofollow" target="_blank" href="https://creativecommons.org/licenses/by-sa/4.0/deed.zh-hant">CC BY-SA 4.0 姓名標示-相同方式分享</a> 授權釋出。 
---

有時候可能會臨時需要一個乾淨的Linux環境，像我的用途就是：
- 整理教學文時，需要模擬一個尚未安裝的乾淨環境
- 整裡dotfile環境建置腳本需要模擬一個最乾淨最原始的Linux Distro環境
- 開發新專案時，要整理Readme文件撰寫建置教學文時，需要有乾淨的開發環境來

## 建立乾淨的Linux環境

### Arch Linux
```sh
docker run --rm -ti archlinux:base-devel
```

### Manjaro
```sh
docker run --rm -ti manjarolinux/base:latest
```

### Debian
```sh
docker run --rm -ti debian:bookworm-slim
```

```sh
docker run --rm -ti debian:trixie-slim
```

## 結語
注意！當使用`exit`離開後，當前狀態就會立刻銷毀。

我知道這篇很水，對已經很熟悉Docker的人來說這種基本功根本不值一題。不過對我來說算是給自己用的筆記，在我被其他問題搞到腦子燒掉的時候，這篇還是可以幫助我不用再多花力氣回想...Docker要怎麼用，就醬😛
