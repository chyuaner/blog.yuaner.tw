---
title: 給Proxmox VE套件庫更換成適合臺灣用的mirror站
cover: Screenshot 2026-08-05 at 23-26-03 pve - Proxmox Virtual Environment.png
categories: Proxmox VE
tags:
  - Proxmox VE
toc: true
show_copyright: true
copyright_notice_template: >-
  本篇依據 <a rel="license nofollow" target="_blank"
  href="https://creativecommons.org/licenses/by-sa/4.0/deed.zh-hant">CC BY-SA
  4.0 姓名標示-相同方式分享</a> 授權釋出。
date: 2026-08-05 23:29:58
---


會整理這篇文章，主要是因為我最近在對Proxmox VE主機做系統升級時，發現他外連到國外套件庫的速度實在很慢，光是 `apt update` 取得套件清單就要滿久的。
想說都已經把家裡網路速度升級了，速度還這麼慢，實在受不了。突然想到時臺灣這邊就已經有品質滿好的mirror站，所以能在臺灣內直連是最好的。

## 現況分析與連線測試

* **PVE 主機版本**：Debian 13 (trixie) / Proxmox VE (基於 Trixie 版本)
* **APT 設定格式**：已採用新版 Debian 標準的 **DEB822** 格式檔案 (`/etc/apt/sources.list.d/*.sources`)

## TWDS 鏡像源支援比對

經比對 TWDS 鏡像站 (`mirror.twds.com.tw`) 的 Tunasync 同步狀態與目錄結構：

| 套件類別 | 原有預設來源 | TWDS 臺灣鏡像來源 | TWDS 同步狀態 |
| :--- | :--- | :--- | :--- |
| **Debian 基礎套件** | http://deb.debian.org/debian/ | https://mirror.twds.com.tw/debian/ |  `trixie` 存在且正常更新 |
| **Debian 安全更新** | http://security.debian.org/debian-security/ | https://mirror.twds.com.tw/debian-security/ |  `trixie-security` 存在且正常更新 |
| **Proxmox VE 套件** | http://download.proxmox.com/debian/pve | https://mirror.twds.com.tw/proxmox/debian/pve |  Proxmox `trixie` PVE 存在且正常更新 |

## 備份舊的設定檔

我會有複製舊的設定檔當備份的習慣，我會採用的方式是使用 APT 靜音忽略的副檔名（如 `.disabled` 或 `.bak`）。

APT 的設定中有一組 `Dir::Ignore-Files-Silently`（靜音忽略清單）。部分副檔名被視為常見臨時檔，APT 會**靜音忽略**而不跳出 Notice：

* **常見靜音副檔名**：
  * `.disabled` （如 `proxmox.sources.disabled`）
  * `.bak` （如 `proxmox.sources.bak`）
  * 波浪號 `~` 結尾（如 `proxmox.sources~`）


具體作法如下：

```bash
cp /etc/apt/sources.list.d/debian.sources /etc/apt/sources.list.d/debian.sources.disabled
cp /etc/apt/sources.list.d/proxmox.sources /etc/apt/sources.list.d/proxmox.sources.disabled
```

## 更換後的配置內容範例

{% asset_img "Screenshot 2026-08-05 at 23-26-03 pve - Proxmox Virtual Environment.png" "PVE Mirror Screenshot" %}

如要更換，修改 `/etc/apt/sources.list.d/` 內的設定檔內容如下：

### `/etc/apt/sources.list.d/debian.sources`
```deb822
Types: deb
URIs: https://mirror.twds.com.tw/debian/
Suites: trixie trixie-updates
Components: main contrib non-free-firmware
Signed-By: /usr/share/keyrings/debian-archive-keyring.gpg

Types: deb
URIs: https://mirror.twds.com.tw/debian-security/
Suites: trixie-security
Components: main contrib non-free-firmware
Signed-By: /usr/share/keyrings/debian-archive-keyring.gpg
```

### `/etc/apt/sources.list.d/proxmox.sources`
```deb822
Types: deb
URIs: https://mirror.twds.com.tw/proxmox/debian/pve
Suites: trixie
Components: pve-no-subscription
Signed-By: /usr/share/keyrings/proxmox-archive-keyring.gpg
```
