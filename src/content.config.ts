import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const work = defineCollection({
  loader: glob({ base: './src/content/work', pattern: '*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      clientType: z.string(),
      role: z.string(),
      timeline: z.string(),
      outcome: z.string(),
      order: z.number(),
      cover: image(),
      coverAlt: z.string(),
      preview: z.string().optional(),
      quote: z.object({ text: z.string(), who: z.string() }).optional(),
      beforeAfter: z
        .object({
          before: image(),
          after: image(),
          beforeAlt: z.string(),
          afterAlt: z.string(),
          caption: z.string(),
        })
        .optional(),
    }),
});

const lab = defineCollection({
  loader: glob({ base: './src/content/lab', pattern: '*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      order: z.number(),
      image: image(),
      imageAlt: z.string(),
      link: z.string().optional(),
      interactive: z.boolean(),
    }),
});

export const collections = { work, lab };
