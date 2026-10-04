// Danh mục chủ đề (topics) & hashtag (tags).
// Bài viết chỉ lưu id; nhãn hiển thị theo ngôn ngữ lấy từ
// src/content/topics/*.yml và src/content/tags/*.yml.
import { getCollection } from 'astro:content';
import type { Lang } from '../i18n/ui';

export type TermKind = 'topic' | 'tag';

type LabelMap = Map<string, { vi: string; en?: string }>;

let _cache: { topic: LabelMap; tag: LabelMap } | null = null;

async function load() {
  if (_cache) return _cache;
  const [topics, tags] = await Promise.all([getCollection('topics'), getCollection('tags')]);
  _cache = {
    topic: new Map(topics.map((e) => [e.id, e.data])),
    tag: new Map(tags.map((e) => [e.id, e.data])),
  };
  return _cache;
}

export interface TermLabels {
  /** Nhãn hiển thị của một id. Id chưa có trong danh mục thì hiện nguyên văn. */
  label(kind: TermKind, id: string, lang: Lang): string;
}

export async function getTermLabels(): Promise<TermLabels> {
  const maps = await load();
  return {
    label(kind, id, lang) {
      const entry = maps[kind].get(id);
      if (!entry) return id;
      return (lang === 'en' ? entry.en : entry.vi) || entry.vi || id;
    },
  };
}
