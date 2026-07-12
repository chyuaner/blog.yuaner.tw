(() => {
    const restoreCfEmails = () => {
        const decryptCfEmail = (encodedString) => {
            let email = "";
            const key = parseInt(encodedString.substr(0, 2), 16);
            for (let n = 2; n < encodedString.length; n += 2) {
                const charCode = parseInt(encodedString.substr(n, 2), 16) ^ key;
                email += String.fromCharCode(charCode);
            }
            return email;
        };

        // 1. 處理帶有 __cf_email__ 類別的元素
        document.querySelectorAll('.__cf_email__').forEach(el => {
            const encoded = el.getAttribute('data-cfemail');
            if (encoded) {
                const email = decryptCfEmail(encoded);
                const textNode = document.createTextNode(email);
                el.parentNode.replaceChild(textNode, el);
            }
        });

        // 2. 處理 href 包含 /cdn-cgi/l/email-protection 的 a 標籤
        document.querySelectorAll('a[href*="/cdn-cgi/l/email-protection"]').forEach(a => {
            const href = a.getAttribute('href');
            const hashIndex = href.indexOf('#');
            if (hashIndex !== -1) {
                const encoded = href.substring(hashIndex + 1);
                const email = decryptCfEmail(encoded);
                a.setAttribute('href', 'mailto:' + email);
                if (a.textContent.includes('[email protected]') || a.textContent.includes('[email protected]')) {
                    a.textContent = email;
                }
            }
        });
    };

    // 初次載入執行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', restoreCfEmails);
    } else {
        restoreCfEmails();
    }

    // 每次 PJAX 載入完成後執行
    window.addEventListener('pjax:complete', restoreCfEmails);
})();
