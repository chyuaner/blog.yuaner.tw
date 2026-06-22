---
title: docker-quick-linux-env
cover:
categories:
tags:
---

有時候可能會臨時需要一個乾淨的Linux環境，像我的用途就是：
- 整理教學文時，需要模擬一個尚未安裝的乾淨環境
- 整裡dotfile環境建置腳本需要模擬一個最乾淨最原始的Linux Distro環境
- 開發新專案時，要整理Readme文件撰寫建置教學文時，需要有乾淨的開發環境來

## 建立乾淨的Linux環境
```sh
docker run --rm -ti archlinux:base-devel
```

```sh
docker run --rm -ti manjarolinux/base:latest
```

```sh
docker run --rm -ti debian:bookworm-slim
docker run --rm -ti debian:trixie-slim
```
