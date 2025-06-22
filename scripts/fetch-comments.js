import fetch from 'node-fetch';

const ghToken = process.env.GH_TOKEN;
const gistToken = process.env.GIST_TOKEN;
const gistId = process.env.GIST_ID;
const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');

// 🔧 可調整每篇抓幾則留言（越多越完整，API 負擔也越大）
const COMMENTS_PER_DISCUSSION = 3;
const LATEST_COMMENT_COUNT = 5;

async function fetchDiscussions() {
  const query = `
    query {
      repository(owner: "${owner}", name: "${repo}") {
        discussions(first: 100) {
          nodes {
            title
            url
            comments(last: ${COMMENTS_PER_DISCUSSION}) {
              totalCount
              nodes {
                author { login }
                bodyText
                url
                createdAt
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ghToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  });

  const json = await res.json();
  if (!json?.data?.repository?.discussions?.nodes) {
    throw new Error(JSON.stringify(json.errors || json, null, 2));
  }

  return json.data.repository.discussions.nodes;
}

function extractPathFromUrl(discussionUrl) {
  const u = new URL(discussionUrl);
  return u.searchParams.get('pathname') || '/'; // 自訂欄位（giscus 的 mapping）
}

async function buildCommentData() {
  const discussions = await fetchDiscussions();

  const counts = {};
  const allComments = [];

  discussions.forEach(d => {
    const postPath = extractPathFromUrl(d.url);
    counts[postPath] = d.comments.totalCount;

    d.comments.nodes.forEach(c => {
      allComments.push({
        post: postPath,
        author: c.author?.login || '匿名',
        body: c.bodyText.slice(0, 200),
        url: c.url,
        createdAt: c.createdAt
      });
    });
  });

  // 全站最新留言排序
  allComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const latest = allComments.slice(0, LATEST_COMMENT_COUNT);

  return { counts, latest };
}

async function updateGist(content) {
  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${gistToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      files: {
        'comments.json': {
          content: JSON.stringify(content, null, 2)
        }
      }
    })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`更新 Gist 失敗：${res.status} - ${err}`);
  }
}

(async () => {
  try {
    const result = await buildCommentData();
    await updateGist(result);
    console.log('✅ Gist 已更新完成：comments.json');
  } catch (err) {
    console.error('❌ 錯誤：', err);
    process.exit(1);
  }
})();
