import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';
import { journalUrl } from './urls';

export type ItemKind =
  | 'event'
  | 'read'
  | 'discussion'
  | 'activity'
  | 'program'
  | 'happening'
  | 'situation';

export interface JournalEntry {
  lang: Lang;
  slug: string;
  url: string;
  entry: CollectionEntry<'journal'>;
  data: CollectionEntry<'journal'>['data'];
}

const HIDE_DRAFTS = import.meta.env.PROD;
let _cache: JournalEntry[] | null = null;

export async function getAllJournal(): Promise<JournalEntry[]> {
  if (_cache) return _cache;
  const all = await getCollection('journal');
  const out: JournalEntry[] = [];
  for (const e of all) {
    const parts = e.id.split('/');
    const lang = parts[0] as Lang;
    const slug = parts.slice(1).join('/');
    if (lang !== 'vi' && lang !== 'en') continue;
    if (HIDE_DRAFTS && e.data.draft) continue;
    out.push({ lang, slug, url: journalUrl(lang, slug), entry: e, data: e.data });
  }
  _cache = out;
  return out;
}

export async function getJournal(lang: Lang): Promise<JournalEntry[]> {
  const all = await getAllJournal();
  return all
    .filter((j) => j.lang === lang)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getJournalEntry(lang: Lang, slug: string): Promise<JournalEntry | undefined> {
  const all = await getAllJournal();
  return all.find((j) => j.lang === lang && j.slug === slug);
}

export async function getJournalTranslation(j: JournalEntry): Promise<JournalEntry | undefined> {
  const other: Lang = j.lang === 'vi' ? 'en' : 'vi';
  return getJournalEntry(other, j.slug);
}

// nhãn hiển thị cho mỗi loại mục (dùng key i18n jk.*)
export const KIND_ORDER: ItemKind[] = [
  'event',
  'read',
  'discussion',
  'activity',
  'program',
  'happening',
  'situation',
];
