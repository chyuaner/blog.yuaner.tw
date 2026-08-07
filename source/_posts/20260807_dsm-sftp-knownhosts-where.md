---
title: Synology DSM透過SFTP掛載遠端資料夾時，known_hosts 的儲存位置
cover: Screenshot 2026-08-07 at 15-24-21 Chiu-NAS - Synology DiskStation.png
categories: Synology
tags:
  - Synology
toc: true
show_copyright: true
copyright_notice_template: >-
  本篇依據 <a rel="license nofollow" target="_blank"
  href="https://creativecommons.org/licenses/by-sa/4.0/deed.zh-hant">CC BY-SA
  4.0 姓名標示-相同方式分享</a> 授權釋出。
date: 2026-08-07 20:43:51
---


## 前言
我目前的主機規劃是：NAS主機和其他重要主機都會放置在同一個區域網路內，然後用內網IP地址互相直連。如果有傳檔案需求，我會利用sftp掛載其他主機到這台NAS，然後就可以透過DSM管理與跨主機互傳檔案。

## 以 SFTP 掛載遠端資料夾的步驟：

在 Synology DSM 的 File Station 中，提供了非常方便的「遠端連線」功能，讓我們可以直接透過 SFTP 協議將其他主機（例如另一台 Linux 伺服器、VPS 或 NAS）的資料夾掛載到這台 NAS 上。掛載成功後，我們就能像管理本地資料夾一樣，直接在 DSM 網頁介面上進行跨主機的檔案拖曳與管理。

1. **開啟 File Station**：登入 DSM 後，打開 **File Station**。
2. **開啟連線精靈**：點選上方選單的 **「工具」** > **「遠端連線」** > **「連線設定」**（或直接點選 **「SFTP」**）。
    {% asset_img "Screenshot 2026-07-12 at 13-56-51 Chiu-NAS - Synology DiskStation.png" "DSM FileStation選單" %}
3. **選擇協定**：在安裝精靈中，選擇 **「SFTP」** 並點選下一步。
    {% asset_img "Screenshot 2026-07-12 at 13-57-08 Chiu-NAS - Synology DiskStation.png" "DSM FileStation選擇連線方式" %}
4. **填入連線資訊**：
   * **主機名稱或 IP 位址**：輸入遠端主機的 IP（例如 `192.168.1.30`）或域名。
   * **通訊埠**：SFTP 預設為 `22`（若遠端主機有自訂 SSH 埠號，請修改為對應的埠號）。
   * **使用者名稱**：遠端主機的登入帳號。
   * **密碼**：遠端主機的登入密碼（較新版的 DSM 也支援上傳私鑰進行驗證）。
   * **掛載路徑**：選擇掛載後要顯示在 NAS 的哪一個共享資料夾或子目錄下。
   * **設定顯示名稱**：為此遠端資料夾設定一個在 File Station 中顯示的名稱。
    {% asset_img "Screenshot 2026-07-12 at 13-58-05 Chiu-NAS - Synology DiskStation.png" "DSM FileStation填入主機連線方式" %}
5. **儲存並連線**：點選「套用」或「連線」。此時 DSM 會向遠端主機發起連線，如果這是第一次連線，系統會提示您接受該主機的 SSH 金鑰指紋（Host Key Fingerprint），點選確認後即可完成掛載。

## 本文重點！那 `known_hosts` 到底在哪裡？
當您更換了遠端主機但設定了相同的 IP 時，新主機的 **SSH 金鑰指紋（Host Key Fingerprint）** 已與舊主機不同。由於 `known_hosts` 中仍記錄著該 IP 舊的金鑰，DSM 為了防止中間人攻擊（MITM），會拒絕建立連線並報錯，這會直接導致您在 File Station 中設定好的遠端資料夾無法正常掛載。

在 Synology DSM 環境中，File Station 的「遠端連線」（例如透過 SFTP 掛載遠端資料夾）所使用的 `known_hosts` 檔案是**以使用者 UID 分開儲存**的。

它的具體存放路徑為：
```text
/usr/syno/etc/synovfs/<UID>/sftp/known_hosts
```
*其中 `<UID>` 是您在 DSM 系統中的使用者 ID。*

{% asset_img "Screenshot_20260712_022548.png" "known_hosts放置處" %}

## 如何解決這個問題？

您可以透過以下兩種方式清除舊的金鑰紀錄：

### 方式 A：使用命令列工具清除
您可以透過 SSH 登入您的 Synology NAS，並執行以下指令來自動移除該 IP 的舊紀錄（請將 `<IP>` 替換為您的遠端主機 IP）：

```bash
ssh-keygen -f /usr/syno/etc/synovfs/<UID>/sftp/known_hosts -R <遠端主機IP>
```
*例如，若遠端主機 IP 為 `192.168.1.30`：*
```bash
ssh-keygen -f /usr/syno/etc/synovfs/<UID>/sftp/known_hosts -R 192.168.1.30
```
執行後，系統會自動在該檔案中刪除對應的舊金鑰紀錄，並產生一個 `.old` 的備份檔。

### 方式 B：直接編輯檔案（我比較習慣手動處理的方式）
因為 `known_hosts` 是純文字檔，您也可以直接編輯它：
1. 透過 SSH 登入 NAS。
2. 使用文字編輯器（如 `vim` 或 `nano`）開啟此檔案。
3. 找到以該遠端 IP 開頭的那一行，將整行刪除並存檔即可。

清除舊金鑰後，再次回到 File Station 重新連線或掛載該遠端資料夾，系統便會提示您重新確認並接受新的金鑰指紋，即可恢復正常掛載。

## 附錄：我要怎麼尋找 `known_hosts` 在哪裡？
你可以透過以下指令，在以下比較有可能的地方進行搜尋
```bash
find /etc /root /var/services/homes -name "*known_hosts*" 2>/dev/null || true
find /volume1 -name "*known_hosts*" 2>/dev/null || true
find /usr /var -name "*known_hosts*" 2>/dev/null || true
```
