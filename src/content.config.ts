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

// Journal: mỗi entry là một ngày; bên trong là danh sách "mục" linh hoạt.
const journalItem = z.object({
  kind: z
    .enum(['event', 'read', 'discussion', 'activity', 'program', 'happening', 'situation'])
    .default('event'),
  name: z.string(),
  link: z.string().optional(),
  context: z.string().optional(),
  occasion: z.string().optional(),
  people: z.array(z.string()).default([]),
  reflection: z.string().optional(),
});

const journal = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/journal' }),
  schema: z.object({
    title: z.string().optional(),
    date: z.coerce.date(),
    theme: z.string().optional(),
    topics: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    items: z.array(journalItem).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { field, insight, journal };
