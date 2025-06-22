const isDraftMode = hexo.env.args.draft || false;

hexo.extend.filter.register('before_post_render', function (data) {
  data.content = data.content.replace(
    /{%\s*hide(?:\s+([a-zA-Z0-9_-]+))?\s*%}([\s\S]*?){%\s*endhide\s*%}/g,
    function (match, mode, content) {
      if (mode === 'draftonly' && isDraftMode) return content;
      return '';
    }
  );
  return data;
});
