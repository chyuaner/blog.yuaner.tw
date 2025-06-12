(() => {
    const loadComments = async () => {
        const giscusContainer = document.getElementById('giscus_container');
        if (!giscusContainer) return;

        // 清空 iframe
        while (giscusContainer.firstChild) {
            giscusContainer.removeChild(giscusContainer.firstChild);
        }

        // 重建 script
        const script = document.createElement('script');
        script.src = 'https://giscus.app/client.js';
        script.setAttribute('data-repo', 'chyuaner/blog.yuaner.tw');
        script.setAttribute('data-repo-id', 'R_kgDOO5dOzg');
        script.setAttribute('data-category', 'Blog Comments');
        script.setAttribute('data-category-id', 'DIC_kwDOO5dOzs4CrZ46');
        script.setAttribute('data-mapping', 'pathname');
        script.setAttribute('data-strict', '0');
        script.setAttribute('data-reactions-enabled', '1');
        script.setAttribute('data-emit-metadata', '1'); // ← 要開啟這個功能
        script.setAttribute('data-input-position', 'bottom');
        script.setAttribute('data-theme', 'preferred_color_scheme');
        script.setAttribute('data-lang', 'zh-TW');
        script.setAttribute('crossorigin', 'anonymous');
        script.setAttribute('async', '');

        giscusContainer.appendChild(script);
        
        // 在文章頁面顯示留言數量功能
        window.addEventListener("message", function giscusMetadataListener(event) {
            if (event.origin !== "https://giscus.app") return;
            const data = event.data;
            if (data?.giscus?.discussion?.totalCommentCount !== undefined) {
                // 有留言數據
                const count = data.giscus.discussion.totalCommentCount;
                const countElem = document.getElementById("giscus_count");
                if (countElem) countElem.textContent = count;
            } else if (data?.giscus?.error === "Discussion not found") {
                // 討論串不存在，視同留言數0
                const countElem = document.getElementById("giscus_count");
                if (countElem) countElem.textContent = "0";
            }
        });
    };

    // 載入＆pjax 重新掛載
    window.loadComments = loadComments;
    window.addEventListener('pjax:success', () => {
        window.loadComments = loadComments;
    });
})();
