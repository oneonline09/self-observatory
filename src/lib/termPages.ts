// Trang chủ đề / hashtag: gom cả ghi chú (field, insight) lẫn nhật ký (journal).
import type { Lang } from '../i18n/ui';
import { getNotes, type Note, type TermCount } from './content';
import { getJournal, type JournalEntry } from './journal';
import { topicUrl, tagUrl } from './urls';
import type { TermKind } from './terms';

const pick = (kind: TermKind) => (x: { data: { topics: string[]; tags: string[] } }) =>
  kind === 'topic' ? x.data.topics : x.data.tags;

export async function getTermCounts(lang: Lang, kind: TermKind): Promise<TermCount[]> {
  const [notes, journal] = await Promise.all([getNotes(lang), getJournal(lang)]);
  const map = new Map<string, number>();
  for (const item of [...notes, ...journal]) {
    for (const term of new Set(pick(kind)(item))) map.set(term, (map.get(term) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug));
}

export interface TermPageProps {
  notes: Note[];
  journal: JournalEntry[];
  altUrl: string | null;
}

export async function getTermPaths(lang: Lang, kind: TermKind) {
  const other: Lang = lang === 'vi' ? 'en' : 'vi';
  const [terms, otherTerms, notes, journal] = await Promise.all([
    getTermCounts(lang, kind),
    getTermCounts(other, kind),
    getNotes(lang),
    getJournal(lang),
  ]);
  const otherSet = new Set(otherTerms.map((x) => x.slug));
  const url = kind === 'topic' ? topicUrl : tagUrl;
  return terms.map((term) => ({
    params: { slug: term.slug },
    props: {
      notes: notes.filter((n) => pick(kind)(n).includes(term.slug)),
      journal: journal.filter((j) => pick(kind)(j).includes(term.slug)),
      altUrl: otherSet.has(term.slug) ? url(other, term.slug) : null,
    } satisfies TermPageProps,
  }));
}
