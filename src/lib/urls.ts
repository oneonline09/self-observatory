// Helper URL thuần (không phụ thuộc astro:content) -> dùng được ở mọi nơi.
import type { Lang } from '../i18n/ui';

export type NoteType = 'field' | 'insight';

export const SECTION: Record<NoteType, string> = {
  field: 'field-notes',
  insight: 'insight-notes',
};

export function localize(path: string, lang: Lang): string {
  // path luôn bắt đầu bằng '/'. vi giữ nguyên, en thêm tiền tố /en.
  if (lang === 'vi') return path;
  return path === '/' ? '/en/' : `/en${path}`;
}

export const homeUrl = (lang: Lang) => localize('/', lang);
export const exploreUrl = (lang: Lang) => localize('/explore/', lang);
export const aboutUrl = (lang: Lang) => localize('/about/', lang);
export const searchUrl = (lang: Lang) => localize('/search/', lang);
export const mapUrl = (lang: Lang) => localize('/map/', lang);
export const sectionUrl = (type: NoteType, lang: Lang) => localize(`/${SECTION[type]}/`, lang);
export const noteUrl = (type: NoteType, lang: Lang, slug: string) =>
  localize(`/${SECTION[type]}/${slug}/`, lang);
export const topicUrl = (lang: Lang, slug: string) => localize(`/topics/${slug}/`, lang);
export const tagUrl = (lang: Lang, slug: string) => localize(`/tags/${slug}/`, lang);
