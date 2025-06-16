// scripts/markdown-it.js
const container = require('markdown-it-container');
const anchor = require('markdown-it-anchor');

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

  // 自訂 markdown-it-anchor 的 slugify 方法，讓它模仿 Hexo 原本的 id 輸出風格（通常是直接使用原始文字或經過 slugize 的簡體/拼音化方式）。
  // 移除舊的 anchor plugin（若已存在）
  const oldIndex = md.core.ruler.__rules__.findIndex(r => r.name === 'anchor');
  if (oldIndex !== -1) {
    md.core.ruler.__rules__.splice(oldIndex, 1);
  }
  // 設定 slugify 為保留原始字串（不做 URL encode）
  md.use(anchor, {
    slugify: s => s,
    permalink: false
  });
});
