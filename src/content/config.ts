import { defineCollection, z } from 'astro:content';

const products = defineCollection({
    schema: z.object({
        title: z.string(),
        description: z.string(),
        excerpt: z.string(),
        icon: z.string(),
        img: z.string().optional(),
        live: z.boolean().optional().default(false),
        category: z.string().optional(),
    }),
});

const blog = defineCollection({
    schema: z.object({
        title: z.string(),
        excerpt: z.string(),
        category: z.string(),
        date: z.string(),
        readTime: z.string(),
        img: z.string().optional(),
        featured: z.boolean().optional().default(false),
    }),
});

export const collections = {
    products,
    blog,
};
