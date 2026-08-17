# AstroChamiBlog

基于 Astro 7 + Tailwind CSS v4 的个人博客，中英双语。

## 功能特性

- 现代设计体系：渐变导航栏、卡片式文章、Geist/Chillax 字体、Font Awesome 图标
- 全屏首页横幅（固定背景），打字机副标题（Typed.js + 一言 API），社交链接与二维码
- 首页侧边栏（头像、作者等级、统计、公告、友链）+ 带封面/摘要/标签的文章卡片
- 文章页：封面模糊标题叠加、作者与等级标签、信息行（日期、分类、标签、字数、阅读时长）、带滚动监听的粘性目录、版权框、上一篇/下一篇导航、文章推荐（TF-IDF）
- 深色/浅色模式切换（记忆偏好、遵循 `prefers-color-scheme`），导航栏收缩 + 移动端抽屉
- 侧边工具：主题切换、滚动进度百分比/进度条、回到顶部/底部、RSS
- **swup 单页切换**（SPA 过渡 + 预加载 + 进度条 + 滑动动画）
- **站内搜索**（构建期索引、Redefine 风格对话框、关键词高亮）
- **图片查看器**（点击放大、拖拽、滚轮缩放、上/下一张、EXIF 面板）
- **评论系统**（waline / giscus / gitalk / twikoo / utterances / artalk，配置驱动）
- **标签插件**：`{% button %}` `{% callout %}` `{% note %}` `{% folding %}` `{% grid %}` `{% tabs %}`
- **Mermaid** 图表（```mermaid 代码块）、**APlayer** 音乐播放器、**Preloader** 加载动画、**Pangu** 中英文间距
- Shiki 代码高亮（亮/暗主题、mac 风格容器带复制/折叠按钮）、图片懒加载、防转载遮罩、外链图标、表格横向滚动
- 页面：首页（分页）、文章、`/archives`、`/tags`、`/tags/<tag>/`、`/categories`（嵌套）、`/categories/<cat>/`、`/friends`、`/bookmarks`、`/essays`、`/photos`（瀑布流）、`/about`、404
- 页脚：版权、运行时长、站点统计、Vercount 访问量、ICP 备案、自定义注入
- Google Analytics、自定义字体、head/footer 注入、RSS + sitemap

## 项目结构

```text
├── public/
│   ├── fonts/            # Geist、Geist Mono、Chillax 字体
│   ├── fontawesome/      # Font Awesome CSS + 字体文件
│   ├── images/           # favicon、头像、logo、横幅图片
│   └── scripts/          # main.js + Typed.min.js
├── src/
│   ├── config.ts         # 全站唯一配置中心
│   ├── i18n.ts           # 文案（en / zh-CN）
│   ├── components/       # Navbar、Footer、PostCard、TOC 等
│   ├── layouts/BaseLayout.astro
│   ├── pages/            # 首页、blog/[...slug]、tags、categories、archives 等
│   ├── styles/global.css # Tailwind v4 + 主题样式入口
│   ├── plugins/          # remark/rehype 插件（代码容器等）
│   └── content/blog/     # 文章（Markdown & MDX）
├── astro.config.mjs
└── package.json
```

## 配置

所有主题选项都在 **`src/config.ts`** 中：

- `siteConfig` — 站点标题、副标题、作者、网址、语言（`en` / `zh-CN`）
- `themeConfig.colors` — 主色、默认模式
- `themeConfig.home_banner` — 横幅图片、大标题、打字机副标题、社交链接、二维码、消散特效参数
- `themeConfig.navbar` — 导航链接（可带子菜单）、渐变色、宽度、**搜索**（enable/preload/top_n_per_article）
- `themeConfig.home` — 侧边栏、文章卡片选项
- `themeConfig.articles` — 代码块样式/主题、TOC、版权协议、**文章推荐**（enable/title/limit）
- `themeConfig.comment` — 评论系统（`waline`/`giscus`/`gitalk`/`twikoo`/`utterances`/`artalk`）及各自配置
- `themeConfig.plugins` — aplayer 音频、mermaid 主题/版本
- `themeConfig.footer` — 运行时长、统计、ICP、自定义
- `themeConfig.global` — single_page（swup）、preloader、website_counter（Vercount）、google_analytics、inject（head/footer HTML）、自定义字体
- `themeConfig.page_templates` — 标签样式、友链列数、瀑布流分批大小

数据驱动页面读取 `src/data/`：

- `friends.json` — `[{ links_category, has_thumbnail, list: [{ name, link, description, avatar, thumbnail }] }]`
- `bookmarks.json` — `[{ category, icon, items: [{ name, link, description, image }] }]`
- `essays.json` — `[{ date: 'YYYY-MM-DD HH:mm:ss', content: 'markdown' }]`
- `masonry.json` — `[{ image, title, description, width, height, exif }]`

## 文章 Frontmatter

```yaml
---
title: '文章标题'
description: '摘要'
pubDate: '2024-06-19'
updatedDate: '2024-07-01'
cover: './cover.jpg'       # 封面 | banner | thumbnail（thumbnail: false 可关闭）
tags: ['Astro', 'Blog']
categories: ['Guide']       # 嵌套：['Parent', 'Child']
sticky: true                # 置顶
license: 'cc_by_nc_sa'      # 覆盖默认版权协议
toc: false                  # 关闭本文目录
comment: false
expires: '2025-01-01'       # 超过该日期显示"内容可能过时"提示
og_image: './og.jpg'
---
```

## 标签插件

```markdown
{% button 按钮文字, https://example.com %}
{% button url="https://example.com" text="Named" icon="fa-brands fa-github" align="center" %}
{% callout info %}提示内容{% endcallout %}
{% callout warning :: 带标题的提示 %}内容{% endcallout %}
{% note info %}提示内容{% endnote %}
{% folding 折叠标题 %}折叠内容{% endfolding %}
{% folding title="默认展开" open=true %}内容{% endfolding %}
{% grid 2 %}...{% endgrid %}
{% tabs 标签组 %}
<!-- tab 第一个 -->
内容一
<!-- tab 第二个 -->
内容二
{% endtabs %}
```

## 常用命令

| 命令               | 说明                                   |
| :----------------- | :------------------------------------- |
| `npm run dev`      | 启动开发服务器，地址 `localhost:4321`   |
| `npm run build`    | 构建生产站点到 `./dist/`               |
| `npm run preview`  | 预览生产构建产物                       |

## 说明

- 文章 URL 为 `/blog/<slug>/`；首页分页为 `/page/<n>/`。
- 站内搜索（`navbar.search.enable`）无需额外配置——索引在构建期生成（`/search.json`）。
- swup（单页模式）默认开启（`global.single_page`）；带 `data-swup-reload-script` 标记的脚本会在页面切换时重新执行。
- Font Awesome 资源（含部分 Pro 图标）随仓库打包。
- 文章推荐使用纯 JS 的 TF-IDF 分词器（无原生依赖）；搜索索引使用 JSON 格式。

## 致谢

设计语言受 [EvanNotFound](https://github.com/EvanNotFound) 启发，站内页脚保留了原主题署名。
