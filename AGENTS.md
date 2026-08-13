## 开发

启动开发服务器时，请使用后台模式：

```
astro dev --background
```

使用 `astro dev stop`、`astro dev status` 和 `astro dev logs` 管理后台服务器。

## 文档

完整文档：https://docs.astro.build

在处理相关任务前，请查阅以下指南：

- [添加页面、动态路由或中间件](https://docs.astro.build/en/guides/routing/)
- [使用 Astro 组件](https://docs.astro.build/en/basics/astro-components/)
- [使用 React、Vue、Svelte 或其他框架组件](https://docs.astro.build/en/guides/framework-components/)
- [添加或管理内容](https://docs.astro.build/en/guides/content-collections/)
- [添加样式或使用 Tailwind](https://docs.astro.build/en/guides/styling/)
- [支持多语言](https://docs.astro.build/en/guides/internationalization/)

## 图片规范

- 文章配图：放工程内 `public/images/<主题>/`（例如 `public/images/hakimi/`），单个图片文件超过 4MB 时压缩后再放（可用 `npm run compress-images` 自动处理）。
- 相册（`src/data/masonry.json`）：单个相册 ≤ 20 张照片放工程 `public/images/`；超过 20 张放图床（ChamiTea1 图床仓库），数据文件里填图床 URL。
- 站点固定资源（头像、logo、banner、favicon）：放工程内。
- 图片命名使用小写连字符风格（如 `hakimi-01.jpg`），不要用时间戳等无意义文件名。
- 正文（markdown）图片必须使用 `/images/...` 绝对路径，相对路径不会被打包。
- 图床链接优先使用 jsDelivr 加速：`https://cdn.jsdelivr.net/gh/ChamiTea1/img-bed@main/xxx.jpg`。
- 文章封面建议横版 16:9、宽度 ≥ 1200px（卡片缩略图和文章头图均为横向裁切）。
- 所有图片必须写 alt 文本（影响可访问性与 SEO，开启 `image_caption` 后自动显示为图注）。
- 相册照片注意 EXIF 隐私：公开前剥离 GPS 定位信息；如需在图片查看器中展示拍摄参数，保留相机/光圈/快门等字段但删除 GPS。
- 部署目标是 Cloudflare Pages：注意单部署 20000 文件、单文件 ≤ 25 MiB 的限制。
