---
title: 將Synology NAS主機以DDNS綁定到Cloudflare代管
cover: cover.png
categories: Synology
tags:
  - Synology
  - DDNS
  - Cloudflare
toc: true
show_copyright: true
copyright_notice_template: >-
  本篇依據 <a rel="license nofollow" target="_blank"
  href="https://creativecommons.org/licenses/by-sa/4.0/deed.zh-hant">CC BY-SA
  4.0 姓名標示-相同方式分享</a> 授權釋出。
date: 2026-07-09 18:50:44
---


現在我的 yuaner.tw 主域名是給Cloudflare管理，然後我有幾個重要網站服務就是從我的NAS主機提供的。
我的Synology NAS是放在家裡，並以PPPoE方式獨立對外連線。因為家用的中華電信光世代只提供一個固定IP（而且還要另外申請），所以我還是會以DDNS方式拿到當前IP以後再自動重新綁到我的Cloudflare DNS管理商。
{% asset_img "cover.png" "Cover" %}


## DDNS綁定到Cloudflare DNS代管商
Cloudflare 官方本身其實沒有像 No-IP、DynDNS 或 Synology DDNS 那樣，提供一個專屬、獨立的 DDNS 服務或官方的 DDNS 用戶端軟體。
現今網路上所有將 Cloudflare 作為 DDNS 使用的方法，本質上都是「利用 Cloudflare 的 DNS API 曲線救國」，包含本次腳本也是。以下就是介紹使用這個腳本安裝的教學說明：

### 1. 建立Cloudflare API Key
1. 登入 [Cloudflare Dashboard](https://dash.cloudflare.com/)。
2. 點擊右上角的頭像，選擇 **My Profile** (設定檔)。
3. 在左側選單中，點擊 **API Tokens** 。
4. 點擊 **Create Token** (建立 Token)。
5. 在 API 權杖範本 找到 **編輯區域 DNS**，點擊右側的 **使用範本**。
6. 設定**權杖名稱**取一個你容易日後辨認的名稱（例如：`Synology-DDNS`）。
7. 在 **Permissions** (權限) 區塊設定以下權限：
   * **Zone** (區域) -> **DNS** -> **Edit** (編輯)
8. 在 **Zone Resources** (區域資源) 區塊，限制權限範圍：
   * **Include** -> **Specific zone** (特定區域) -> 選擇您的網域（例如：`yuaner.tw`）
9. 點擊最下方的 **Continue to summary** (繼續前往摘要)。
10. 確認設定無誤後，點擊 **Create Token** (建立權杖)。

{% asset_img "Screenshot 2026-07-09 at 17-34-00 API 權杖 Cloudflare.png" "Cloudflare 建立Token" %}


11. **複製產生的 API Token**（此 Token 只會顯示一次，請妥善保存，稍後在 Synology 設定時填入「密碼/金鑰」欄位）。

### 2. 在 Cloudflare DNS 新增空的紀錄
請先到 Cloudflare Dashboard→DNS→紀錄 新增對應的兩筆DNS紀錄，分別：
* 類型 `A`（IPv4用）：`127.0.0.1`
* 類型 `AAAA`（IPv6用）：`::1`

{% asset_img "Screenshot 2026-07-09 at 16-21-01 DNS 記錄 yuaner.tw chyuaner Cloudflare.png" "Cloudflare DNS新增兩筆紀錄" %}

雖然範例中的IP都是本機IP，不過稍後DDNS生效後，就會置換成當前真實的公網IP了，請按照下面步驟繼續。

### 3. 安裝SynologyCloudflareDDNS腳本到Synology DSM
我的腳本有公開放在Github，不過如果只是要使用的話，可以直接參考從下面的步驟照著做就行。如果對於這個腳本想知道細節的話，[可看我的後述](#%E9%97%9C%E6%96%BCSynologyCloudflareDDNS%E8%85%B3%E6%9C%AC)。

1. 在 Synology NAS 的網頁介面中，從套件中心安裝 `Python 3`。
2. 啟用 SSH 連線並登入您的 NAS。
3. 為 Python 3 安裝 `pip`，接著安裝此套件：

```
sudo python3 -m ensurepip
sudo python3 -m pip install --upgrade pip setuptools
sudo python3 -m pip install "git+https://github.com/chyuaner/SynologyCloudflareDDNS.git"
```

### 4. 設定到 Synology DSM
請編輯 `/etc.defaults/ddns_provider.conf` 在檔案末端加上以下文字，將此腳本整合到 Synology 的 DDNS 管理介面中：

```
[Cloudflare]
        modulepath=/bin/synology_cloudflare_ddns
        queryurl=https://www.cloudflare.com/
```

接著前往 NAS 網頁介面的 DDNS 管理頁面（控制台 -> 外部存取 -> DDNS）。
點選「新增」，在「服務供應商」下拉選單中選擇「Cloudflare」，並填寫三個必要欄位：
- 主機名稱：就是你要設置的完整域名（子域名包含後綴域名）
- 使用者名稱：填Cloudflare帳號的主Email
- 密碼：填你[剛剛建立的 Cloudflare API Token](#1.%20%E5%BB%BA%E7%AB%8BCloudflare%20API%20Key)。

{% asset_img "Screenshot 2026-07-09 at 15-58-24 Chiu-NAS - Synology DiskStation.png" "在DNS設置" %}

雖然在DSM UI介面沒有出現「外部位址(IPv6)」，是因為受限於原生DSM DDNS介面設計，沒開放給第三方DDNS提供商顯示IPv6的相關欄位，不過我的腳本在實際套用時，會自動抓取公網IPv6位址，若成功抓取到就會一併把IPv6也更新上去。

設定完成以後，接著即可測試您的 DDNS IP 是否已成功在您的 Cloudflare 頁面上更新🎉。

## 關於SynologyCloudflareDDNS腳本
我之前也有長期使用過[joshuaavalon/SynologyCloudflareDDNS](https://github.com/joshuaavalon/SynologyCloudflareDDNS)腳本來處理，但作者從3年前就沒再維護，也明確標「This repository was archived」了，所以本次我改用[butlerx/SynologyCloudflareDDNS](https://github.com/butlerx/SynologyCloudflareDDNS)，但實際發現IPv6也沒有正確對應到。

最後我是動用Gemini AI幫我以這個腳本為基礎，修改成支援 IPv6 自動偵測與雙棧聯動更新、保留 Cloudflare 原有的橘雲開關。

{% link_preview https://github.com/chyuaner/SynologyCloudflareDDNS %}
Github: chyuaner/SynologyCloudflareDDNS
{% endlink_preview %}

## 其他比較適合新手的DDNS綁定方式
### QuickConnect
適合新手，但是不能綁定自己準備的域名，而且有可能會走中繼代理模式線路會經過他們的伺服器導致連線品質受限。

### Synology自帶的DDNS服務 （也是曾經是我長期的方案）
利用Synology自家的DDNS服務，先綁定到Synology提供的網址，然後我在Clodflare DNS管理那邊設置CNAME，如下圖：
{% asset_img "Screenshot 2026-07-09 at 07-41-49 Chiu-NAS - Synology DiskStation.png" "在DNS設置" %}

然後在Cloudflare DNS紀錄 那邊設置：
{% asset_img "Screenshot 2026-07-09 at 07-23-36 DNS 記錄 yuaner.tw chyuaner Cloudflare.png" "Cloudflare DNS新增紀錄" %}

但長期用下來，發現穩定性沒有預期的好，而且Synology那邊似乎有快取導致有些設定沒有即時更新到，不利於測試，尤其是IPv6好像很常沒有對應上。

所以最後我決定用[Cloudflare DDNS直接更新](#3.%20%E5%AE%89%E8%A3%9DSynologyCloudflareDDNS%E8%85%B3%E6%9C%AC%E5%88%B0Synology%20DSM)不經由Synology伺服器的方案了。
