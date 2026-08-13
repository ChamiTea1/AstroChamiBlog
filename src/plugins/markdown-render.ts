/**
 * Minimal markdown renderer used for hexo tag bodies and data-driven pages
 * (essays etc.). Full posts go through Astro's own pipeline; this one is for
 * inner content only.
 */

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import { rehypeExternalLinks, rehypeDeleteMask, rehypeTableScroll, rehypeLazyload } from './rehype-filters.ts';

type Node = {
	type: string;
	children?: Node[];
	[prop: string]: unknown;
};

let tagTransformer: ((tree: Node) => void) | null = null;

/** Registers the hexo-tag transformer (set by remark-tags to avoid a circular import). */
export function setTagTransformer(fn: (tree: Node) => void) {
	tagTransformer = fn;
}

function applyTagTransformer() {
	return (tree: Node) => {
		tagTransformer?.(tree);
	};
}

let miniRenderer: ReturnType<typeof unified> | null = null;

function getMiniRenderer() {
	if (!miniRenderer) {
		miniRenderer = unified()
			.use(applyTagTransformer)
			.use(remarkGfm)
			.use(remarkRehype, { allowDangerousHtml: true })
			.use(rehypeExternalLinks)
			.use(rehypeDeleteMask)
			.use(rehypeTableScroll)
			.use(rehypeLazyload)
			.use(rehypeRaw)
			.use(rehypeStringify, { allowDangerousHtml: true });
	}
	return miniRenderer;
}

export function renderMarkdownBody(nodes: Node[]): string {
	const root: Node = { type: 'root', children: nodes };
	const processor = getMiniRenderer();
	const hast = processor.runSync(root as never);
	return String(processor.stringify(hast as never)).trim();
}

let stringRenderer: ReturnType<typeof unified> | null = null;

/** Renders a markdown string to HTML (no Shiki highlighting). */
export function renderMarkdownString(markdown: string): string {
	if (!stringRenderer) {
		stringRenderer = unified()
			.use(remarkParse)
			.use(applyTagTransformer)
			.use(remarkGfm)
			.use(remarkRehype, { allowDangerousHtml: true })
			.use(rehypeExternalLinks)
			.use(rehypeDeleteMask)
			.use(rehypeTableScroll)
			.use(rehypeLazyload)
			.use(rehypeRaw)
			.use(rehypeStringify, { allowDangerousHtml: true });
	}
	const file = stringRenderer.processSync(markdown);
	return String(file.value).trim();
}

let parseProcessor: ReturnType<typeof unified> | null = null;

/** Parses a markdown string into mdast root children. */
export function parseMarkdown(markdown: string): Node[] {
	if (!parseProcessor) {
		parseProcessor = unified().use(remarkParse);
	}
	const tree = parseProcessor.parse(markdown) as unknown as Node;
	return tree.children ?? [];
}
