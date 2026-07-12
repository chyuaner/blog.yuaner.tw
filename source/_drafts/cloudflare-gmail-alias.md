---
title: 將Gmail以你的自有域名信箱地址收發信（使用Cloudflare轉送站）
title_br: "將Gmail以你的自有域名信箱地址收發信<br>（使用Cloudflare轉送站）"
cover: brave_screenshot_mail.google.com.png
categories: Cloudflare
tags:
  - Cloudflare
  - Gmail
toc: true
show_copyright: true
copyright_notice_template: >-
  本篇依據 <a rel="license nofollow" target="_blank"
  href="https://creativecommons.org/licenses/by-sa/4.0/deed.zh-hant">CC BY-SA
  4.0 姓名標示-相同方式分享</a> 授權釋出。
---

目前我主要的Email都是使用Gmail，對外也都是給我的gmail信箱地址，想說直接用gmail地址是最省事也是最穩的。
不過有些網站註冊會有特殊需求，得用自己準備的域名，或是有時候會有工作需求需要使用自己的Gmail信箱卻要以工作用的Email地址發出。
而且有時候可能因為網站管理需要，或是綁定外部雲端服務實需要有一個看起來正式的地址像是：
* no-reply@yuaner.tw
* admin@yuaner.tw

{% asset_img "brave_screenshot_mail.google.com.png" "以自有域名的alias發信" %}

如果想省事不要另外自己架設Mail Server，但又有需要用自有域名的需求，最省事的方式就是直接利用Cloudflare免費提供的電子郵件轉送服務。

## Step1. 將你的域名加入DNS紀錄綁定到Cloudflare轉送服務

如果你的域名已經託管在 Cloudflare，請依照以下步驟啟用電子郵件轉送：

1. 登入 [Cloudflare 控制台](https://dash.cloudflare.com/)，選擇你的網域。
2. 在左側選單中，點選「電子郵件（Email）」>「電子郵件路由（Email Routing）」。
3. 點選「啟用電子郵件路由（Enable Email Routing）」。
4. 系統會偵測到你尚未設定相關的 DNS 紀錄。Cloudflare 會提示你需要新增幾筆 `MX` 紀錄與一筆用於防止垃圾郵件的 `TXT` (SPF) 紀錄。
5. 點選「自動新增紀錄（Add records automatically）」按鈕，Cloudflare 將會自動為你在 DNS 中設定好所有必需的紀錄，非常方便。

{% asset_img "Screenshot 2026-07-12 at 14-43-37 DNS 記錄 yuaner.tw chyuaner Cloudflare.png" "設置MX DNS" %}

## Step2. 設置 Cloudflare Email Routing 

### Step2-1. 設置「目的位址」

目的位址（Destination addresses）是指當 Cloudflare 收到寄給你的自訂網域信箱時，要將信件轉寄到哪一個真實存在的電子信箱（在此我們設定為你的 Gmail）。

1. 在「電子郵件路由」頁面中，切換到「目的位址（Destination addresses）」分頁。
2. 點選「新增目的位址（Add destination address）」。
3. 輸入你平常用的 Gmail 信箱地址，然後點選「儲存」。
4. 此時 Cloudflare 會向該 Gmail 發送一封驗證信。請到你的 Gmail 收件匣，尋找主旨為 `[Cloudflare] Please verify your email address` 的郵件，並點擊信中的驗證連結。
5. 驗證完成後，該地址的狀態會顯示為「已驗證（Verified）」。

{% asset_img "Screenshot 2026-07-12 at 14-53-02 電子郵件服務 電子郵件路由 chyuaner Cloudflare.png" "CF-目的位址" %}

### Step2-2. 設置「路由規則」

有了驗證過的目的位址後，我們就可以設定自訂域名的信箱別名（例如 `admin@yourdomain.com`）要轉寄到哪裡。

1. 切換到「路由規則（Routing rules）」分頁，點選「建立規則（Create rule）」。
2. 在「自訂位址」輸入你想要使用的信箱前綴（例如 `admin`，這樣一來你的自訂信箱就是 `admin@yourdomain.com`）。
3. 在「動作」欄位選擇「傳送到（Send to）」，並在「目的位址」中選擇剛才驗證通過的 Gmail 地址。
4. 點選「儲存」。
*(提示：你也可以在下方啟用「全部擷取（Catch-all）」規則，如此一來，任何寄到你網域但沒有設定規則的信箱（例如隨便編的 `anything@yourdomain.com`），都會被自動轉寄到你的 Gmail 中。)*

{% asset_img "Screenshot 2026-07-12 at 14-53-22 電子郵件服務 電子郵件路由 chyuaner Cloudflare.png" "CF-路由規則" %}

## Step3. 使用Gmail自帶的SMTP伺服器來寄送郵件

完成 Cloudflare 的 Email Routing 設定後，你已經可以順利「接收」信件了。但是如果你直接用 Gmail 回信，寄件人依然會顯示原本的 `@gmail.com` 帳號。
為了能以自訂域名地址發送信件，我們必須在 Gmail 中設定「選擇寄件地址」，利用 Gmail 內建的 SMTP 伺服器來幫我們代發信件。由於是經由 Google 的官方伺服器寄出，這樣不但安全，而且信件幾乎不會被收件端判為垃圾郵件。

### Step3-1. 新增「Google應用程式密碼」（稍後在設置Gmail別名會用到）

因為 Google 帳戶的安全性防護（特別是啟用了兩步驟驗證之後），一般的 Google 登入密碼是無法直接在 Gmail SMTP 設定中使用的。我們需要特別為這個 SMTP 代發功能產生一組專屬的「應用程式密碼」。

1. 前往你的 Google 帳戶安全性設定，或直接點選此連結：[Google應用程式密碼](https://myaccount.google.com/apppasswords)。*(注意：你的 Google 帳戶必須先啟用「兩步驟驗證」才能建立應用程式密碼。)*
2. 在「應用程式名稱」輸入一個好記的名稱（例如：`Google SMTP`）。
3. 點選「建立」。
4. 系統會顯示一個包含 **16 字元（黃色背景）** 的應用程式密碼。請將其複製並妥善保存（稍後設定時會用到，視窗關閉後就無法再次查看此密碼，若遺失只能刪除並重新產生）。

{% asset_img "brave_screenshot_myaccount.google.com.png" "Google應用程式密碼" %}

### Step3-2. 設置「選擇寄件地址」

現在我們要回到網頁版 Gmail 中，將自訂域名信箱新增為寄件別名：

1. 登入 Gmail，點選右上角的齒輪圖示，然後選擇「查看所有設定」。
2. 切換到「帳戶和匯入（Accounts and Import）」分頁。

{% asset_img "brave_screenshot_setting_mail.google.com.png" "Gmail設定" %}

#### 在「新增另一個電子郵件地址」部份

1. 尋找「選擇寄件地址（Send mail as）：」區塊，點選「新增另一個電子郵件地址（Add another email address）」。
2. 彈出設定視窗後，請輸入以下資訊：
   * **姓名**：你希望收件者看到的寄件人名稱（例如：你的名字或網站名稱）。
   * **電子郵件地址**：填入你的自訂域名信箱（例如：`admin@yourdomain.com`）。
3. 點選「下一步」。

接下來，在視窗中填入以下 SMTP 伺服器連線資訊：

* **SMTP 伺服器**：`smtp.gmail.com`
* **通訊埠**：`587`
* **使用者名稱**：輸入你原本完整的 Google 帳號主信箱（必須包含 `@gmail.com`）。
* **密碼**：貼上剛才產生的 **16 字元 Google 應用程式密碼**（注意：請勿包含空格）。
* 勾選「**採用 TLS 的加密連線（建議）**」。
* 點選「新增帳戶」。

{% asset_img "Screenshot 2026-07-12 at 14-58-15 Gmail - 編輯電子郵件地址.png" "「新增另一個電子郵件地址」關鍵資訊" %}

此時，Gmail 會發送一封包含確認碼的電子郵件到你剛新增的自訂域名信箱。因為我們已經在 Cloudflare 設定好了轉送規則，這封驗證信會在幾秒鐘內轉寄到你的 Gmail 收件匣中。
請打開信件，複製裡面的驗證碼貼回設定視窗，或者直接點選信中的驗證連結完成驗證。

## Step4.  大功告成！測試！

設定完成後，現在你可以測試看看是否能正常以自訂域名發信了：

1. 在 Gmail 中點選「撰寫」新信件。
2. 在「寄件者」欄位，點選下拉選單，你應該能看到並選擇剛剛新增的自訂域名信箱。
3. 試著寄一封信到你的另一個信箱，並檢查收件匣中顯示的寄件人名稱與地址是否完全正確，且能順利收信。
