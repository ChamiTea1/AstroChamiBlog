# Astro 起步套件：博客

```sh
npm create astro@latest -- --template blog
```

> 🧑‍🚀 **经验丰富的宇航员？** 删掉这个文件。祝玩得开心！

功能特性：

- ✅ 极简样式（改成你自己的风格！）
- ✅ 100/100 Lighthouse 性能评分
- ✅ SEO 友好，支持规范链接（canonical URL）和 Open Graph 数据
- ✅ 支持站点地图（Sitemap）
- ✅ 支持 RSS 订阅源
- ✅ 支持 Markdown 与 MDX

## 🚀 项目结构

在你的 Astro 项目中，会看到以下文件夹和文件：

```text
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   └── pages/
├── astro.config.mjs
├── README.md
├── package.json
└── tsconfig.json
```

Astro 会查找 `src/pages/` 目录下的 `.astro` 或 `.md` 文件。每个页面都会根据其文件名暴露为一条路由。

`src/components/` 目录没有什么特殊之处，但我们喜欢把 Astro/React/Vue/Svelte/Preact 组件放在那里。

`src/content/` 目录包含相关的 Markdown 和 MDX 文档"集合"。使用 `getCollection()` 从 `src/content/blog/` 获取文章，并使用可选的 schema 对你的 frontmatter 进行类型检查。更多信息请参阅 [Astro 的内容集合文档](https://docs.astro.build/en/guides/content-collections/)。

任何静态资源（如图片）都可以放在 `public/` 目录中。

## 🧞 命令

所有命令都在项目根目录的终端中运行：

| 命令                   | 操作                                              |
| :--------------------- | :------------------------------------------------ |
| `npm install`          | 安装依赖                                          |
| `npm run dev`          | 在 `localhost:4321` 启动本地开发服务器            |
| `npm run build`        | 将生产站点构建到 `./dist/` 目录                   |
| `npm run preview`      | 在部署前本地预览构建产物                          |
| `npm run astro ...`    | 运行 CLI 命令，如 `astro add`、`astro check`      |
| `npm run astro -- --help` | 获取 Astro CLI 使用帮助                          |

## 👀 想了解更多？

查看[我们的文档](https://docs.astro.build)或加入我们的 [Discord 服务器](https://astro.build/chat)。

## 致谢

本主题基于可爱的 [Bear Blog](https://github.com/HermanMartinus/bearblog/) 制作。
