import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Schema dùng chung cho cả Field Notes và Insight Notes.
// lang + slug được suy ra từ đường dẫn file (vd: "vi/a-note.md"),
// nên KHÔNG cần khai báo trong frontmatter.
const noteSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  summary: z.string().default(''),
  topics: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  // slug của các bài liên quan (cùng type), nối có chủ đích
  connections: z.array(z.string()).default([]),
  // link tới bài đăng mạng xã hội nơi diễn ra thảo luận (tuỳ chọn)
  discuss: z.string().url().optional(),
  cover: z.string().optional(),
  draft: z.boolean().default(false),
});

const field = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/field' }),
  schema: noteSchema,
});

const insight = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/insight' }),
  schema: noteSchema,
});

export const collections = { field, insight };
