import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string().optional(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			// Cover image (redefine: cover | banner | thumbnail)
			cover: z.union([image(), z.string()]).optional(),
			banner: z.union([image(), z.string()]).optional(),
			thumbnail: z.union([image(), z.string(), z.boolean()]).optional(),
			heroImage: z.union([image(), z.string()]).optional(),
			// Categories & tags
			categories: z.union([z.string(), z.array(z.string())]).optional(),
			category: z.string().optional(),
			tags: z.union([z.string(), z.array(z.string())]).optional(),
			tag: z.string().optional(),
			// Redefine-specific frontmatter
			sticky: z.boolean().optional(),
			license: z.string().optional(),
			copyright: z.string().optional(),
			avatar: z.optional(image()),
			author: z.string().optional(),
			og_image: z.optional(image()),
			og_description: z.string().optional(),
			expires: z.coerce.date().optional(),
			comment: z.boolean().optional(),
			toc: z.boolean().optional(),
		}),
});

export const collections = { blog };
