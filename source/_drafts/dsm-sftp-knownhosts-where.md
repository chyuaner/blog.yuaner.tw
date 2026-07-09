---
title: Synology DSM透過SFTP掛載遠端資料夾時，known_hosts 的儲存位置
cover:
categories:
tags:
---

Used tool: list_permissions
Searched web: "Synology mount remote folder sftp known_hosts location"
Searched web: "Synology File Station sftp mount known_hosts OR host key"
Searched web: "群暉 file station sftp known_hosts"
Searched web: "Synology "Mount Remote Folder" SFTP OR "掛載遠端資料夾" SFTP"
Searched web: "site:community.synology.com known_hosts sftp OR ssh"
Searched web: "synology file station "known_hosts""
Searched web: "dsm file station sftp known_hosts OR "host key""
Searched web: "synology sftp "known_hosts" path OR "/var/packages/FileStation""
Ran command: `find /etc /root /var/services/homes -name "*known_hosts*" 2>/dev/null || true`
Ran command: `find /volume1 -name "*known_hosts*" 2>/dev/null || true`
Used tool: manage_task
Searched web: "Synology sftp mount configuration file OR location OR path"
Searched web: "synology "掛載遠端資料夾" "SFTP" OR "遠端連線" "金鑰" OR "金鑰已變更""
Used tool: manage_task
Searched web: "synology file station sftp "StrictHostKeyChecking" OR "host key verification""
Used tool: manage_task
Ran command: `find /usr /var -name "*known_hosts*" 2>/dev/null || true`
Searched web: "synology sftp known_hosts path OR location site:reddit.com"
Searched web: "site:community.synology.com "File Station" SFTP "known_hosts" OR "host key" OR "fingerprint""
Used tool: manage_task
Viewed task-39.log:1-3
Ran command: `ls -la /usr/syno/etc/synovfs/ /usr/syno/etc/synovfs/1027/sftp/ || true`
Viewed known_hosts:1-12
Used tool: manage_task
Used tool: manage_task

在 Synology DSM 環境中，File Station 的「遠端連線」（例如透過 SFTP 掛載遠端資料夾）所使用的 `known_hosts` 檔案是**以使用者 UID 分開儲存**的。

它的具體存放路徑為：
```text
/usr/syno/etc/synovfs/<UID>/sftp/known_hosts
```
*其中 `<UID>` 是您在 DSM 系統中的使用者 ID。*

以您目前登入的使用者 `yuan`（UID 為 `1027`）為例，該設定檔位於：
👉 [known_hosts](file:///usr/syno/etc/synovfs/1027/sftp/known_hosts)

---

### 為什麼會出錯？
當您更換了遠端主機但設定了相同的 IP 時，新主機的 **SSH 金鑰指紋（Host Key Fingerprint）** 已與舊主機不同。由於 `known_hosts` 中仍記錄著該 IP 舊的金鑰，DSM 為了防止中間人攻擊（MITM），會拒絕建立連線並報錯，這會直接導致您在 File Station 中設定好的遠端資料夾無法正常掛載。

### 如何解決這個問題？

您可以透過以下兩種方式清除舊的金鑰紀錄：

#### 方法 1：使用命令列工具清除（推薦，最安全快速）
您可以透過 SSH 登入您的 Synology NAS，並執行以下指令來自動移除該 IP 的舊紀錄（請將 `<IP>` 替換為您的遠端主機 IP）：

```bash
ssh-keygen -f /usr/syno/etc/synovfs/1027/sftp/known_hosts -R <遠端主機IP>
```
*例如，若遠端主機 IP 為 `192.168.1.30`：*
```bash
ssh-keygen -f /usr/syno/etc/synovfs/1027/sftp/known_hosts -R 192.168.1.30
```
執行後，系統會自動在該檔案中刪除對應的舊金鑰紀錄，並產生一個 `.old` 的備份檔。

#### 方法 2：直接編輯檔案
因為 [known_hosts](file:///usr/syno/etc/synovfs/1027/sftp/known_hosts) 是純文字檔，您也可以直接編輯它：
1. 透過 SSH 登入 NAS。
2. 使用文字編輯器（如 `vi` 或 `nano`）開啟此檔案。
3. 找到以該遠端 IP 開頭的那一行，將整行刪除並存檔即可。

清除舊金鑰後，再次回到 File Station 重新連線或掛載該遠端資料夾，系統便會提示您重新確認並接受新的金鑰指紋，即可恢復正常掛載。
