import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js';
import {
getDatabase, ref, get, set, child,
// eslint-disable-next-line import/no-unresolved
} from 'https://www.gstatic.com/firebasejs/9.8.3/firebase-database.js';

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
            // console.log(data);
            if (data?.giscus?.discussion?.totalCommentCount !== undefined) {
                // 有留言數據
                const comment = data.giscus.discussion.totalCommentCount;
                const reply_count = data.giscus.discussion.totalReplyCount;
                const count = comment + reply_count;
                const countElem = document.getElementById("giscus_count");
                if (countElem) countElem.textContent = count;
            } else if (data?.giscus?.error === "Discussion not found") {
                // 討論串不存在，視同留言數0
                const countElem = document.getElementById("giscus_count");
                if (countElem) countElem.textContent = "0";
            }
        });

        // 顯示觀看次數相關
        // The web app's Firebase configuration
        // For Firebase JS SDK v7.20.0 and later, measurementId is optional
        const firebaseConfig = {
            apiKey: "AIzaSyC5D1J15ns8jjXEiEtzyG6wDIgsQ3DrmJ4",
            authDomain: "blog-visit-count.firebaseapp.com",
            databaseURL: "https://blog-visit-count-default-rtdb.asia-southeast1.firebasedatabase.app",
            projectId: "blog-visit-count",
            storageBucket: "blog-visit-count.firebasestorage.app",
            messagingSenderId: "394854889275",
            appId: "1:394854889275:web:411c2d0ea6b1c8e4a0691e"
        };
        // Initialize Firebase
        const firebase = initializeApp(firebaseConfig);
        const db = getDatabase(firebase, firebaseConfig.databaseURL);
        const oriUrl = window.location.host;
        const curUrl = oriUrl + window.location.pathname;
    
        const readVisits = async (url, selector) => {
            const dbKey = decodeURI(url.replace(/\/|\./g, '_'));
            let count = 1;
            const res = await get(child(ref(db), dbKey));
            if (res.exists()) {
            count = parseInt(res.val() || 0, 10) + 1;
            }
            await await set(ref(db, dbKey), count);
            if (selector.length > 0) {
            // eslint-disable-next-line no-param-reassign
            selector[0].innerText = count;
            }
        };
    
        readVisits(oriUrl, document.querySelectorAll('#site_visits_count'));
        if (curUrl && curUrl !== '_') {
            readVisits(`page/${curUrl}`, document.querySelectorAll('#page_views_count'));
        }
    };

    // ✅ 加上留言數列表更新
    const updateCommentCounts = async () => {
        const GIST_URL = "https://gist.githubusercontent.com/chyuaner/a06a4eeae2d3013b7796ee96c73ff2ee/raw/blog-comments.json";

        try {
            const res = await fetch(GIST_URL);
            const data = await res.json();
            const counts = data.counts;

            document.querySelectorAll("article.kratos-hentry").forEach(article => {
            const link = article.querySelector("a[href*='/20']"); // 文章連結
            if (!link) return;

            const pathname = new URL(link.href, location.origin).pathname;
            const normalizedPath = pathname.endsWith('/') ? pathname : pathname + '/';
            const count = counts[normalizedPath] || counts[pathname] || 0;

            const span = article.querySelector(".giscus_count");
            if (span) {
                span.textContent = count;
                span.title = `${count} 則留言`;
            }
            });
        } catch (err) {
            console.warn("留言數讀取失敗：", err);
        }
    };

    // 載入＆pjax 重新掛載
    window.loadComments = loadComments;
    updateCommentCounts();
    // 處理Matomo追蹤更新
    _paq.push(['setCustomUrl', window.location.href]);
    _paq.push(['setDocumentTitle', document.title]);
    _paq.push(['trackPageView']);
    window.addEventListener('pjax:success', () => {
        window.loadComments = loadComments;
    });
    initCalendarWidget()
    window.addEventListener('pjax:complete', () => {
        // 處理Matomo追蹤更新
        _paq.push(['setCustomUrl', window.location.href]);
        _paq.push(['setDocumentTitle', document.title]);
        _paq.push(['trackPageView']);
        initCalendarWidget()
        updateCommentCounts();
    });
})();
