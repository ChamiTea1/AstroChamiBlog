# Code Review 报告 — AstroChamiBlog


## 一、高优先级（建议上线前修复）


### 2. Waline 深色模式选择器与主题类名不匹配

- 位置：`src/components/Comments.astro:126`
  ```js
  dark: 'body[class~="dark-mode"]',
  ```
- 主题切换脚本在 `<html>` 上加的是 `.dark`/`.light`（`BaseLayout.astro:82-84`），全站不存在 `dark-mode` 类，且 `redefine/plugins/comments/waline.css` 中也没有对应样式。
- 影响：切换主题时 Waline 永远不跟随变暗。当前 `comment.enable=false` 未触发，启用后即失效。
- 建议：改为 `'html.dark'`（与 Waline 文档一致）。

### 3. Gitalk 的 `clientSecret` 被注入前端 HTML

- 位置：`src/components/Comments.astro:62-69`
- `gitalkConfig` 通过 `define:vars` 打进客户端脚本，`clientSecret` 会在页面源码中明文可见。


### 4. 文章过期提示的字符串替换 hack，英文 locale 下失效

- 位置：`src/pages/blog/[...slug].astro:53` + `public/scripts/main.js:1513`
  ```js
  value.innerHTML.replace('some', daysAgo)
  ```
- 依赖 zh-CN 文案恰好含 "some"；`en` 模板 "This post is written %s days ago" 中没有 "some"，替换失败会显示 "written some days ago"。
- 建议：用 `window.i18n.expired.replace('%s', daysAgo)` 重建文案，或在 SSR 阶段把天数算进文案。

### 5. 异常的图片路径会让构建崩溃

- 位置：`src/plugins/rehype-image-size.ts:17`
- `decodeURIComponent(src.slice(...))` 遇到非法百分号序列（如 `/images/100%.jpg`）会抛 `URIError`；`rehypeImageSize` 中 `tasks.push(getLocalImageSize(src).then(...))` 没有 catch，`Promise.all` reject 会直接中断整站构建。
- 建议：把 decode 包进 try/catch，异常时返回 null。

### 6. 内容层问题：死链与过时文案

- `src/content/blog/welcome.md` 链接到 `/comments/`，但 `src/pages/` 下没有该路由 → 404。
- 同文仍写"基于 Hexo 搭建"（实际已是 Astro）。
- `src/data/friends.json`、`bookmarks.json`、`essays.json`、`masonry.json` 均为演示数据（Example Friend 等），上线前需替换。

---

## 二、中优先级

### 7. 推荐模块对每篇文章页全量重建 TF-IDF 语料

- 位置：`src/components/Recommendation.astro:17-108`
- 每渲染一篇文章都对全部文章重新 `getCollection` + tokenize + 建向量矩阵，复杂度 O(N²) 且无缓存。3 篇文章无感，几百篇后构建时间明显膨胀。
- 建议：在 `getStaticPaths` 层计算一次语料，通过 props 传给每页。

### 8. 引用了 config 中不存在的键

- `themeConfig.page_templates.friends_column`（`src/pages/friends.astro:9`）——`page_templates` 只有 `tags_style`，该值永远 undefined，静默走 `grid-cols-2` 分支。
- `theme.page_templates.masonry.batch_size / initial_batch_size`（`public/scripts/main.js:1719-1720`）同样未定义，静默回退 24/12。
- 属于"写了配置项但没接上"。安装 `@astrojs/check` 后这两处会报类型错误。

### 9. `astro check` 开箱即用不了

- `package.json` 缺少 `@astrojs/check` 与 `typescript` devDependencies（实测 `npx astro check` 卡在交互式安装提示）。
- `tsconfig.json` 的 `include: ["**/*"]` 只 exclude `dist`，会把 `node_modules` 卷进检查。
- 建议：补充 devDependencies，并 exclude `node_modules`。

### 10. moment 全站加载但只有随笔页使用

- `BaseLayout.astro:159` 每页 defer 加载 `moment-with-locales.min.js`（375KB），只有 `initEssays`（`main.js:1653`）用到；`public/scripts/` 下还同时存在 `moment.min.js`（重复文件）。
- 建议：仅 essays 页按需加载，或直接用 `Intl.DateTimeFormat` 移除该依赖。

### 11. 标签 slug 大小写碰撞会构建失败

- `src/utils/collections.ts:46`：slug 一律 `toLowerCase()`。若同时存在 `Git` 与 `git` 两个标签，`getStaticPaths` 会生成重复路由导致构建报错。
- 建议：在 `getTags` 中合并同 slug 标签或显式去重。

### 12. `global.css` 重复 import

- `src/styles/global.css:16` 与 `:22` 均 import `search.css`，删除一行即可。

### 13. 搜索弹窗与图片查看器互相抢占 `body.style.overflow`

- `public/scripts/main.js:769`（closeSearchPopup）与 `:1041`（showViewerHandle）各自直接赋值/清空 `document.body.style.overflow`，同时打开时关闭其一可能恢复错状态。
- 建议：记录并恢复前值，或抽一个统一的 scroll-lock 工具。

### 14. RSS 没有正文

- `src/pages/rss.xml.js` 只 spread 了 frontmatter，无 `content:encoded`，订阅者只能看到标题。
- 功能缺口，非 bug；如需完整订阅体验可补充 `render(post)` 的正文。

### 15. `search.json` 残留 hexo 标签语法

- `stripMarkdown` 不会剥离 `{% bilibili ... %}`、`{% folding %}` 等标记（`src/utils/collections.ts:133-150`），搜索结果文本中会出现原始标签串。

---

## 三、低优先级 / 风格

- **循环注册的脆弱耦合**：`markdown-render.ts` 通过全局 setter 接收 `remark-tags` 的 transformer（`src/plugins/markdown-render.ts:24`、`remark-tags.ts:812`），只有 `astro.config.mjs` 恰好先 import 了 `remark-tags` 才生效；若未来 essays 页独立使用而 config 不再引用，标签渲染会静默失效。建议在 config 中显式初始化一次。
- **`PostMeta.formatArticleDate` 边界 bug**：`src/components/PostMeta.astro:16` 的 `.replace(':00','')` 只替换第一个 `:00`，`17:00:30` 会变 `17:30`。
- **`renderGrid` cols 无上限**：`src/plugins/remark-tags.ts:343`，`{% grid 999999 %}` 会生成超长 inline style。
- **自定义 license 走 `set:html`**：`src/components/Copyright.astro:32`，与 `footer.customize` 一样属"仅信任站主输入"，风险低，但建议保留注释说明。
- **`i18nJson`/`langAgo` 未做 `<` 转义**：`BaseLayout.astro:32-33`，与 `clientConfig` 的 `replace(/</g,'\\u003c')` 不一致；当前字符串全静态无风险，保持一致性更好。
- **Footer 起始日期非 ISO 格式**：`src/config.ts:325` 的 `'2026/8/10 00:00:00'` 在 V8 下可用，Safari 等引擎解析行为不保证一致，建议改 ISO。
- **PostCard 封面无 width/height**：`src/components/PostCard.astro:58`，首屏 CLS 依然存在（`rehypeImageSize` 只覆盖正文图片）。
- **书签/友链的 inline `onerror`**：`bookmarks.astro:43`、`friends.astro:34` 在严格 CSP 下失效；书签占位图若也 404 理论上有循环风险，建议改为 JS 事件绑定。
- **`main.js` 未压缩**（约 60KB）直接线上引用，博客场景可接受，构建时顺手 terser 更佳。
- 演示内容与占位数据（见高优 #6）需在发布前清理。

---

