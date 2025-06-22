// scripts/gen-post-index.js
hexo.extend.generator.register('post-index', function (locals) {
  const map = {};
  locals.posts.sort('-date').forEach(post => {
    map[post.permalink.replace(hexo.config.url, '')] = post.title;
  });
  return {
    path: 'post-index.json',
    data: JSON.stringify(map),
    layout: false
  };
});
