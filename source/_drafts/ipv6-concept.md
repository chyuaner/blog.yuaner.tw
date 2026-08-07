---
title: IPv6與IPv4的差別和用途
cover:
categories: IPv6
tags:
  - IPv6
  - IPv4
  - NAT
  - DDNS
  - CHT
toc: true
show_copyright: true
copyright_notice_template: >-
  本篇依據 <a rel="license nofollow" target="_blank"
  href="https://creativecommons.org/licenses/by-sa/4.0/deed.zh-hant">CC BY-SA
  4.0 姓名標示-相同方式分享</a> 授權釋出。
---

近期我想認真處理我家的網路環境，然後號稱IPv6是新世代，過了10年都還在「新世代」...😅

不過如果沒有把IPv6處理好的話，確實會造成一些IPv6 Only的網站會無法瀏覽

## 支援IPv6好處？

## 原因...老生常談，IPv4枯竭了
IPv4全世界已經配發完，枯竭了。

## IPv4枯竭的應對解法：萬能的NAT轉送
大前提：內網所有主機(電腦、手機、平板...)都**共用**同一個對外公網IP出去！！！

### 前提是對方只能**被動**

#### 好上手的遠端桌面、內網穿透是怎麼讓對方進你的主機？

### 實驗
#### Mega流量限制偵測

#### 內網內用兩、三台電腦進入MyIP看看？

### 架站需求：設定NAT 讓外網轉送到內網主機

# IPv6出現囉！

## IPv6與IPv4完全不相容！！而且使用者方和伺服器方都要支援IPv6
### 檢查你的網路有沒有IPv6

可以用我的MyIP站
* https://ipv6.yuaner.tw （僅IPv6連得到）
* https://myip.yuaner.tw （IPv6+IPv4都連得到，但IPv6會出現綠色IP字）

萬用的測試站
* https://test-ipv6.com/

## 臺灣的中華電信其實就有給你IPv6環境
### 民用光世代PPPoE
但是撥號的分享器or你的電腦要啟用IPv6

### 手機行動網路（我這邊是4G）

#### 近期實用用途：在手機WiFi行動基地台內，開臨時Server讓國外朋友直連傳檔
miniserve

## IPv6概念完全不一樣！！！而且線路也不對稱！！
實務大原則：
* IPv4是所有區網共用一個對外IP！區網內每一台電腦都共用同一個對外IP出去！只能從內網出去，外網一般是進不去內部電腦，因為這個IP是對集中共用的網路分享器。
* IPv6是一台主機就直接面對公網IP，區網內的每一台電腦都有各自的公網IP，理論上公網也可以直連進內部電腦，因為這個IP就是對這台電腦。

### 也有例外狀況：懶惰開大絕，IPv6規劃設計是可以與IPv4一致
IPv6也可以設計共用公網IP並做NAT轉送，但是這樣就失去IPv6的意義了。
通常是對IPv6不懂的人，或是懶惰沒有架站需求只想簡單設定並讓所有人可以上IPv6網站。


## 我家網路設計：雙LAN雙WAN
因應上述的優缺點，在綜合考量下採取雙WAN設計。

我規劃出兩個網段

雙WAN
