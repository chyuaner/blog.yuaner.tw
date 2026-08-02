---
title: 架設Forgejo Git Server 在Synology(Docker)
cover:
categories:
tags:
toc: true
show_copyright: true
copyright_notice_template: >-
  本篇依據 <a rel="license nofollow" target="_blank"
  href="https://creativecommons.org/licenses/by-sa/4.0/deed.zh-hant">CC BY-SA
  4.0 姓名標示-相同方式分享</a> 授權釋出。
---

雖然我現在大部分的專案程式碼都放在Github，不過有些特殊需求、內部需求，以及有些比較敏感隨時都可能被Github下架的東西，也需要找自己的地方備份，所以我還是有自行架設Git Server需求。

我目前的規劃是所有Docker相關的東西，都放在`/volume1/docker/`裡，所以本次會新增兩個Docker主專案，分別為：
* `/volume1/docker/forgejo`: 主要最重要的Git Server
* `/volume1/docker/forgejo-runner`: 跑CI這種自動建置環境

# ☕ 架設基本的Forgejo Server：Git Server主服務

## Step 1. 建立forgejo資料夾
建立 /volume1/docker/forgejo 資料夾以後，還要建立子資料夾`forgejo`當作資料區，檔案結構如下：
```
 /volume1/docker/forgejo
├──  docker-compose.yml
└──  forgejo
    ├──  git （自動產生）
    ├──  gitea （自動產生）
    └── 󰢬 ssh （自動產生）
```

## Step 2. 編輯 `docker-compose.yml`

然後在`docker-compose.yml`內容參考一下範例，基本上是從Forgejo官方教學抄過來，不過還是有一些地方有根據我的需求調整：

* 補上version宣告
* 在Synology環境需要特別指定檔案的權限`USER_UID`、`USER_GID`
* 指定SSH協定（在git clone、git push等用途會用到）要用的Port設置在10022（與本機的預設SSH Port 22避開）

```yml docker-compose.yml
version: '3.8'

networks:
  forgejo:
    external: true

services:
  server:
    image: codeberg.org/forgejo/forgejo:16
    container_name: forgejo
    environment:
      - USER_UID=1027
      - USER_GID=100
    restart: always
    networks:
      - forgejo
    volumes:
      - ./forgejo:/data
      - /etc/localtime:/etc/localtime:ro
    ports:
      - "3000:3000"
      - "10022:22"
```

## Step 3. 綁定網址與Reverse Proxy

## Step4. 啟動 Git 服務
```bash
cd /volume1/docker/forgejo
sudo docker-compose up -d
```

# 🚀 Synology DSM 架設Forgejo Runner

由於 Synology DSM 的 Linux 核心（Kernel）經過高度客製化，在使用預設的 Docker-in-Docker (DinD) 架設 CI/CD 執行器時，會遇到諸多**權限、虛擬檔案系統、以及防火牆核心模組（iptables）缺失**的坑。

## 架構說明
我們採用官方推薦的 **Docker-in-Docker (DinD)** 架構。一共會有三個服務：
1. **Forgejo Server**：Git 主服務。
2. **docker-in-docker (dind)**：提供獨立的 Docker 守護行程，專門用來執行 Workflow 任務容器。
3. **Forgejo Runner**：常駐在背景輪詢工作，並指派給 dind 執行。

---

## 🛠️ Step1. 主機準備與權限設定

在 Synology NAS 上，為防權限錯亂，建議使用您平常登入的 SSH 使用者帳號來建立資料夾。

1. **取得您的 UID 與 GID**  
   使用 SSH 登入 NAS，輸入 `id` 指令取得您的使用者 ID（UID，通常為 `1027`）與群組 ID（GID，通常為 `100` / `users`）。
2. **建立 Runner 資料夾**
   ```bash
   mkdir -p /volume1/docker/forgejo-runner
   ```

---

## 📝 Step2. Forgejo Server 設定 (`app.ini`)

編輯在 Git Server主服務中的 Forgejo 設定檔（`/volume1/docker/forgejo/forgejo/gitea/conf/app.ini`），加入/修正以下設定：

```ini
[actions]
ENABLED = true

[repository]
; 避坑指南：避免備份至 Forgejo 的 GitHub 專案一上傳就自動觸發 Actions 浪費效能
; 排除 repo.actions 後，新專案預設不啟用 Actions。若有專案要跑 Actions 再進網頁手動勾選開啟即可。
DEFAULT_REPO_UNITS = repo.code,repo.releases,repo.issues,repo.pulls,repo.wiki,repo.projects,repo.packages
```

---

## 🐳 Step3. 撰寫 `docker-compose.yml`

在 `/volume1/docker/forgejo-runner/` 目錄下建立並編輯 `docker-compose.yml`：

```yaml docker-compose.yml
version: '3.8'

networks:
  forgejo:
    external: true

services:
  # 避坑關鍵 1：此服務提供任務容器的 Docker 執行環境
  docker-in-docker:
    image: docker:25-dind  # 避坑關鍵 2：必須降版至 25，因為 26+ 版本依賴的 iptables raw 表在 Synology 核心中不存在
    container_name: forgejo-dind
    privileged: true       # 必須開啟特權模式
    environment:
      - DOCKER_TLS_CERTDIR=
    # 避坑關鍵 3：加上 --tls=false 禁用 TLS，以避開 Docker 故意延遲 15 秒啟動的警告機制
    # 避坑關鍵 4：加上 --storage-driver=vfs，因為 Synology 核心不允許在巢狀容器中掛載 overlay/overlay2
    command: ["dockerd", "--host=tcp://0.0.0.0:2375", "--tls=false", "--storage-driver=vfs"]
    restart: unless-stopped
    networks:
      - forgejo

  runner:
    image: code.forgejo.org/forgejo/runner:12
    container_name: forgejo-runner
    restart: unless-stopped
    user: "1027:100"       # 避坑關鍵 5：對應您的 UID/GID，防止產生的產物出現 root 權限無法讀寫的問題
    depends_on:
      docker-in-docker:
        condition: service_started
    environment:
      - DOCKER_HOST=tcp://docker-in-docker:2375
    volumes:
      - ./runner:/data
      - /etc/localtime:/etc/localtime:ro
    networks:
      - forgejo
    command: forgejo-runner daemon --config /data/config.yml
```

---

## ⚙️ Step4. 產生與調整 Runner 設定檔


1. **產生預設設定檔**：
   ```bash
   docker run --rm \
     -v /volume1/docker/forgejo-runner:/data \
     code.forgejo.org/forgejo/runner:12 \
     forgejo-runner generate-config > /volume1/docker/forgejo-runner/config.yml
   ```
2. **編輯產生的 `/volume1/docker/forgejo-runner/config.yml`**：
   * **允許掛載工作目錄**：
     ```yaml
     container:
       valid_volumes:
         - '/data'
     ```
   * **解決任務容器 DNS 無法解析 Gitea/Forgejo 網址的問題（避坑關鍵 5）**：
     預設情況下，`dind` 內部建立的建置容器無法解析外層自訂網路上的 `forgejo` 容器名稱。將網路模式改為 `"host"`，使執行任務的容器直接共享 `dind` 容器的網路空間，便可直接解析 `forgejo`：
     ```yaml
     container:
       network: "host"
     ```

---

## 🔑 Step5. 向 Forgejo 伺服器註冊 Runner

1. 登入您的 Forgejo 網頁，進入 **網站管理 > Actions > 執行器 (Runners)**。
2. 點手動 **建立新的執行器** 並複製產生的 **Token**。
3. 在 NAS 的 SSH 中執行以下註冊指令（**避坑關鍵 6：務必指定 `--user` 與 `--workdir` 以免產生權限錯誤**）：
   ```bash
   sudo docker run --rm -it \
     -v /volume1/docker/forgejo-runner:/data \
     --user "1027:100" \
     --workdir /data \
     --network forgejo \
     code.forgejo.org/forgejo/runner:12 \
     forgejo-runner register \
     --instance http://forgejo:3000 \
     --token <您的_TOKEN> \
     --no-interactive \
     --name synology-runner \
     --labels "ubuntu-latest:docker://node:20-bookworm,ubuntu-22.04:docker://node:20-bookworm"
   ```
   *(註冊完成後，系統會自動在 `/volume1/docker/forgejo-runner/` 目錄下寫入 `.runner` 憑證檔)*
---

## 🏃 Step6. 啟動服務與驗證

1. **啟動 Runner 與 DinD 服務**：
   ```bash
   cd /volume1/docker/forgejo-runner
   sudo docker-compose up -d
   ```
2. **驗證在線狀態**：
   回到 Forgejo 網頁後台的 **執行器 (Runners)** 頁面，`synology-runner` 應該會顯示為綠色的 **Idle** 在線狀態。
3. **執行測試工作流**：
   建立一個測試專案，並在 `.forgejo/workflows/test.yml` 放入以下內容並 Push 即可完成驗證：
   ```yaml
   name: Runner Test
   on: [push]
   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - run: |
             echo "恭喜！群暉 NAS 上的獨立 Runner 與 DinD 連接運作完全正常！"
             node -v
   ```
