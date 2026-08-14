// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { unified } from '@astrojs/markdown-remark';
import { defineConfig } from 'astro/config';
import { siteConfig, markdownConfig } from './src/config';
import { rehypeCodeContainers } from './src/plugins/rehype-code-containers';
import { rehypeExternalLinks, rehypeDeleteMask, rehypeTableScroll, rehypeLazyload, rehypeImageCaption } from './src/plugins/rehype-filters';
import { rehypeImageSize } from './src/plugins/rehype-image-size';
import { remarkRedefineTags } from './src/plugins/remark-tags';
import { remarkMermaid } from './src/plugins/remark-mermaid';

// 插件使用自定义 tree 类型，与 unified 的严格类型不兼容，统一放宽
/** @type {any} */
const remarkPlugins = [remarkRedefineTags, remarkMermaid];
/** @type {any} */
const rehypePlugins = [
	rehypeCodeContainers,
	rehypeExternalLinks,
	rehypeDeleteMask,
	rehypeTableScroll,
	rehypeLazyload,
	rehypeImageCaption,
	rehypeImageSize,
];

// https://astro.build/config
export default defineConfig({
	site: siteConfig.url,
	integrations: [mdx(), sitemap()],
	vite: {
		plugins: [tailwindcss()],
	},
	markdown: {
		processor: unified({
			remarkPlugins,
			rehypePlugins,
		}),
		shikiConfig: {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			themes: {
				light: /** @type {any} */ (markdownConfig.codeThemes.light),
				dark: /** @type {any} */ (markdownConfig.codeThemes.dark),
			},
			wrap: true,
		},
	},
});
