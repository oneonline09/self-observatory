import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Schema dùng chung cho cả Field Notes và Insight Notes.
// lang + slug được suy ra từ đường dẫn file (vd: "vi/a-note.md"),
// nên KHÔNG cần khai báo trong frontmatter.
const noteSchema = z.object({
  // Khoá nối bản dịch: hai file vi/en có cùng translationKey là một bài.
  // CMS (Sveltia) tự ghi khoá này = slug của bản tiếng Việt.
  translationKey: z.string().optional(),
  title: z.string(),
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  summary: z.string().default(''),
  // id của chủ đề / hashtag — xem src/content/topics và src/content/tags
  topics: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  // translationKey (= slug bản tiếng Việt) của các bài liên quan cùng type
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
  name: z.string().optional(),
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

// Danh mục chủ đề / hashtag dùng chung cho cả hai ngôn ngữ.
// Mỗi file = một mục; tên file là id (dùng trong URL), bên trong là nhãn vi/en.
const termSchema = z.object({
  vi: z.string(),
  en: z.string().optional(),
});

const topics = defineCollection({
  loader: glob({ pattern: '**/*.{yml,yaml}', base: './src/content/topics' }),
  schema: termSchema,
});

const tags = defineCollection({
  loader: glob({ pattern: '**/*.{yml,yaml}', base: './src/content/tags' }),
  schema: termSchema,
});

export const collections = { field, insight, journal, topics, tags };
