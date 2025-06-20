---
title: Linux以檔案形式swapfile建立虛擬記憶體
categories:
  - Linux
tags:
  - linux
date: 2025-06-20 08:57:46
cover:
---


主要需求是我是使用免費的VPS主機，規格給太低，實體記憶體只給到957M，導致很多程式跑不起來（尤其遇到需要build的時候）。但是因為檔案儲存空間給的還算很夠，所以就想說用檔案的形式來擴充記憶體容量。
寫這篇主要是給自己做個紀錄，因為網路上的教學很亂而且有踩到雷不能適用，所以乾脆把自己實際有成功搞定的指令記錄起來備忘。

## 建立 /swapfile 檔案
```bash
sudo dd if=/dev/zero of=/swapfile bs=1M count=3072  # 建立3GB的虛擬記憶體
sudo mkswap /swapfile 
sudo chown root:root /swapfile 
sudo chmod 0600 /swapfile
```

PS. 網路上那些什麼 bs=1G count=4 這種教學範例的，我實測是失敗的。

## 啟動虛擬記憶體
```bash
sudo swapon /swapfile
```

如果要關閉虛擬記憶體的話：
```bash
sudo swapoff /swapfile
```


## 看一下SWAP有沒有運作正常
```bash
htop
```


## 設定開機時常駐使用這個SWAP
```bash
sudo vim /etc/fstab
```

多增加這一段：
```
/swapfile        none           swap    sw          0 0
```


## 要稍微注意
先說只要開始吃到系統記憶體，整體的系統效能就會被儲存空間的存取速度受限，所以整體效能就不要奢望了，不過至少那些需要 build 的東西，有成功跑完，也算是達到我的主要目的了。