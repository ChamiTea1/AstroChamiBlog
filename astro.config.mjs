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

// https://astro.build/config
export default defineConfig({
	site: siteConfig.url,
	integrations: [mdx(), sitemap()],
	vite: {
		plugins: [tailwindcss()],
	},
	markdown: {
		processor: unified({
			remarkPlugins: [remarkRedefineTags, remarkMermaid],
			rehypePlugins: [rehypeCodeContainers, rehypeExternalLinks, rehypeDeleteMask, rehypeTableScroll, rehypeLazyload, rehypeImageCaption, rehypeImageSize],
		}),
		shikiConfig: {
			themes: {
				light: markdownConfig.codeThemes.light,
				dark: markdownConfig.codeThemes.dark,
			},
			wrap: true,
		},
	},
});
