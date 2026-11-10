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
      results: z.array(z.string()).min(1),
      order: z.number(),
      cover: image(),
      coverAlt: z.string(),
      preview: z.string().optional(),
      year: z.string(),
      // "How it was made": label/value pairs shown in the pipeline reveal and on the case study
      // (model, steps, seed, render for generative work; stack, platform for products).
      made: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
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
      // Only built experiments are 'live'; ideas still being made say so, never implying finished work.
      status: z.enum(['live', 'in-progress']),
      // Hidden pieces keep their pages but drop out of every listing.
      hidden: z.boolean().optional(),
    }),
});

export const collections = { work, lab };
