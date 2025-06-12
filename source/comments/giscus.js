(() => {
    const loadComments = async () => {
        // Giscus 留言系統主程式 ------------------------------------------------------
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
        script.setAttribute('data-emit-metadata', '0');
        script.setAttribute('data-input-position', 'bottom');
        script.setAttribute('data-theme', 'preferred_color_scheme');
        script.setAttribute('data-lang', 'zh-TW');
        script.setAttribute('crossorigin', 'anonymous');
        script.setAttribute('async', '');

        giscusContainer.appendChild(script);

        // 自行 Patch Giscus 留言數量 ------------------------------------------------
        const pathname = window.location.pathname.replace(/^\/|\/$/g, '') + '/'; // 去除前後斜線，保持 Giscus 格式
        const repo = "chyuaner/blog.yuaner.tw"; // 你的 GitHub repo
        const category = "Blog Comments"; // 你的 category 名稱

        const url = `https://giscus.app/api/discussions?repo=${encodeURIComponent(repo)}&term=${encodeURIComponent(pathname)}&category=${encodeURIComponent(category)}&number=0&strict=false&last=1`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                const count = data.discussion?.totalCommentCount ?? 0;
                document.getElementById("giscus_count").textContent = count;
            })
            .catch(() => {
                document.getElementById("giscus_count").textContent = "f";
            });
    };

    // 自動載入---------------------------------------------------------------------
    window.loadComments = loadComments;
    window.addEventListener('pjax:success', () => {
        window.loadComments = loadComments;
    });
})();
