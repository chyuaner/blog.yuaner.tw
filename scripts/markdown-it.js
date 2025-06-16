// scripts/markdown-it.js
const container = require('markdown-it-container');

hexo.extend.filter.register('markdown-it:renderer', md => {
  // 一個空字串的 container，用來處理 ::: {.class}
  md.use(container, '', {
    validate: () => true,
    render(tokens, idx) {
      const token = tokens[idx];
      if (token.nesting === 1) {
        // 開始 tag
        const info = token.info.trim();
        return `<div${info ? ` class="${info.replace(/^\{\.|\}$/g, '').replace(/\s*\./g, ' ').trim()}"` : ''}>\n<div>\n`;
      } else {
        // 結尾 tag
        return '</div></div>\n';
      }
    },
  });
});
